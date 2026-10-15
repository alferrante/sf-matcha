import { createServer } from 'node:http';
import { OfferError } from './offers-store.mjs';
import { reconciliationCSV } from './offer-report.mjs';

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(body));
}
async function bodyJSON(req) {
  if (Number(req.headers['content-length']) > 4096) throw new OfferError(413, 'request_too_large');
  let size = 0; const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 4096) throw new OfferError(413, 'request_too_large');
    chunks.push(chunk);
  }
  let body;
  try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new OfferError(400, 'invalid_json'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new OfferError(400, 'invalid_request');
  return body;
}

/** No CLI auto-start, CORS enablement, cookie auth, identity implementation or live offers. */
export function createOfferHandler({ enabled = false, reportingEnabled = false, store, verifyCustomer } = {}) {
  return async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/health' && req.method === 'GET') return send(res, 200, { ok: true,
        offersConfigured: enabled === true && store?.enabled === true && typeof verifyCustomer === 'function',
        reportsConfigured: enabled === true && store?.enabled === true && reportingEnabled === true && store?.reportingEnabled === true });
      const reportRoute = /^\/api\/merchant\/offers\/reconciliation(\.csv)?$/.exec(url.pathname);
      if (reportRoute) {
        if (enabled !== true || reportingEnabled !== true || store?.enabled !== true || store?.reportingEnabled !== true) return send(res, 503, { error: 'reports_disabled' });
        if (req.method !== 'POST') return send(res, 405, { error: 'post_required' });
        if (url.search) return send(res, 400, { error: 'invalid_request' });
        if (!/^application\/json(?:\s*;|$)/i.test(String(req.headers['content-type'] || ''))) return send(res, 415, { error: 'json_required' });
        const body = await bodyJSON(req);
        if (Object.keys(body).length !== 1 || !Object.hasOwn(body, 'merchantId') || typeof body.merchantId !== 'string') throw new OfferError(400, 'invalid_request');
        const report = store.reconcile({ merchantId: body.merchantId, credential: req.headers['x-merchant-key'] });
        if (!reportRoute[1]) return send(res, 200, report);
        const csv = reconciliationCSV(report);
        res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff', 'Content-Disposition': 'attachment; filename="sf-matcha-reconciliation.csv"' });
        return res.end(csv);
      }
      const route = /^\/api\/offers\/([a-z0-9][a-z0-9-]{0,79})\/(claim|redeem)$/.exec(url.pathname);
      if (!route) return send(res, 404, { error: 'not_found' });
      if (enabled !== true || store?.enabled !== true || typeof verifyCustomer !== 'function') return send(res, 503, { error: 'offers_disabled' });
      if (req.method !== 'POST') return send(res, 405, { error: 'post_required' });
      if (!/^application\/json(?:\s*;|$)/i.test(String(req.headers['content-type'] || ''))) return send(res, 415, { error: 'json_required' });
      // Bearer-only verified identity; never trust body email/subject or arbitrary forwarding headers.
      let identity;
      if (route[2] === 'claim') {
        if (!/^Bearer [A-Za-z0-9._~-]{16,4096}$/.test(String(req.headers.authorization || ''))) throw new OfferError(401, 'verified_identity_required');
        identity = await verifyCustomer(req);
      }
      const body = await bodyJSON(req);
      const allowed = route[2] === 'claim' ? [] : ['merchantId', 'token'];
      if (Object.keys(body).some(key => !allowed.includes(key))) throw new OfferError(400, 'invalid_request');
      const common = { offerId: route[1], idempotencyKey: req.headers['idempotency-key'] };
      const result = route[2] === 'claim'
        ? store.claim({ ...common, identity })
        : store.redeem({ ...common, merchantId: body.merchantId, token: body.token, credential: req.headers['x-merchant-key'] });
      return send(res, 200, result);
    } catch (error) {
      // No auth material, token, identity, SQL or infrastructure error details in responses/logs.
      return send(res, error instanceof OfferError ? error.status : 503,
        { error: error instanceof OfferError ? error.code : 'offer_service_unavailable' });
    }
  };
}
export function createOfferServer(options) {
  const server = createServer(createOfferHandler(options));
  server.requestTimeout = 10_000; server.headersTimeout = 5_000; server.keepAliveTimeout = 5_000;
  return server;
}
