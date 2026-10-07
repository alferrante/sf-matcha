import { createServer } from 'node:http';
import { createHash, randomBytes } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const BODY_LIMIT = 8192;
const SUCCESS = { success: true, message: 'Thanks. Your signup request has been received.' };
const UNAVAILABLE = { success: false, message: 'Signup is temporarily unavailable. Please try again later.' };
const DEFAULT_ORIGINS = ['https://sanfranciscomatcha.com', 'https://www.sanfranciscomatcha.com'];
export const CONSENT_VERSION = '2026-10-07';

function send(res, status, body, extraHeaders = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  });
  res.end(body == null ? '' : JSON.stringify(body));
}

async function readBody(req) {
  if (Number(req.headers['content-length']) > BODY_LIMIT) {
    const error = new Error('Body too large'); error.status = 413; throw error;
  }
  let length = 0;
  const chunks = [];
  for await (const chunk of req) {
    length += chunk.length;
    if (length > BODY_LIMIT) {
      const error = new Error('Body too large'); error.status = 413; throw error;
    }
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { const error = new Error('Invalid JSON'); error.status = 400; throw error; }
}

export function validEmail(value) {
  if (typeof value !== 'string' || value.length > 254) return false;
  const email = value.trim();
  const parts = email.split('@');
  if (parts.length !== 2 || parts[0].length > 64) return false;
  return /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i.test(email)
    && !parts[0].startsWith('.') && !parts[0].endsWith('.') && !parts[0].includes('..');
}

/** No provider credentials, addresses or response bodies are logged or returned. */
export function createNewsletterHandler({
  apiKey = process.env.RESEND_API_KEY,
  segmentId = process.env.RESEND_SEGMENT_ID,
  origins = [...DEFAULT_ORIGINS, ...(process.env.NEWSLETTER_ALLOWED_ORIGINS || '').split(',').filter(Boolean)],
  fetchImpl = globalThis.fetch,
  now = Date.now,
  rateLimit = 5,
  rateWindowMs = 600_000,
  providerTimeoutMs = 8_000,
  trustProxy = process.env.NEWSLETTER_TRUST_PROXY === 'true',
} = {}) {
  const allowedOrigins = new Set(origins);
  const buckets = new Map();
  const salt = randomBytes(32);

  function consumeRate(req) {
    const forwarded = String(req.headers['x-forwarded-for'] || '').split(',').map(part => part.trim()).filter(Boolean);
    // Enable only behind a proxy that overwrites/appends its verified client IP.
    const ip = trustProxy && forwarded.length ? forwarded.at(-1) : req.socket.remoteAddress || 'unknown';
    const key = createHash('sha256').update(salt).update(ip).digest('hex');
    const time = now();
    for (const [k, bucket] of buckets) if (time - bucket.started >= rateWindowMs) buckets.delete(k);
    let bucket = buckets.get(key);
    if (!bucket) {
      if (buckets.size >= 5000) return false;
      bucket = { started: time, count: 0 }; buckets.set(key, bucket);
    }
    bucket.count += 1;
    return bucket.count <= rateLimit;
  }

  async function provider(path, { method = 'GET', body } = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), providerTimeoutMs);
    try {
      const response = await fetchImpl(`https://api.resend.com${path}`, {
        method,
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: controller.signal,
      });
      // Even an HTTP success must be valid JSON with the expected provider shape.
      const data = await response.json();
      return { status: response.status, ok: response.ok, data };
    } finally { clearTimeout(timeout); }
  }

  async function lookup(email) {
    const result = await provider(`/contacts/${encodeURIComponent(email)}`);
    if (result.status === 404) return null;
    if (!result.ok || !result.data?.id || typeof result.data.unsubscribed !== 'boolean') throw new Error('Provider unavailable');
    return result.data;
  }

  async function addExisting(contact, properties) {
    // Never reset a global opt-out, including on a repeated signup request.
    if (contact.unsubscribed) return;
    const result = await provider(`/contacts/${encodeURIComponent(contact.id)}/segments/${encodeURIComponent(segmentId)}`, { method: 'POST' });
    if (!result.ok || result.data?.id !== segmentId) throw new Error('Provider unavailable');
    const updated = await provider(`/contacts/${encodeURIComponent(contact.id)}`, { method: 'PATCH', body: { properties } });
    if (!updated.ok || updated.data?.id !== contact.id) throw new Error('Provider unavailable');
  }

  return async function newsletterHandler(req, res) {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (path === '/health' && req.method === 'GET') {
      return send(res, 200, { ok: true, signupConfigured: Boolean(apiKey && segmentId) });
    }
    if (path !== '/api/newsletter/subscribe') return send(res, 404, { success: false, message: 'Not found.' });
    const origin = req.headers.origin;
    if (!origin || !allowedOrigins.has(origin)) return send(res, 403, { success: false, message: 'This origin cannot submit signup requests.' });
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    if (req.method === 'OPTIONS') {
      return send(res, 204, null, { 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' });
    }
    if (req.method !== 'POST') return send(res, 405, { success: false, message: 'Use POST to submit a signup request.' }, { Allow: 'POST, OPTIONS' });
    if (!consumeRate(req)) return send(res, 429, { success: false, message: 'Please wait before trying again.' }, { 'Retry-After': String(Math.ceil(rateWindowMs / 1000)) });
    if (!String(req.headers['content-type'] || '').match(/^application\/json(?:\s*;|$)/i)) return send(res, 415, { success: false, message: 'Submit JSON.' });
    let body;
    try { body = await readBody(req); }
    catch (error) { return send(res, error.status || 400, { success: false, message: error.status === 413 ? 'Request is too large.' : 'Invalid signup request.' }); }
    if (!body || Array.isArray(body) || typeof body !== 'object') return send(res, 400, { success: false, message: 'Invalid signup request.' });
    // A filled invisible field is ignored; it never reaches the provider.
    if (body.website) return send(res, 200, SUCCESS);
    if (!validEmail(body.email)) return send(res, 400, { success: false, message: 'Enter a valid email address.' });
    if (body.consent !== true || body.consentVersion !== CONSENT_VERSION) return send(res, 400, { success: false, message: 'Agree to the current SF Matcha email signup terms before signing up.' });
    if (!apiKey || !segmentId) return send(res, 503, UNAVAILABLE);
    const email = body.email.trim().toLowerCase();
    try {
      const properties = {
        sfmatcha_consent_at: new Date(now()).toISOString(),
        sfmatcha_consent_version: CONSENT_VERSION,
        sfmatcha_signup_source: 'homepage',
      };
      const contact = await lookup(email);
      if (contact) await addExisting(contact, properties);
      else {
        const created = await provider('/contacts', { method: 'POST', body: { email, unsubscribed: false, segments: [{ id: segmentId }], properties } });
        if (!created.ok || !created.data?.id) {
          // Handle a concurrent create by checking the actual subscription state.
          if (created.status !== 409) throw new Error('Provider unavailable');
          const racedContact = await lookup(email);
          if (!racedContact) throw new Error('Provider unavailable');
          await addExisting(racedContact, properties);
        }
      }
      return send(res, 200, SUCCESS);
    } catch { return send(res, 503, UNAVAILABLE); }
  };
}

export function createNewsletterServer(options) {
  const server = createServer(createNewsletterHandler(options));
  server.requestTimeout = 15_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 3000);
  createNewsletterServer().listen(port, '0.0.0.0', () => console.log(`Newsletter service listening on port ${port}`));
}
