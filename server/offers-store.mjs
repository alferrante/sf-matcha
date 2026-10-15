import { DatabaseSync } from 'node:sqlite';
import { isAbsolute } from 'node:path';
import { createHash, createHmac, randomBytes, timingSafeEqual, createCipheriv, createDecipheriv } from 'node:crypto';
import { MAX_REPORT_OFFERS } from './offer-report.mjs';

export class OfferError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}
const fail = (status, code) => { throw new OfferError(status, code); };
const digest = value => createHash('sha256').update(value).digest('hex');
const identifier = value => typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(value);
const keyOK = value => typeof value === 'string' && /^[A-Za-z0-9_-]{16,128}$/.test(value);
const validStamp = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return false;
  const day = value.slice(0, 10); const parsedDay = Date.parse(`${day}T00:00:00Z`);
  return Number.isFinite(parsedDay) && new Date(parsedDay).toISOString().slice(0, 10) === day
    && Number(value.slice(11, 13)) < 24 && Number(value.slice(14, 16)) < 60
    && Number(value.slice(17, 19)) < 60 && Number.isFinite(Date.parse(value));
};

/** Trusted server-only core. No browser-provided email is accepted as identity. */
export function createOfferStore({ enabled = false, reportingEnabled = false, databasePath, encryptionKey, identityKey,
  merchantCredentialHashes = {}, approvedOffers = [], now = Date.now } = {}) {
  if (enabled !== true) return {
    claim() { fail(503, 'offers_disabled'); }, redeem() { fail(503, 'offers_disabled'); },
    reconcile() { fail(503, 'reports_disabled'); }, reportingEnabled: false,
    pause() { fail(503, 'offers_disabled'); }, close() {}, enabled: false,
  };
  if (typeof databasePath !== 'string' || !isAbsolute(databasePath) || databasePath.includes(':memory:')) throw new Error('A persistent absolute SQLite file path is required');
  for (const key of [encryptionKey, identityKey]) if (!Buffer.isBuffer(key) || key.length !== 32) throw new Error('Two private 32-byte keys are required');
  if (timingSafeEqual(encryptionKey, identityKey)) throw new Error('Use distinct encryption and identity keys');
  const credentials = new Map(Object.entries(merchantCredentialHashes));
  for (const [id, hash] of credentials) if (!identifier(id) || !/^[a-f0-9]{64}$/.test(hash)) throw new Error('Invalid merchant credential hash');
  const db = new DatabaseSync(databasePath, { timeout: 5000 });
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
    CREATE TABLE IF NOT EXISTS offers (
      id TEXT PRIMARY KEY, merchant_id TEXT NOT NULL, starts INTEGER NOT NULL,
      expires INTEGER NOT NULL, cap INTEGER NOT NULL CHECK(cap > 0 AND cap <= 100),
      confirmation TEXT NOT NULL, paused INTEGER NOT NULL CHECK(paused IN (0,1))
    ) STRICT;
    CREATE TABLE IF NOT EXISTS settings (name TEXT PRIMARY KEY, value TEXT NOT NULL) STRICT;
    CREATE TABLE IF NOT EXISTS claims (
      id TEXT PRIMARY KEY, offer_id TEXT NOT NULL REFERENCES offers(id),
      merchant_id TEXT NOT NULL, customer_hash TEXT NOT NULL, request_key TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE, token_cipher TEXT NOT NULL,
      created INTEGER NOT NULL, redeemed INTEGER, redemption_key TEXT,
      UNIQUE(offer_id, customer_hash), UNIQUE(offer_id, customer_hash, request_key)
    ) STRICT;`);
  const transaction = fn => {
    db.exec('BEGIN IMMEDIATE');
    try { const result = fn(); db.exec('COMMIT'); return result; }
    catch (error) { db.exec('ROLLBACK'); throw error; }
  };
  const statement = sql => db.prepare(sql);
  try {
    transaction(() => {
      for (const [name, key] of [['encryption-key-check', encryptionKey], ['identity-key-check', identityKey]]) {
        const fingerprint = createHmac('sha256', key).update(`sfmatcha-offers:${name}:v1`).digest('hex');
        const stored = statement('SELECT value FROM settings WHERE name = ?').get(name);
        if (stored && !timingSafeEqual(Buffer.from(stored.value, 'hex'), Buffer.from(fingerprint, 'hex'))) throw new Error('Private keys changed; explicit ledger migration required');
        statement('INSERT OR IGNORE INTO settings VALUES(?, ?)').run(name, fingerprint);
      }
      const ids = new Set();
      for (const offer of approvedOffers) {
        const starts = Date.parse(offer.startsAt); const expires = Date.parse(offer.expiresAt);
        const confirmed = Date.parse(offer.merchantConfirmedAt);
        if (!identifier(offer.id) || !identifier(offer.merchantId) || ids.has(offer.id)
          || !credentials.has(offer.merchantId) || offer.status !== 'confirmed'
          || !validStamp(offer.merchantConfirmedAt) || confirmed > now()
          || typeof offer.confirmationRef !== 'string' || !offer.confirmationRef.trim() || offer.confirmationRef.length > 400
          || !validStamp(offer.startsAt) || starts <= 0 || !validStamp(offer.expiresAt) || expires <= starts
          || offer.discountCents !== 100 || offer.currency !== 'USD' || offer.perCustomerLimit !== 1
          || !Number.isInteger(offer.redemptionCap) || offer.redemptionCap < 1 || offer.redemptionCap > 100
          || (offer.paused !== undefined && typeof offer.paused !== 'boolean')) throw new Error('Invalid approved private offer configuration');
        ids.add(offer.id);
        const existing = statement('SELECT * FROM offers WHERE id = ?').get(offer.id);
        if (existing && (existing.merchant_id !== offer.merchantId || existing.starts !== starts
          || existing.expires !== expires || existing.cap !== offer.redemptionCap || existing.confirmation !== offer.confirmationRef)) {
          throw new Error('Existing offer terms are immutable; use a new offer ID');
        }
        statement(`INSERT INTO offers VALUES(?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET paused = MAX(offers.paused, excluded.paused)`).run(
          offer.id, offer.merchantId, starts, expires, offer.redemptionCap, offer.confirmationRef, Number(Boolean(offer.paused)));
      }
      // A pause is sticky; restart never unpauses, even with stale configuration.
      for (const row of statement('SELECT id FROM offers').all()) {
        if (!ids.has(row.id)) statement('UPDATE offers SET paused = 1 WHERE id = ?').run(row.id);
      }
    });
  } catch (error) { db.close(); throw error; }

  function activeOffer(id) {
    const offer = statement('SELECT * FROM offers WHERE id = ?').get(id);
    const time = now();
    if (!offer || offer.paused || time < offer.starts || time >= offer.expires) fail(409, 'offer_unavailable');
    return offer;
  }
  function seal(token, claimId) {
    const nonce = randomBytes(12); const cipher = createCipheriv('aes-256-gcm', encryptionKey, nonce);
    cipher.setAAD(Buffer.from(claimId));
    const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
    return Buffer.concat([nonce, cipher.getAuthTag(), encrypted]).toString('base64url');
  }
  function unseal(value, claimId) {
    const bytes = Buffer.from(value, 'base64url');
    const cipher = createDecipheriv('aes-256-gcm', encryptionKey, bytes.subarray(0, 12));
    cipher.setAAD(Buffer.from(claimId)); cipher.setAuthTag(bytes.subarray(12, 28));
    return Buffer.concat([cipher.update(bytes.subarray(28)), cipher.final()]).toString('utf8');
  }
  function authenticateMerchant(id, credential) {
    const expected = credentials.get(id) || '0'.repeat(64);
    const actual = digest(typeof credential === 'string' && credential.length <= 256 ? credential : '');
    if (!timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(actual, 'hex')) || !credentials.has(id)) fail(401, 'merchant_unauthorized');
  }
  return {
    enabled: true,
    reportingEnabled: reportingEnabled === true,
    reconcile({ merchantId, credential }) {
      if (reportingEnabled !== true) fail(503, 'reports_disabled');
      // Authenticate before any ledger lookup; unknown credentials/locations share one error.
      authenticateMerchant(merchantId, credential);
      db.exec('BEGIN');
      try {
        const rows = statement(`SELECT o.id, o.starts, o.expires, o.paused, o.cap,
          COUNT(c.id) AS reserved, COUNT(c.redeemed) AS redeemed
          FROM offers o LEFT JOIN claims c ON c.offer_id = o.id AND c.merchant_id = o.merchant_id
          WHERE o.merchant_id = ? GROUP BY o.id ORDER BY o.starts, o.id LIMIT ?`).all(merchantId, MAX_REPORT_OFFERS + 1);
        // No silent truncation, pagination race or partial totals/CSV downloads.
        if (rows.length > MAX_REPORT_OFFERS) fail(409, 'report_limit_exceeded');
        const offers = rows.map(row => ({ offerId: row.id,
          startsAt: new Date(row.starts).toISOString(), expiresAt: new Date(row.expires).toISOString(),
          paused: row.paused === 1, redemptionCap: row.cap, reservedClaims: row.reserved,
          unredeemedClaims: row.reserved - row.redeemed, successfulRedemptions: row.redeemed,
          discountCents: 100, discountTotalCents: row.redeemed * 100, currency: 'USD' }));
        const totals = offers.reduce((sum, row) => ({ reservedClaims: sum.reservedClaims + row.reservedClaims,
          unredeemedClaims: sum.unredeemedClaims + row.unredeemedClaims,
          successfulRedemptions: sum.successfulRedemptions + row.successfulRedemptions,
          discountTotalCents: sum.discountTotalCents + row.discountTotalCents }),
        { reservedClaims: 0, unredeemedClaims: 0, successfulRedemptions: 0, discountTotalCents: 0 });
        const report = { merchantId, generatedAt: new Date(now()).toISOString(), currency: 'USD',
          discountCents: 100, complete: true, offerCount: offers.length, totals, offers };
        db.exec('COMMIT');
        return report;
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    },
    claim({ offerId, identity, idempotencyKey }) {
      if (!identifier(offerId) || !keyOK(idempotencyKey)) fail(400, 'invalid_request');
      if (identity?.verified !== true || typeof identity.subject !== 'string' || !identity.subject.trim()
        || identity.subject.length > 256 || typeof identity.issuer !== 'string' || !identity.issuer.trim()
        || identity.issuer.length > 256) fail(401, 'verified_identity_required');
      const customerHash = createHmac('sha256', identityKey).update(JSON.stringify([identity.issuer, identity.subject])).digest('hex');
      return transaction(() => {
        const offer = activeOffer(offerId);
        const existing = statement('SELECT * FROM claims WHERE offer_id = ? AND customer_hash = ?').get(offerId, customerHash);
        if (existing) {
          if (existing.offer_id !== offerId || existing.request_key !== idempotencyKey) fail(409, 'customer_limit_reached');
          return { claimId: existing.id, token: existing.redeemed === null ? unseal(existing.token_cipher, existing.id) : null,
            status: existing.redeemed === null ? 'claimed' : 'redeemed', expiresAt: new Date(offer.expires).toISOString() };
        }
        // A claim reserves a unit for the full pilot: every issued token can be honored.
        if (statement('SELECT COUNT(*) AS count FROM claims WHERE offer_id = ?').get(offerId).count >= offer.cap) fail(409, 'offer_cap_reached');
        const claimId = randomBytes(16).toString('hex'); const token = randomBytes(32).toString('base64url');
        statement('INSERT INTO claims VALUES(?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL)').run(
          claimId, offerId, offer.merchant_id, customerHash, idempotencyKey, digest(token), seal(token, claimId), now());
        return { claimId, token, status: 'claimed', expiresAt: new Date(offer.expires).toISOString() };
      });
    },
    redeem({ offerId, merchantId, credential, token, idempotencyKey }) {
      authenticateMerchant(merchantId, credential);
      if (!identifier(offerId) || !keyOK(idempotencyKey) || typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token)) fail(400, 'invalid_request');
      return transaction(() => {
        const offer = activeOffer(offerId);
        if (offer.merchant_id !== merchantId) fail(403, 'merchant_scope_mismatch');
        const claim = statement('SELECT * FROM claims WHERE token_hash = ? AND offer_id = ?').get(digest(token), offerId);
        if (!claim) fail(404, 'claim_not_found');
        if (claim.redeemed !== null) {
          if (claim.redemption_key !== idempotencyKey) fail(409, 'already_redeemed');
          return { claimId: claim.id, status: 'redeemed', redeemedAt: new Date(claim.redeemed).toISOString(), discountCents: 100 };
        }
        const time = now();
        statement('UPDATE claims SET redeemed = ?, redemption_key = ?, token_cipher = ? WHERE id = ? AND redeemed IS NULL').run(time, idempotencyKey, '', claim.id);
        return { claimId: claim.id, status: 'redeemed', redeemedAt: new Date(time).toISOString(), discountCents: 100 };
      });
    },
    // Operator-only, not an HTTP endpoint. It cannot change signed terms or reset counters.
    pause(offerId) { statement('UPDATE offers SET paused = 1 WHERE id = ?').run(offerId); },
    close() { db.close(); },
  };
}
