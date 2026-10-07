import test from 'node:test';
import assert from 'node:assert/strict';
import { createNewsletterServer, validEmail } from '../server/newsletter.mjs';

const ORIGIN = 'http://localhost:8893';
const EMAIL = 'reader@example.com';
const CONSENT = { consent: true, consentVersion: '2026-10-07' };
const PROPERTIES = { sfmatcha_consent_at: '2026-10-07T00:00:00.000Z', sfmatcha_consent_version: '2026-10-07', sfmatcha_signup_source: 'homepage' };
function response(status, data) { return { status, ok: status >= 200 && status < 300, json: async () => data }; }

async function fixture(t, overrides = {}) {
  const calls = [];
  const queue = overrides.queue || [response(404, {}), response(201, { id: 'contact-1' })];
  const server = createNewsletterServer({
    apiKey: 'test-private-key', segmentId: 'sf-matcha-segment', origins: [ORIGIN], now: () => Date.parse('2026-10-07T00:00:00Z'),
    fetchImpl: async (url, options) => {
      calls.push({ url, ...options });
      const next = queue.shift();
      if (next instanceof Error) throw next;
      if (!next) throw new Error('Unexpected provider request');
      return next;
    }, ...overrides,
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  const base = `http://127.0.0.1:${server.address().port}`;
  async function request({ path = '/api/newsletter/subscribe', method = 'POST', headers = {}, body = { email: EMAIL, ...CONSENT, website: '' }, raw } = {}) {
    return fetch(base + path, { method, headers: { Origin: ORIGIN, 'Content-Type': 'application/json', ...headers }, ...(method === 'POST' ? { body: raw ?? JSON.stringify(body) } : {}) });
  }
  return { request, calls, base };
}

test('validated explicit consent creates contact in the isolated segment', async t => {
  const { request, calls } = await fixture(t);
  const res = await request({ body: { email: ' Reader@Example.com ', ...CONSENT, source: 'untrusted', consentAt: '2000-01-01' } });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('access-control-allow-origin'), ORIGIN);
  assert.equal(res.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await res.json(), { success: true, message: 'Thanks. Your signup request has been received.' });
  assert.equal(calls[0].url, 'https://api.resend.com/contacts/reader%40example.com');
  assert.equal(calls[1].method, 'POST');
  assert.equal(calls[1].headers.Authorization, 'Bearer test-private-key');
  assert.deepEqual(JSON.parse(calls[1].body), { email: EMAIL, unsubscribed: false, segments: [{ id: 'sf-matcha-segment' }], properties: PROPERTIES });
});

test('existing opted-out contact returns generic result without any mutation', async t => {
  const { request, calls } = await fixture(t, { queue: [response(200, { id: 'contact-1', unsubscribed: true })] });
  const res = await request();
  assert.equal(res.status, 200);
  assert.equal((await res.json()).success, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, 'GET');
});

test('existing active contact joins this segment without modifying global status', async t => {
  const { request, calls } = await fixture(t, { queue: [response(200, { id: 'contact-1', unsubscribed: false }), response(200, { id: 'sf-matcha-segment' }), response(200, { id: 'contact-1' })] });
  assert.equal((await request()).status, 200);
  assert.equal(calls[1].url, 'https://api.resend.com/contacts/contact-1/segments/sf-matcha-segment');
  assert.equal(calls[1].body, undefined);
  assert.equal(calls[2].method, 'PATCH');
  assert.deepEqual(JSON.parse(calls[2].body), { properties: PROPERTIES });
});

test('concurrent-create duplicate is reread and its opt-out preserved', async t => {
  const { request, calls } = await fixture(t, { queue: [response(404, {}), response(409, { message: 'duplicate' }), response(200, { id: 'contact-1', unsubscribed: true })] });
  assert.equal((await request()).status, 200);
  assert.equal(calls.length, 3);
});

test('invalid email and absent or nonboolean consent do not call provider', async t => {
  const { request, calls } = await fixture(t);
  for (const body of [{ email: 'bad email@invalid', consent: true }, { email: EMAIL }, { email: EMAIL, consent: 'true' }, { email: EMAIL, consent: false }, { email: EMAIL, consent: true, consentVersion: 'stale' }]) {
    assert.equal((await request({ body })).status, 400);
  }
  assert.equal(calls.length, 0);
});

test('missing private setup fails closed with unavailable response', async t => {
  const { request, calls } = await fixture(t, { apiKey: '', segmentId: '' });
  const res = await request();
  assert.equal(res.status, 503);
  assert.equal((await res.json()).success, false);
  assert.equal(calls.length, 0);
  const health = await request({ method: 'GET', path: '/health' });
  assert.deepEqual(await health.json(), { ok: true, signupConfigured: false });
});

test('filled honeypot never stores email', async t => {
  const { request, calls } = await fixture(t);
  assert.equal((await request({ body: { website: 'spam.example' } })).status, 200);
  assert.equal(calls.length, 0);
});

test('exact-origin policy rejects lookalikes and missing Origin before provider', async t => {
  const { request, calls, base } = await fixture(t);
  for (const origin of ['https://sanfranciscomatcha.com.evil.test', 'null', 'http://untrusted.test']) {
    const res = await request({ headers: { Origin: origin } });
    assert.equal(res.status, 403);
    assert.equal(res.headers.get('access-control-allow-origin'), null);
  }
  assert.equal((await fetch(base + '/api/newsletter/subscribe', { method: 'POST', body: '{}' })).status, 403);
  assert.equal(calls.length, 0);
});

test('allowed preflight, health and unsupported methods have explicit contracts', async t => {
  const { request, calls } = await fixture(t);
  const preflight = await request({ method: 'OPTIONS' });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('access-control-allow-methods'), 'POST, OPTIONS');
  assert.equal((await request({ method: 'GET' })).status, 405);
  assert.equal((await request({ method: 'GET', path: '/missing' })).status, 404);
  assert.deepEqual(await (await request({ method: 'GET', path: '/health' })).json(), { ok: true, signupConfigured: true });
  assert.equal(calls.length, 0);
});

test('malformed, nonobject, wrong-type and oversized bodies do not reach provider', async t => {
  const { request, calls } = await fixture(t, { rateLimit: 20 });
  assert.equal((await request({ raw: '{broken' })).status, 400);
  assert.equal((await request({ body: [] })).status, 400);
  assert.equal((await request({ body: null })).status, 400);
  assert.equal((await request({ headers: { 'Content-Type': 'text/plain' } })).status, 415);
  assert.equal((await request({ raw: 'x'.repeat(8193) })).status, 413);
  assert.equal(calls.length, 0);
});

test('rate limit cannot be bypassed through a forged proxy header by default', async t => {
  let clock = 0;
  const { request, calls } = await fixture(t, { rateLimit: 1, rateWindowMs: 1000, now: () => clock });
  assert.equal((await request({ body: { website: 'bot' }, headers: { 'X-Forwarded-For': '1.2.3.4' } })).status, 200);
  const limited = await request({ body: { website: 'bot' }, headers: { 'X-Forwarded-For': '5.6.7.8' } });
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '1');
  clock = 1001;
  assert.equal((await request({ body: { website: 'bot' } })).status, 200);
  assert.equal(calls.length, 0);
});

test('provider failures and invalid success shapes never leak details or fake success', async t => {
  for (const providerResponse of [response(401, { message: 'private-key secret provider details' }), response(200, { id: 'contact-1' }), { status: 200, ok: true, json: async () => { throw new Error('HTML instead'); } }, new Error('sensitive connectivity details')]) {
    const { request } = await fixture(t, { queue: [providerResponse] });
    const res = await request();
    assert.equal(res.status, 503);
    const body = await res.text();
    assert.equal(JSON.parse(body).success, false);
    assert.doesNotMatch(body, /private-key|sensitive|HTML|secret|provider details/);
  }
});

test('provider timeout aborts the request and returns unavailable', async t => {
  const { request } = await fixture(t, {
    providerTimeoutMs: 10,
    fetchImpl: (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('Aborted')), { once: true })),
  });
  assert.equal((await request()).status, 503);
});

test('email validation rejects header injection, malformed local parts and excessive length', () => {
  for (const value of ['a@example.com\r\nBcc:evil@example.com', '.a@example.com', 'a..b@example.com', 'a.@example.com', 'a@-example.com', 'x'.repeat(65) + '@example.com', 'a@example', null]) assert.equal(validEmail(value), false);
  assert.equal(validEmail('reader+sf@example.com'), true);
});
