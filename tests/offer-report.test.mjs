import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { createOfferStore, OfferError } from '../server/offers-store.mjs';
import { createOfferServer } from '../server/offers-http.mjs';
import { MAX_REPORT_OFFERS, reconciliationCSV } from '../server/offer-report.mjs';

const secret = 'fixture-private-location-a-abcdefghijklmnopqrstuvwxyz';
const otherSecret = 'fixture-private-location-b-abcdefghijklmnopqrstuvwxyz';
const digest = text => createHash('sha256').update(text).digest('hex');
const initialTime = Date.parse('2026-10-15T18:00:00Z');
const offer = (id = 'pilot', merchantId = 'cafe-a') => ({ id, merchantId, status: 'confirmed',
  merchantConfirmedAt: '2026-10-13T18:00:00Z', confirmationRef: 'private-fixture-approval-reference',
  startsAt: '2026-10-14T00:00:00Z', expiresAt: '2026-10-16T00:00:00Z',
  discountCents: 100, currency: 'USD', redemptionCap: 100, perCustomerLimit: 1 });
const report = (store, patch = {}) => store.reconcile({ merchantId: 'cafe-a', credential: secret, ...patch });
const claim = (store, subject, offerId = 'pilot') => store.claim({ offerId,
  identity: { issuer: 'fixture-provider', subject, verified: true }, idempotencyKey: 'fixture-request-0001' });
const redeem = (store, issued, patch = {}) => store.redeem({ offerId: 'pilot', merchantId: 'cafe-a',
  credential: secret, token: issued.token, idempotencyKey: 'fixture-redemption-0001', ...patch });
const throwsCode = (fn, code) => assert.throws(fn, error => error instanceof OfferError && error.code === code);
async function fixture(t, patch = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'sfmatcha-report-'));
  const options = { enabled: true, reportingEnabled: true, databasePath: join(directory, 'ledger.sqlite'),
    encryptionKey: randomBytes(32), identityKey: randomBytes(32), now: () => initialTime,
    merchantCredentialHashes: { 'cafe-a': digest(secret), 'cafe-b': digest(otherSecret), 'empty-cafe': digest(otherSecret) },
    approvedOffers: [offer(), offer('other-location-pilot', 'cafe-b'), offer('empty-pilot')], ...patch };
  const store = createOfferStore(options); let closed = false;
  t.after(async () => { if (!closed) store.close(); await rm(directory, { recursive: true, force: true }); });
  return { store, options, close() { store.close(); closed = true; } };
}
async function httpFixture(t, store, patch = {}) {
  const server = createOfferServer({ enabled: true, reportingEnabled: true, store, ...patch });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  return (path = '', body = { merchantId: 'cafe-a' }, headers = {}, method = 'POST') => fetch(
    `http://127.0.0.1:${server.address().port}/api/merchant/offers/reconciliation${path}`, {
      method, headers: { 'Content-Type': 'application/json', 'X-Merchant-Key': secret, ...headers },
      ...(method === 'GET' ? {} : { body: JSON.stringify(body) }),
    });
}

test('reports require explicit boolean enablement independently in store and HTTP adapter', async t => {
  throwsCode(() => report(createOfferStore()), 'reports_disabled');
  for (const enabled of [false, 'true', 1]) throwsCode(() => report(createOfferStore({ enabled, reportingEnabled: true })), 'reports_disabled');
  for (const reportingEnabled of [undefined, false, 'true', 'false', 1]) {
    const { store } = await fixture(t, { reportingEnabled });
    throwsCode(() => report(store), 'reports_disabled');
    const request = await httpFixture(t, store);
    assert.equal((await request()).status, 503);
  }
  const { store } = await fixture(t);
  for (const patch of [{ enabled: false }, { enabled: 'true' }, { reportingEnabled: undefined }, { reportingEnabled: false }, { reportingEnabled: 'true' }, { reportingEnabled: 1 }]) {
    const request = await httpFixture(t, store, patch);
    assert.equal((await request()).status, 503);
  }
});

test('report-enabled HTTP adapter without customer verifier leaves claim disabled and health truthful', async t => {
  const { store } = await fixture(t);
  const server = createOfferServer({ enabled: true, reportingEnabled: true, store });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  assert.deepEqual(await (await fetch(`${base}/health`)).json(), { ok: true, offersConfigured: false, reportsConfigured: true });
  const options = { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Merchant-Key': secret }, body: JSON.stringify({ merchantId: 'cafe-a' }) };
  assert.equal((await fetch(`${base}/api/merchant/offers/reconciliation`, options)).status, 200);
  assert.equal((await fetch(`${base}/api/offers/pilot/claim`, { ...options, body: '{}' })).status, 503);
});

test('aggregate summary counts reservations separately and idempotent retries only once', async t => {
  const { store } = await fixture(t);
  const issued = claim(store, 'private-subject-one');
  assert.deepEqual(claim(store, 'private-subject-one'), issued);
  claim(store, 'private-subject-two');
  const receipt = redeem(store, issued);
  assert.deepEqual(redeem(store, issued), receipt);
  throwsCode(() => redeem(store, issued, { idempotencyKey: 'fixture-redemption-0002' }), 'already_redeemed');
  const result = report(store);
  assert.deepEqual(result.totals, { reservedClaims: 2, unredeemedClaims: 1, successfulRedemptions: 1, discountTotalCents: 100 });
  assert.equal(result.complete, true);
  assert.equal(result.offerCount, 2);
  assert.equal(result.offers.find(row => row.offerId === 'empty-pilot').reservedClaims, 0);
  assert.equal(result.offers[1].discountCents, 100);
  assert.ok(result.offers.every(row => Number.isInteger(row.discountTotalCents)));
});

test('reports authenticate before lookup and reveal only the requested credential location', async t => {
  const { store } = await fixture(t);
  claim(store, 'private-subject', 'other-location-pilot');
  for (const patch of [{ credential: 'wrong' }, { merchantId: 'unknown-location' }, { merchantId: 'cafe-b' }, { credential: undefined }]) {
    throwsCode(() => report(store, patch), 'merchant_unauthorized');
  }
  const a = report(store);
  assert.ok(a.offers.every(row => row.offerId !== 'other-location-pilot'));
  const b = report(store, { merchantId: 'cafe-b', credential: otherSecret });
  assert.equal(b.offerCount, 1); assert.equal(b.totals.reservedClaims, 1);
  const serialized = JSON.stringify(a);
  for (const prohibited of ['private-subject', 'customer_hash', 'token', 'request_key', 'confirmation', secret, digest(secret), 'receiptId', 'claimId']) assert.equal(serialized.includes(prohibited), false);
  const csv = reconciliationCSV(a);
  for (const prohibited of ['private-subject', 'customer_hash', 'token', 'request_key', 'confirmation', secret, digest(secret), 'receiptId', 'claimId', 'other-location-pilot']) assert.equal(csv.includes(prohibited), false);
});

test('paused, expired and no-longer-configured pilots remain visible for historical accounting', async t => {
  const f = await fixture(t); const issued = claim(f.store, 'historical-customer'); redeem(f.store, issued);
  f.store.pause('pilot');
  assert.equal(report(f.store).offers.find(row => row.offerId === 'pilot').paused, true);
  f.close();
  const restarted = createOfferStore({ ...f.options, approvedOffers: [], now: () => Date.parse('2026-10-17T00:00:00Z') });
  t.after(() => restarted.close());
  const result = report(restarted);
  assert.equal(result.totals.successfulRedemptions, 1);
  assert.equal(result.totals.discountTotalCents, 100);
  assert.ok(result.offers.every(row => row.paused));
  assert.ok(result.offers.every(row => Date.parse(row.expiresAt) < Date.parse(result.generatedAt)));
  const request = await httpFixture(t, restarted);
  const response = await request(); assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).totals, result.totals);
  const csv = await request('.csv'); assert.equal(csv.status, 200);
  assert.match(await csv.text(), /"pilot"/);
  throwsCode(() => claim(restarted, 'historical-customer'), 'offer_unavailable');
});

test('summary and CSV are read-only and cannot reset cap or identity counters', async t => {
  const { store, options } = await fixture(t, { approvedOffers: [{ ...offer(), redemptionCap: 1 }] });
  const issued = claim(store, 'fixture-one');
  const db = new DatabaseSync(options.databasePath, { readOnly: true }); t.after(() => db.close());
  const snapshot = () => ({ offers: db.prepare('SELECT * FROM offers ORDER BY id').all(),
    claims: db.prepare('SELECT * FROM claims ORDER BY id').all(), settings: db.prepare('SELECT * FROM settings ORDER BY name').all() });
  const before = snapshot();
  for (let i = 0; i < 3; i++) reconciliationCSV(report(store));
  assert.deepEqual(snapshot(), before);
  throwsCode(() => claim(store, 'fixture-two'), 'offer_cap_reached');
  throwsCode(() => store.claim({ offerId: 'pilot', identity: { issuer: 'fixture-provider', subject: 'fixture-one', verified: true }, idempotencyKey: 'different-request-0001' }), 'customer_limit_reached');
  redeem(store, issued);
  assert.equal(report(store).totals.discountTotalCents, 100);
});

test('empty location has complete zero summary and CSV header without fake redemption rows', async t => {
  const { store } = await fixture(t);
  const result = report(store, { merchantId: 'empty-cafe', credential: otherSecret });
  assert.equal(result.offerCount, 0); assert.deepEqual(result.offers, []);
  assert.deepEqual(result.totals, { reservedClaims: 0, unredeemedClaims: 0, successfulRedemptions: 0, discountTotalCents: 0 });
  assert.equal(reconciliationCSV(result).trim().split('\r\n').length, 1);
});

test('CSV escapes formulas, quotes and line breaks and whitelists aggregate fields', () => {
  for (const danger of ['=SUM(1,2)', '+1', '-1', '@SUM(A1)', '  =1', '\t=1', '\r=1', '\n=1']) {
    const csv = reconciliationCSV({ offers: [{ offerId: danger, token: 'DO-NOT-EXPORT' }] });
    assert.ok(csv.includes(`"'${danger}"`)); assert.equal(csv.includes('DO-NOT-EXPORT'), false);
  }
  assert.ok(reconciliationCSV({ offers: [{ offerId: 'quoted"name\nline' }] }).includes('"quoted""name\nline"'));
});

test('HTTP reports enforce scope, headers, JSON-only errors and never call customer verification', async t => {
  const { store } = await fixture(t); claim(store, 'fixture-one');
  const request = await httpFixture(t, store, { verifyCustomer() { throw new Error('must not verify merchant as a customer'); } });
  const summary = await request(); assert.equal(summary.status, 200);
  assert.equal(summary.headers.get('cache-control'), 'no-store');
  assert.equal((await summary.json()).totals.reservedClaims, 1);
  const csv = await request('.csv'); assert.equal(csv.status, 200);
  assert.equal(csv.headers.get('content-type'), 'text/csv; charset=utf-8');
  assert.equal(csv.headers.get('cache-control'), 'no-store');
  assert.equal(csv.headers.get('x-content-type-options'), 'nosniff');
  assert.match(csv.headers.get('content-disposition'), /^attachment; filename="sf-matcha-reconciliation.csv"$/);
  assert.equal((await csv.text()).includes('other-location-pilot'), false);
  const crossLocation = await request('.csv', { merchantId: 'cafe-b' });
  assert.equal(crossLocation.status, 401);
  const validOtherLocation = await request('', { merchantId: 'cafe-b' }, { 'X-Merchant-Key': otherSecret });
  assert.deepEqual((await validOtherLocation.json()).offers.map(row => row.offerId), ['other-location-pilot']);
  for (const body of [{ merchantId: 'cafe-a' }, { merchantId: 'unknown-location' }, { merchantId: 'cafe-b' }]) {
    const rejected = await request('.csv', body, { 'X-Merchant-Key': 'wrong' });
    assert.equal(rejected.status, 401); assert.equal(rejected.headers.get('content-disposition'), null);
    assert.deepEqual(await rejected.json(), { error: 'merchant_unauthorized' });
  }
  assert.equal((await request('', { merchantId: 'cafe-a', offerId: 'other-location-pilot' })).status, 400);
  assert.equal((await request('?merchantKey=not-supported')).status, 400);
  assert.equal((await request('', {}, {}, 'GET')).status, 405);
  assert.equal((await request('', { merchantId: 'cafe-a' }, { 'Content-Type': 'text/plain' })).status, 415);
});

test('bounded reporting rejects all output instead of silently exporting a partial ledger', async t => {
  const offers = Array.from({ length: MAX_REPORT_OFFERS + 1 }, (_, i) => offer(`pilot-${i}`));
  const exact = await fixture(t, { approvedOffers: offers.slice(0, MAX_REPORT_OFFERS) });
  const complete = report(exact.store);
  assert.equal(complete.offerCount, MAX_REPORT_OFFERS);
  assert.equal(reconciliationCSV(complete).trim().split('\r\n').length, MAX_REPORT_OFFERS + 1);
  const { store } = await fixture(t, { approvedOffers: offers });
  throwsCode(() => report(store, { credential: 'wrong' }), 'merchant_unauthorized');
  throwsCode(() => report(store), 'report_limit_exceeded');
  const request = await httpFixture(t, store);
  for (const extension of ['', '.csv']) {
    const response = await request(extension);
    assert.equal(response.status, 409); assert.equal(response.headers.get('content-disposition'), null);
    assert.deepEqual(await response.json(), { error: 'report_limit_exceeded' });
  }
  assert.throws(() => reconciliationCSV({ offers: Array(MAX_REPORT_OFFERS + 1).fill({}) }), /complete/);
});
