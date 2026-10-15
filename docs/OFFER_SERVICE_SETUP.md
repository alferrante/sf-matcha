# Offer claim/redemption backend — inactive implementation

Updated October 15, 2026. No offers are activated, no backend is deployed, and no merchant is enrolled by these files. The public `content/offers.json` remains empty. This is tested backend infrastructure, **not a working public offer flow**.

## Implemented

- `server/offers-store.mjs`: file-backed Node SQLite ledger, immediate write transactions, immutable approved terms, capped reservations, one claim per authenticated customer per approved pilot, merchant-scoped redemption and idempotent retries.
- `server/offers-http.mjs`: disabled-by-default JSON POST adapter with bounded bodies, no-store responses and no sensitive logging. It has no auto-start or admin/activation endpoint.
- `tests/offer-service.test.mjs`: real temporary disk databases, restart persistence, independent worker connections racing cap/redemption, auth/scope/identity checks, pause/expiry and HTTP boundary tests. Fixtures are not merchant approvals or real redemptions.
- `server/offer-report.mjs` and `tests/offer-report.test.mjs`: independently disabled, location-authenticated reconciliation summary and CSV, tested against real temporary disk ledgers. Aggregate reports exclude customer/claim identifiers and secrets; they do not activate or modify offers.

Each successful claim reserves one of at most 100 pilot units until the offer ends; there is no reservation timeout or reissue that could silently expand the merchant's exposure. Claims are not counted as successful redemptions. Count only ledger rows with `redeemed` set when reconciling actual redemptions; reconcile merchant/POS evidence separately.

The customer key is an HMAC of a stable identity issuer and subject; emails are not stored. Tokens use 32 random bytes. Their lookup digest is SHA-256; an AES-256-GCM encrypted copy supports identical authenticated claim retries after a lost response. After redemption, the live encrypted copy is cleared. Existing SQLite/WAL/backups may retain ciphertext until maintenance; never describe deletion as guaranteed erasure. Merchant credentials are SHA-256 digests of independently generated high-entropy secrets and checked with `timingSafeEqual`. Database/keys are private infrastructure, never static-site assets.

## Required before any activation

1. Written merchant approval covering the exact location, drink/SKU, $1 USD, exclusions, dates/timezone, cap, funding, staff process and consent to participation. Preserve private evidence; publish only a non-sensitive reference. Existing outreach is not agreement.
2. **Verified customer authentication implementation.** Supply a trusted server `verifyCustomer(req)` that validates a bearer session with signature/provider lookup, issuer, audience, expiry, revocation and verified ownership. Return `{issuer, subject, verified: true}` only after verification. A body email, newsletter subscription/contact ID, arbitrary request header or browser-supplied `verified` flag is NOT identity. Newsletter capture does not verify inbox ownership. No current callback is implemented and no authentication/mail-verification resources were provisioned. Detect multi-account abuse operationally; the core enforces one-per-identity, not proof of one physical human.
3. Private persistent storage and deployment approval. Use Node **24.19+** (tested with 24.19.0). `node:sqlite` is release-candidate in this version; pin/retest upgrades. The absolute database path must be on a mounted durable local disk, not an ephemeral service filesystem, temporary directory or `:memory:`. Use one service instance with local WAL-compatible storage; do not put SQLite on network filesystems or scale across independent disks. Multiple local connections use SQLite write locks. If scale requires remote/multi-instance storage, migrate to transactional shared storage before enabling.
4. Private distinct 32-byte encryption and identity HMAC keys and per-location credentials generated from at least 32 random bytes, installed in the normal deployment secret store. No production key generation or secret extraction was performed here. Back up SQLite and both keys together with restricted access; implement/verify restores and retention. Persisted key-verification fingerprints make startup fail closed if either key changes; keep keys stable across restarts. Credential rotation replaces the location's digest and invalidates old credentials; key/data rotation requires a planned migration, not resetting the ledger.
5. Secure TLS ingress, auth-attempt/customer rate limits, abuse monitoring, bounded verifier timeouts, credential delivery to named staff, a redemption screen/POS procedure and end-to-end verification of the inactive reconciliation export below. There is no staff UI, browser claim page, identity delivery or ingress rate limiter in this module. Do not enable the static claim link until the full claim journey works. Do not treat CORS as authentication; the adapter does not permit cross-origin requests or cookie-based auth.
6. Staging acceptance using test-only offers: concurrent cap and redemption checks, DB/key restore, expiry/pause, wrong merchant rejection, authenticated retry, mobile/staff workflow and accounting. Then enable deliberately with merchant approval and publish the matching public offer only after end-to-end verification.

## Integration contract (server-only, not public config)

`createOfferStore()` and `createOfferHandler()` default to disabled. An integration must explicitly set `enabled: true` on both, with private approved offers, credential digests and the verified identity callback. No environment variable or public JSON file alone activates this module.

Private approved configuration uses the public offer's ID, dates, confirmation reference, status `confirmed`, discount `100`, currency `USD`, cap `1..100`, per-customer limit `1`, plus `merchantId`. Use a stable **location-specific** merchant ID, e.g. `junbi-market-sf`, for the location's staff credential. Customer deduplication is per approved offer/pilot ID, consistent with its published one-per-customer limit; a separately approved future pilot is not a lifetime café ban. Never register a second concurrent offer ID just to bypass a pilot's limit. Publication still needs the separate existing public schema validator with verified shop/address/terms. Private registration validates core mechanics but cannot establish that a merchant actually agreed.

On service startup, missing configured offers become paused. Existing terms cannot be mutated to reset limits; a later new pilot needs new merchant approval and a new offer ID while preserving historical records. An operator can `store.pause(offerId)` immediately. A persisted pause is sticky: even a stale unpaused configuration cannot reactivate it after restart. No unpause operation is implemented; deliberate reactivation needs a separately reviewed procedure and authorization, not clearing the DB. Both new and retried operations fail closed when paused, before start or at/after expiry. Previously saved receipts are historical evidence, not permission for another discount.

| Operation | Request | Boundary |
| --- | --- | --- |
| Claim | `POST /api/offers/{id}/claim`, body `{}`, bearer session, `Idempotency-Key` | Verified server identity required; browser email fields rejected |
| Redeem | `POST /api/offers/{id}/redeem`, body `{merchantId, token}`, `X-Merchant-Key`, `Idempotency-Key` | Merchant credential must match location; token scoped to offer |

Use random URL-safe idempotency keys of 16–128 characters; retain the same key for retries. Repeat claim returns the same token until redeemed, then a receipt status without a token. A different claim key cannot create a second claim. Repeat redemption with the same key returns the same receipt; a different key fails. Pause/expiry overrides retry availability. Never place tokens, merchant keys or sessions in query strings/logs/analytics; use POST over TLS and do not include them in public pages. Requests containing body identity fields fail. SQLite busy/unexpected errors return generic unavailable responses, not a voucher; retry with the same key.

## Private reconciliation — independently disabled

This is an unmounted server API, not a public download link or deployed merchant portal. The master `enabled: true` gate must be set on both store and handler; deliberately set `reportingEnabled: true` on **both** as well to allow reports. Only the exact boolean `true` enables either flag. A customer identity callback is not used for reports; the location's private credential is required instead. A report-enabled HTTP runtime without `verifyCustomer` can serve merchant reports, but claim/redemption routes still return `offers_disabled`. The master flag alone is not a working public claim flow. Enabling reporting does not install a customer verifier or activate offers. `/health` reports `reportsConfigured` separately from `offersConfigured`.

| Operation | Request | Boundary |
| --- | --- | --- |
| Summary | `POST /api/merchant/offers/reconciliation` | JSON body `{merchantId}`, location credential in `X-Merchant-Key` |
| CSV | `POST /api/merchant/offers/reconciliation.csv` | Same authenticated body/header; download response only after complete report succeeds |

Credentials are checked before ledger queries. One location credential cannot select another location or provide an arbitrary offer filter. Unknown locations and incorrect keys return the same JSON `merchant_unauthorized` response. Query parameters and additional body fields are rejected; never send credentials in a URL. Both responses use `Cache-Control: no-store` and `X-Content-Type-Options: nosniff`. A successful CSV has `Content-Disposition: attachment` with a fixed safe filename; errors remain JSON, not partial CSVs. No CORS or cookie-auth integration is added.

Each report is one consistent read-transaction snapshot of **all historical pilots for that location**, including paused, expired and no-longer-configured pilots. It does not unpause them, reissue claims, reset counters or bypass claim/redemption expiry. Rows contain only offer ID, approved dates, pause flag, cap, currency and aggregate counts. No customer identity/hash, claim/receipt ID, token/hash/ciphertext, request key, credential or private confirmation reference is exported. Retain the private ledger and merchant/POS records for individual accounting investigations; this export is aggregate, not a receipt-level audit or proof of POS settlement.

- `reservedClaims` counts issued reservations, including those subsequently redeemed. `unredeemedClaims` counts the remainder; it is **not** money spent, an extra reservation pool, or a promise that expired tokens remain usable.
- `successfulRedemptions` counts ledger rows with a redemption timestamp, once per claim. Retrying a redemption cannot increase it. `discountTotalCents` is that count multiplied by the immutable **100 integer USD cents**; no floating-point dollars or claims-as-redemptions calculation is used.
- The CSV has one row per pilot, including zero-claim pilots. A location with no pilots gets a complete zero summary and CSV header only. Strings are quoted/escaped, and formula-like spreadsheet cells are prefixed safely.
- Both formats allow at most **100 pilot rows**. Above that, the whole request fails with `409 report_limit_exceeded`; it never silently truncates rows or presents partial totals as complete. There is no pagination/date filter. A larger account requires a separately reviewed reporting extension or private offline reconciliation, not deleting historical records.

## Validation and references

Run `node --test tests/offer-service.test.mjs tests/offer-report.test.mjs` and the existing full `npm test`, build and customer-copy audit. Reporting tests cover disabled flags, location isolation, historical reports, integer accounting, duplicate retries, unchanged ledger counters, empty rows, CSV safety, HTTP headers and hard export limits. A green unit suite is not deployment or verified customer identity.

- [Node 24.19 SQLite API](https://nodejs.org/download/release/v24.19.0/docs/api/sqlite.html): file-backed synchronous DB connections, bound parameters, busy timeout.
- [SQLite transactions](https://www.sqlite.org/lang_transaction.html): `BEGIN IMMEDIATE` serializes concurrent writers.
- [Node 24.19 crypto API](https://nodejs.org/download/release/v24.19.0/docs/api/crypto.html): random bytes, authenticated encryption, HMAC and constant-time equal-length comparisons. Surrounding request paths are not claimed to be wholly timing-independent.

No subscriptions, paid resources, production credentials, real claims, emails or merchant contacts were created for this implementation.
