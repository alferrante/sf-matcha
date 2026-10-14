import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';
import { Worker } from 'node:worker_threads';
import { createOfferStore, OfferError } from '../server/offers-store.mjs';
import { createOfferServer } from '../server/offers-http.mjs';

const credential = 'test-only-merchant-secret-abcdefghijklmnopqrstuvwxyz';
const credentialHash = createHash('sha256').update(credential).digest('hex');
const now = () => Date.parse('2026-10-14T18:00:00Z');
const identity = subject => ({ issuer: 'test-provider', subject, verified: true });
const requestKey = 'request-key-00000001';
const offer = (patch = {}) => ({ id: 'pilot', merchantId: 'test-cafe', status: 'confirmed',
  merchantConfirmedAt: '2026-10-13T18:00:00Z', confirmationRef: 'test-fixture-only',
  startsAt: '2026-10-14T00:00:00Z', expiresAt: '2026-10-15T00:00:00Z',
  discountCents: 100, currency: 'USD', redemptionCap: 2, perCustomerLimit: 1, ...patch });
async function fixture(t, patch = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'sfmatcha-offers-'));
  const options = { enabled: true, databasePath: join(directory, 'offers.sqlite'),
    encryptionKey: randomBytes(32), identityKey: randomBytes(32),
    merchantCredentialHashes: { 'test-cafe': credentialHash, 'other-cafe': credentialHash },
    approvedOffers: [offer()], now, ...patch };
  const store = createOfferStore(options); let closed = false;
  t.after(async () => { if (!closed) store.close(); await rm(directory, { recursive: true, force: true }); });
  return { store, options, close() { store.close(); closed = true; } };
}
const claim = (store, subject = 'customer-one', patch = {}) => store.claim({ offerId: 'pilot', identity: identity(subject), idempotencyKey: requestKey, ...patch });
const redeem = (store, token, patch = {}) => store.redeem({ offerId: 'pilot', merchantId: 'test-cafe', credential, token, idempotencyKey: requestKey, ...patch });
const throwsCode = (fn, code) => assert.throws(fn, error => error instanceof OfferError && error.code === code);

test('offer service is disabled by default and refuses ephemeral/keyless storage', () => {
  throwsCode(() => claim(createOfferStore()), 'offers_disabled');
  for (const enabled of ['false', 'true', 1, {}, null]) throwsCode(() => claim(createOfferStore({ enabled })), 'offers_disabled');
  assert.throws(() => createOfferStore({ enabled: true, databasePath: ':memory:' }), /persistent/);
  assert.throws(() => createOfferStore({ enabled: true, databasePath: '/tmp/not-created.sqlite' }), /32-byte/);
});

test('verified identity only, random hashed token, idempotent claim and no plaintext identity on disk', async t => {
  const { store, options } = await fixture(t);
  for (const bad of [{ email: 'someone@example.com' }, { subject: 'someone', verified: false }, { subject: 'someone', verified: true }]) {
    throwsCode(() => claim(store, 'x', { identity: bad }), 'verified_identity_required');
  }
  const first = claim(store, 'private-customer-identity');
  assert.match(first.token, /^[A-Za-z0-9_-]{43}$/);
  assert.deepEqual(claim(store, 'private-customer-identity'), first);
  throwsCode(() => claim(store, 'private-customer-identity', { idempotencyKey: 'request-key-00000002' }), 'customer_limit_reached');
  for (const path of [options.databasePath, `${options.databasePath}-wal`]) {
    const bytes = await readFile(path);
    assert.equal(bytes.includes(Buffer.from(first.token)), false);
    assert.equal(bytes.includes(Buffer.from('private-customer-identity')), false);
  }
});

test('reservation cap persists across restart and retries recover same token', async t => {
  const f = await fixture(t);
  const first = claim(f.store); claim(f.store, 'customer-two');
  throwsCode(() => claim(f.store, 'customer-three'), 'offer_cap_reached');
  f.close(); const restarted = createOfferStore(f.options); t.after(() => restarted.close());
  assert.deepEqual(claim(restarted), first);
  throwsCode(() => claim(restarted, 'customer-three'), 'offer_cap_reached');
});

test('one successful redemption, idempotent merchant receipt and merchant isolation', async t => {
  const { store } = await fixture(t); const issued = claim(store);
  throwsCode(() => redeem(store, issued.token, { credential: 'wrong' }), 'merchant_unauthorized');
  throwsCode(() => redeem(store, issued.token, { merchantId: 'other-cafe' }), 'merchant_scope_mismatch');
  throwsCode(() => redeem(store, 'x'.repeat(43)), 'claim_not_found');
  const receipt = redeem(store, issued.token);
  assert.equal(receipt.discountCents, 100);
  assert.deepEqual(redeem(store, issued.token), receipt);
  throwsCode(() => redeem(store, issued.token, { idempotencyKey: 'request-key-00000002' }), 'already_redeemed');
  assert.equal(claim(store).token, null);
});

test('customer deduplication applies within each approved pilot, not forever at a café', async t => {
  const { store } = await fixture(t, { approvedOffers: [offer(), offer({ id: 'second-pilot' })] });
  claim(store);
  assert.equal(claim(store, 'customer-one', { offerId: 'second-pilot' }).status, 'claimed');
});

test('pause, future, expiry and missing configuration fail closed, including replay', async t => {
  const f = await fixture(t); const issued = claim(f.store);
  f.store.pause('pilot');
  throwsCode(() => claim(f.store), 'offer_unavailable');
  throwsCode(() => redeem(f.store, issued.token), 'offer_unavailable');
  f.close(); const stale = createOfferStore(f.options);
  throwsCode(() => claim(stale), 'offer_unavailable');
  throwsCode(() => redeem(stale, issued.token), 'offer_unavailable'); stale.close();
  const missing = createOfferStore({ ...f.options, approvedOffers: [] }); t.after(() => missing.close());
  throwsCode(() => claim(missing), 'offer_unavailable');
  for (const clock of [() => Date.parse('2026-10-13T23:59:59Z'), () => Date.parse('2026-10-15T00:00:00Z')]) {
    const changed = createOfferStore({ ...f.options, now: clock });
    throwsCode(() => claim(changed), 'offer_unavailable'); changed.close();
  }
});

test('changing encryption or identity keys fails closed rather than bypassing customer limits', async t => {
  const f = await fixture(t); claim(f.store); f.close();
  for (const field of ['encryptionKey', 'identityKey']) {
    assert.throws(() => createOfferStore({ ...f.options, [field]: randomBytes(32) }), /keys changed/);
  }
  const unchanged = createOfferStore(f.options); t.after(() => unchanged.close());
  assert.equal(claim(unchanged).status, 'claimed');
});

test('unpaused pilot checks start and exact expiry at both claim and redemption', async t => {
  let clock = Date.parse('2026-10-13T23:59:59Z');
  const { store } = await fixture(t, { now: () => clock });
  throwsCode(() => claim(store), 'offer_unavailable');
  clock = Date.parse('2026-10-14T00:00:00Z'); const issued = claim(store);
  clock = Date.parse('2026-10-15T00:00:00Z');
  throwsCode(() => claim(store), 'offer_unavailable');
  throwsCode(() => redeem(store, issued.token), 'offer_unavailable');
});

test('unconfirmed, invalid cap and changed signed terms are rejected', async t => {
  const f = await fixture(t);
  for (const patch of [{ status: 'planned' }, { redemptionCap: 101 }, { merchantConfirmedAt: '2027-01-01' },
    { confirmationRef: '' }, { confirmationRef: 123 }, { startsAt: '2026-10-14T00:00:00' },
    { startsAt: '2026-02-30T00:00:00Z' }, { startsAt: '2026-10-14T24:00:00Z' }]) {
    assert.throws(() => createOfferStore({ ...f.options, approvedOffers: [offer(patch)] }), /Invalid/);
  }
  assert.throws(() => createOfferStore({ ...f.options, approvedOffers: [offer({ redemptionCap: 3 })] }), /immutable/);
  assert.equal(claim(f.store).status, 'claimed'); // Failed configuration transaction did not leave it paused.
});

function inWorker(options, action, args) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(`
      const { workerData, parentPort } = require('node:worker_threads');
      (async () => {
        const { createOfferStore } = await import(workerData.moduleURL);
        const config = { ...workerData.options, encryptionKey: Buffer.from(workerData.options.encryptionKey),
          identityKey: Buffer.from(workerData.options.identityKey), now: () => ${now()} };
        const store = createOfferStore(config);
        try { parentPort.postMessage({ result: store[workerData.action](workerData.args) }); }
        catch (error) { parentPort.postMessage({ code: error.code || error.message }); }
        finally { store.close(); }
      })().catch(error => { throw error; });`, { eval: true, workerData: {
      moduleURL: new URL('../server/offers-store.mjs', import.meta.url).href,
      options: { ...options, now: undefined }, action, args,
    } });
    worker.once('message', resolve); worker.once('error', reject);
  });
}

test('simultaneous independent SQLite connections cannot overshoot cap', async t => {
  const { options } = await fixture(t, { approvedOffers: [offer({ redemptionCap: 1 })] });
  const results = await Promise.all(Array.from({ length: 6 }, (_, i) => inWorker(options, 'claim', {
    offerId: 'pilot', identity: identity(`race-${i}`), idempotencyKey: requestKey,
  })));
  assert.equal(results.filter(value => value.result).length, 1);
  assert.equal(results.filter(value => value.code === 'offer_cap_reached').length, 5);
});

test('simultaneous merchant attempts cannot double redeem', async t => {
  const { options, store } = await fixture(t); const issued = claim(store);
  const results = await Promise.all(Array.from({ length: 5 }, (_, i) => inWorker(options, 'redeem', {
    offerId: 'pilot', merchantId: 'test-cafe', credential, token: issued.token, idempotencyKey: `redemption-key-0000${i}`,
  })));
  assert.equal(results.filter(value => value.result).length, 1);
  assert.equal(results.filter(value => value.code === 'already_redeemed').length, 4);
});

test('HTTP adapter is disabled by default; body email cannot establish identity', async t => {
  const { store } = await fixture(t);
  const servers = []; t.after(async () => { await Promise.all(servers.map(server => new Promise(resolve => server.close(resolve)))); });
  async function post(options, body, headers = {}) {
    const server = createOfferServer(options); servers.push(server);
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    return fetch(`http://127.0.0.1:${server.address().port}/api/offers/pilot/claim`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestKey, ...headers }, body: JSON.stringify(body),
    });
  }
  assert.equal((await post({ store }, {})).status, 503);
  assert.equal((await post({ enabled: true, store }, {})).status, 503);
  const options = { enabled: true, store, verifyCustomer: async () => identity('authenticated-customer') };
  for (const enabled of ['false', 'true', 1]) assert.equal((await post({ ...options, enabled }, {})).status, 503);
  assert.equal((await post(options, { email: 'fake@example.com' })).status, 401);
  const headers = { Authorization: `Bearer ${'test-session-token'.repeat(2)}` };
  assert.equal((await post(options, { email: 'fake@example.com' }, headers)).status, 400);
  const good = await post(options, {}, headers); assert.equal(good.status, 200);
  assert.match((await good.json()).token, /^[A-Za-z0-9_-]{43}$/);
  assert.equal((await post(options, { garbage: 'x'.repeat(5000) }, headers)).status, 413);
});
