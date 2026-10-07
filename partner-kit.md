# SF Matcha $1-off pilot — café partner kit

Proposal prepared October 7, 2026. This document is an invitation to discuss a pilot, not a merchant agreement or proof that any café participates.

The perks page includes a local café pilot planner. It prepares and downloads a café-specific draft in your browser; it does not send contact details, enroll a café or activate an offer.

## The offer

$1 off one eligible matcha drink at your confirmed café location. The café funds each redeemed discount. Suggested pilot: six weeks, capped at 100 successful redemptions per café ($100 maximum discount cost). No participation fee during the pilot. The merchant chooses the eligible drinks, opening and expiry dates, exclusions, and a smaller cap if preferred.

One redemption per café per customer for the pilot. No cash value. Add-ons, tax, delivery orders, or other promotions are included or excluded only as agreed in the written offer terms. A published offer must state the exact location, eligible drinks, expiry including timezone, remaining availability, and restrictions. Café participation never buys an editorial ranking or award.

## Before an offer can go live

1. SF Matcha obtains explicit authorization to contact the café. No outreach is sent automatically.
2. An authorized café representative confirms the location, terms, cap, dates, funding, POS handling, and pause process in writing.
3. The merchant confirms how staff verify and redeem a voucher, including training and a test redemption that is excluded from customer metrics.
4. SF Matcha confirms a working server-side claim/redemption service and the capacity to enforce expiry, cap, and customer limits. A browser-only code display is insufficient for this capped pilot.
5. Both sides confirm the pilot can begin. Only then can the offer be listed as active.

No active café offers are confirmed at launch. Downloading this kit does not enroll a café. No merchant contact address or onboarding form has been verified yet; the site will add the confirmed contact route when available.

## Merchant confirmation checklist

- Business and location name, full street address, and directory shop ID
- Authorized representative's name and role, with written approval retained privately
- Eligible matcha drinks and any minimum purchase
- $1 discount funded by the merchant
- Start and expiry timestamps in America/Los_Angeles, displayed in customer terms
- Successful-redemption cap; suggested 100 per café
- One redemption per café per customer for this pilot
- Add-on, tax, delivery, and discount-stacking rules
- POS process and staff verification instructions
- Customer voucher validity period; expiry never exceeds campaign expiry
- Pause/revoke procedure, merchant dashboard/contact process, reporting cadence
- Disclosure of any future commercial arrangement separately from editorial selection

## Customer flow and service requirements

The public perks page fetches `/offers.json` and displays only structurally valid, explicitly confirmed offers that are within their active dates. It shows the merchant's terms before linking to the configured first-party claim endpoint. The current page does not generate vouchers, collect email addresses, or claim that a redemption succeeded.

The claim service must validate campaign status, merchant confirmation, dates, customer limit, and remaining inventory on the server. It must create an opaque voucher with a server-controlled expiry and an authenticated merchant redemption route. Vouchers must not contain customer email addresses. Increment redemption counts only after staff authenticate and confirm a successful redemption; an offer click, claim, or code reveal is not a redemption.

Use an idempotent atomic transaction for redemption and cap enforcement. Reject reused, expired, revoked, invalid, or paused vouchers. Rate-limit claims, prevent duplicate customer eligibility, and allow a café to pause the campaign immediately. Show accessible pending/error/success states based on actual service responses. Never embed a merchant redemption password or shared secret in public JSON or HTML.

Keep voucher delivery and optional marketing subscription separate. If an email is required for eligibility/voucher delivery, explain that purpose. An optional newsletter checkbox must be unchecked by default; offer access must not be described as newsletter consent. Establish an actual privacy policy, retention policy, email delivery, unsubscribe handling, and appropriate compliance review before collecting customer data. This kit does not provide legal approval.

## Public offer data contract (schema version 1)

`offers.json` contains `schemaVersion: 1`, an ISO `updatedAt` date, and an `offers` array. The array remains empty until merchant confirmation and the production claim service are ready.

Required offer fields:

| Field | Required value |
| --- | --- |
| `id` | Unique lowercase letters/numbers/hyphens; 1–80 characters |
| `shopId` | Existing directory shop ID; integrator must verify it exists |
| `merchantName`, `address` | Verified, non-empty customer-facing strings |
| `status` | Exactly `confirmed` for anything shown to customers |
| `merchantConfirmedAt` | ISO timestamp for the recorded written confirmation |
| `confirmationRef` | Non-sensitive approval reference; underlying approval retained privately |
| `startsAt`, `expiresAt` | ISO timestamps with explicit offset; expiry later than start |
| `discountCents`, `currency` | Exactly `100`, `USD` |
| `redemptionCap` | Positive integer agreed by merchant |
| `perCustomerLimit` | Exactly `1` |
| `terms` | Non-empty array of customer-readable strings including eligible drink, expiry and exclusions |
| `claimPath` | First-party `/api/offers/{id}/claim` endpoint, ready in production |

Optional `paused: true` suppresses display. Do not include customer information, staff credentials, private merchant emails, or raw signed agreements in public JSON.

Publication validation must check unique offer IDs, a real shop ID, current signed terms, and the working endpoint in addition to the browser's structural checks. The browser filters invalid or inactive records but cannot authenticate merchant confirmation or enforce redemption policy.

## Reporting

Report page views, offer-detail clicks, successful claims, successful redemptions, and newsletter opt-ins separately. Reconcile redeemed discounts with each merchant. If measurement is unavailable, report it as unavailable, not zero. Define a repeat-visit measure before promising it in partner reports.

## Next activation step

Prepare the café-specific terms and draft outreach for approval. After explicit outreach authorization and written merchant confirmation, connect the tested claim/redemption service and publish the verified offer record. No coupons should be activated through this kit alone.
