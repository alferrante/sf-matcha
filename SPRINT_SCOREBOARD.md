# SF Matcha sprint scoreboard

Last updated: October 9, 2026. Goal: `GOAL.md`.

## Verified baseline

Repository baseline for October 8: `4e908193bca7135f5cf8163bd3a5b25ab05cd749` (verified current main before work; October 7 history is retained below).

| Metric | Current verified state | Target |
| --- | --- | ---: |
| Directory venues | 89 source/built venues; audit passes 267 fields | Accuracy and freshness |
| Monthly visits | Unknown; Cloudflare beacon exists, export not accessed | 50,000 |
| Active email subscribers | 0 active real subscribers, audience queried October 8; signup live; owned synthetic tests excluded | 10,000 |
| Social followers | Unknown; project accounts not verified | 25,000 |
| Guides | 8 published articles / 27 sourced entries; live verified October 8 | 24 |
| Derivative assets | 24 complete text drafts; six original carousel drafts now rendered as 6 finished sets / 30 PNG slides; 0 posted. Count sets once, not as 30 independent assets | 120 |
| Live confirmed offers | 0 offer records in baseline repository | 20 |
| Redemptions | Unknown; no verified tracking system | 2,000 |
| Awards votes | Unknown; no verified voting system | 1,000 |

## October 7 delivery

- Established an isolated branch from current main; preserved the dirty data checkout and separate newsletter-redesign worktree. Earlier 87-shop local snapshot is stale and must not replace current main.
- Added locked esbuild dependency, four-source build, content-hashed browser asset URLs, safe public configuration generation, and deployment build instructions.
- Stable `dist/*.js` files remain available to the existing venue watcher and copy audit. Deployed index points to versioned files to bypass existing stale-cache entries.
- Changed Blueprint cache rules for stable assets/config to revalidate. Applying live Render configuration still needs verified access to the correct workspace; committed hashed URLs protect the normal Git deploy independently.
- Created persistent goal, evidence standards and this scoreboard. The user explicitly invoked `/goal Execute GOAL.md`; execution continues with parallel agents and a single publisher.
- Validation passed: 89-shop/267-field copy audit; source-to-bundle data parity; deterministic rebuilds; changed source changes browser asset URL; public-config escaping. Browser smoke test could not run because the installed Playwright package has no browser executable; no app/layout source was changed in this foundation release.

Publication: foundation commit `fec2d3005155a1323e2761515f276e0b472ff88d` is verified on main. Live deployment verified October 7: the homepage references all four hashed bundles; all return HTTP 200 and revalidating browser cache headers (`max-age=0`). Clean `npm ci`, rebuild and tests also passed with no generated diff.

## October 7 launch milestones

1. **Guides completed and tested:** six menu-backed articles, 21 entries, sourced October 7. Banana, cold foam/clouds, soy milk, strawberry, ceremonial/hand-whisked, and under $7. Static HTML, canonical URLs, Article and unordered ItemList metadata, source links and directions. No invented tasting rankings. Kumo soy-cloud banana explicitly contains dairy.
2. **Methodology completed:** public Buzzy reason/source/date/review requirements within 90 days, legacy label review disclosure, separate Top Pick and award standards, firsthand evidence before Best awards, no paid award placement.
3. **Merchant preparation completed:** $1-off pilot page, local café-specific proposal planner with preview/download, partner kit, confirmed-offer schema and honest empty-offers feed. No merchant outreach, confirmed offers, vouchers or redemptions claimed. A production claim/redemption service and written confirmation remain prerequisites for active offers.
4. **Newsletter redesign reconciled:** recovered layout, filter tabs, soy selector and map search from the preserved newsletter-redesign worktree. Added primary navigation, guide discovery, dynamic guide/venue counts, explicit consent UI and privacy page. The signup client rejects HTML200 fallbacks and missing success acknowledgement; the form is hidden when no real endpoint is configured.
5. **Email infrastructure blocker verified:** connected Resend initially had only unrelated verified domains and a General segment. Created a dedicated SF Matcha newsletter audience (`81330e1a-e521-40ab-87ed-220feca6e848`) plus consent timestamp/version/source fields; audience query confirms zero contacts. No hosted signup form exists. A server-only credential and dedicated free Render backend have now been provisioned. Connected Supabase contains only an unrelated project, which was not repurposed. Read-only lookup identified the actual `sfmatcha` main-branch service in the connected workspace, establishing the project scope without selecting an unrelated service. The Node newsletter backend and 14 provider-mocked behavioral tests are complete, including consent metadata, exact-origin validation, request limits, timeouts, missing setup, and opt-out preservation. Backend new-subscription persistence is verified; final repeat/browser checks are in progress.

6. **Distribution drafts completed:** 24 source-linked text assets across six guide topics, including carousel copy, Instagram captions, short posts and video scripts. Not posted; no social reach/follower gain or finished visual assets claimed.

7. **Cache continuity fixed:** builds retain previous content-addressed assets so cached older HTML can still load them. A regression test verifies old referenced assets remain after a source change.

Validation: all 41 automated tests, source build, copy audit (89 venues/267 fields), reproducible hashed assets, source-to-built data parity, guide validation/escaping/canonical/schema checks and newsletter client failure/consent handling pass. Browser cannot reach the local preview through the cloud browser; public deployment will be checked in-browser after publication. Launch release `a5c578918663636f9e90193ff88a5d1b8ab58701` published to main and live verified October 7. Canonical homepage/guide hub/methodology/perks return HTTP 200. Browser verifies all six hub links, banana article source/ingredient notes, 89-shop homepage, search returning one SŌHN result, soy filter returning 26 confirmed shops, and café planner creating/downloading a local proposal. No site-origin console errors were observed. Email correctly shows coming soon and does not collect addresses.

Live URLs: [Guides](https://sanfranciscomatcha.com/guides/), [Buzzy/awards approach](https://sanfranciscomatcha.com/methodology/), [Café pilot planner](https://sanfranciscomatcha.com/perks/), [Privacy](https://sanfranciscomatcha.com/privacy/).

Live-review correction: official SŌHN hours confirm Tue–Sun 9am–4pm, Monday closed; corrected the older Wednesday-start directory hours. Lulu official ordering hours confirm Sunday closed; Nagomi official structured hours confirm Mon–Sat 10:30am–5pm and Sunday closed. Clarified the guides to match. Kumo's milk note now distinguishes soy cloud from an unlisted soy-milk substitution and explicitly says the banana drink contains dairy. All 89 IDs and existing excluded/planned-location rules are preserved. Correction published as `632d788f7c29a8437851a4265502ec4c4bcfef49`; source changes and regenerated directory/guide assets verified.

## Next execution queue

1. Establish analytics baseline and project social account access, then distribute the completed guide packages.
2. Verify an SF Matcha sending domain and broadcast unsubscribe before sending any newsletter. Signup capture does not send email.
3. Publish the next verified neighborhood/seasonal guide package and turn text drafts into finished visual assets; keep unknown metrics explicitly unknown until measured.
4. Continue the venue/address watch and update articles when menu evidence changes.
5. Add Buzzy expiry/reason metadata and publish transparent editorial methodology; gather tasting evidence before Best awards.
6. Obtain explicit outreach authorization and merchant confirmation, then implement and deploy authenticated atomic claim/redemption service before activating the first $1-off pilot. The public proposal planner and validation schema are ready.

## Dependencies requiring evidence or access

- Dedicated audience, consent fields, private credential and Render backend are established. Dedicated sending domain `updates.sanfranciscomatcha.com` is prepared but unverified. DNS access and broadcast unsubscribe verification are still needed before sending newsletter emails; exact records are in `docs/EMAIL_DNS_SETUP.md`.
- Analytics data and identified SF Matcha social accounts.
- Firsthand tasting notes/photos for qualitative rankings and awards.
- Explicit outreach authorization and merchant acceptance for $1-off offers.

## Run protocol

The growth lead owns writes to this scoreboard and source publication. Other workstreams provide draft outputs and handoffs. Pull current main, inspect in-progress work, choose unblocked actions, test/audit/build, publish, verify, and log exact evidence. Record attempted paths and specific blockers; continue independent work.

## October 7 user corrections and capture deployment

- Moved Map/Guides/Perks to the right of the logo; removed the subtitle below the logo entirely. Kept verification policy in supporting links.
- Replaced the confusing “good matcha. clear receipts” methodology headline with “How we verify matcha spots”; simplified its evidence explanation and perk copy.
- Created the dedicated free Render capture service from the current repo/main. Health and CORS verified; new-contact signup persisted in Resend with consent timestamp, current policy version and fixed homepage source. The reserved synthetic test record is excluded from actual subscriber counts. No emails sent.
- Repeat signup exposed the provider's updated segment response shape; corrected exact contact/segment validation and added regression coverage. All 45 tests and the 89-venue/267-field audit pass. Publishing the real form with the verified capture endpoint, consent and saving state; final public browser and opt-out checks will be recorded after deployment.
- The static service dashboard is behind a sign-in wall, so its legacy build command was not edited. The compiled client includes a verified public endpoint fallback and retains older hashed assets; the live source-backed build/cache behavior is protected without depending on dashboard changes.

- Live verification of release `47d815b73f8125b3606d12eba0bfe2d39a07e4cf`: Render static and backend deployments report live; canonical homepage, guides hub, methodology, perks, privacy and current app asset match committed bytes. Browser confirms navigation right of logo, no header subtitle, real consent form, required unchecked-consent validation and clear methodology title. Repeat signup still revealed a runtime acknowledgement differing from both documentation shapes; replacing acknowledgement inference with actual membership lookup and bounded provider-rate-limit retries.
- Prepared branded email sending domain with open/click tracking disabled. Provider DNS records are documented; domain remains unverified because DNS access is missing. Capture is independent of delivery; no emails sent.

## October 7 launch verification completed

- **Working email signup is live.** Backend release `ea5f6e79a37a40bb2545bfde9c34a4ae6f8a450a` is live on Render. The actual homepage form required unchecked explicit consent, submitted the reserved synthetic record, showed a real success and updated provider consent time to `2026-10-07T20:26:18.287Z`. No duplicates; dedicated segment membership verified.
- **Opt-out preservation live-tested.** Marked only the owned synthetic test contact globally unsubscribed, submitted it again, received the same generic HTTP 200 response, and confirmed it remained unsubscribed with its consent time unchanged. The test is clearly named, cannot receive broadcasts and is excluded from metrics. Dedicated audience contains one opted-out synthetic record and zero active subscribers.
- **Six guides, standards and merchant preparation are live.** The guide hub, all six articles, Buzzy/Top Pick/award methodology and $1-off proposal planner were published and verified. The planner previews/downloads local café-specific terms; there are zero merchant-confirmed offers, active coupons, recorded redemptions or award winners. Coupon activation still requires merchant confirmation and authenticated claim/redemption infrastructure.
- **Latest user corrections verified.** Browser measures navigation to the right of the logo and zero subtitle paragraphs; signup no longer says coming soon; policy page title is “How we verify matcha spots.” Homepage, policy, privacy, perks, guide hub and current app asset matched release `47d815b` bytes. Live screenshot captures header, map and actual signup success.
- **Rate-limit verification:** automated tests verify proxy-header parsing and equivalent-IP buckets. A live request using forged ingress headers returned HTTP 403; it did not yield a rate-bucket result, so no extra live rate-isolation claim is made. Ordinary browser signup and opt-out API requests succeeded.
- **Validation:** 48 tests passed, customer-copy audit passed 89 shops/267 fields, source build passed, changed files passed whitespace checks. Older content-addressed assets remain available, unrelated worktrees preserved.
- **Delivery dependency remains separate:** branded sender `updates.sanfranciscomatcha.com` is prepared, but DNS records in `docs/EMAIL_DNS_SETUP.md` must be configured and verified before subscriber emails are sent. Capture works now; no delivery or confirmed-inbox claim is made.

The initial launch goal is complete for email capture, six factual guides, transparent methodology and merchant preparation. Continue the 90-day growth sprint; the audience, distribution, merchant and awards targets remain outstanding.

## October 8 growth delivery

- Started an isolated checkout from verified current main `4e908193bca7135f5cf8163bd3a5b25ab05cd749`; preserved all dirty/stale worktrees. Inspected live homepage, guide hub, methodology, perks, newsletter health and the latest repository editorial/partner/badge outputs. Existing public pages returned HTTP 200.
- **Two more evidence-backed guides:** Japantown (Best Boy, YakiniQ, Maiko) and Richmond District (Kiss Clement, Pixlcat, Constance), each with three existing venues. Eight guides / 27 entries total; no new venue, tasting ranking, invented price or milk option. Primary-source limitations and October 8 checks are recorded in `docs/EDITORIAL_OCT8.md`.
- **Guide-page signup:** added real explicit-consent capture to the hub and every article using the verified backend. Standalone versioned ESM avoids loading the map application. Saving state, duplicate-submit protection, retry handling, privacy link and unchecked required consent are covered by behavioral tests. The client and server whitelist homepage/hub/article form contexts; this metadata identifies a form, not independently verified traffic/referrer attribution. Older published versioned bundles remain available.
- **Distribution production:** six carousel sets / 30 finished 1080-square PNG slides from the original six sourced guides, with sources, check date and guide CTAs. Ready to export, not posted. Kumo dairy caveats remain visible. Original 24 text drafts are retained; the six rendered carousel sets are conversions of those drafts and are not double-counted.
- **Freshness corrections:** matched directory hours to primary sources for Best Boy Electric, Constance Tea and Kiss of Matcha Clement Sunday closing. All 89 venue IDs, excluded cafés and planned-location rules remain intact. Corrected README’s old instruction to delete published hashed assets.
- Audience query and cleanup confirm zero actual active subscribers; both owned synthetic tests are opted out. Sending domain remains `not_started` as of October 8. No newsletter, café outreach, social post, offer activation or award claim was sent/published. DNS verification, analytics export, identified social account access, merchant confirmation and firsthand tasting evidence remain external dependencies.
- Build and all 57 tests passed, including final gallery/PNG integrity QA and evidence-override regression coverage; customer-copy audit passed all 89 shops / 267 fields. Release `626556ef095ae8f80f3e73bd204cdca6b70952e8` is on main and both Render deployments report live.

### Next unblocked queue

1. Add dated reason/source/review-expiry metadata for legacy Buzzy labels and remove unsupported active labels.
2. Produce the next two sourced guides and their distribution packages; prioritize topics with distinct ordering needs rather than duplicating the map.
3. Implement the authenticated atomic offer claim/redemption service in a safe inactive state, preserving zero participation claims until merchant confirmation.
4. Keep venue/address and menu checks current. Posting/broadcasting waits for identified account access and verified sender setup; partner outreach waits for explicit approval.

### October 8 live verification

- Public guide hub shows all eight articles and its initialized signup form. New Japantown and Richmond articles, export gallery, manifest and new browser bundles return HTTP 200 and match committed bytes. Early hub cache propagation showed the previous six-card HTML briefly; canonical `/guides/` now serves the new release. No cache-busting URL is required for users.
- Actual article form blocked submission without checked consent, then showed saving and genuine success. Provider stored the owned reserved test with source `guide_article`, consent version `2026-10-07`, and server time `2026-10-08T17:58:21.558Z`. Hub submission then updated the same contact to `guides_hub` at `2026-10-08T17:59:30.177Z`, without a duplicate. Dedicated segment membership independently verified. Test globally opted out and named synthetic; zero active real subscribers. No email sent. Screenshot captures actual hub success beside the new guides.
- New guide refinement: Maiko’s fresh official-page uncertainty overrides older directory soy/hours claims within that article. Best Boy and Kiss Clement also use current menu-specific soy wording; Kiss Monday is unlisted rather than asserted closed. Added validated optional evidence overrides and regression coverage; original-guide fallback behavior retained. Publication of this factual refinement is recorded by this commit.
- Metrics moved: **guides 6 → 8**, **finished visual carousel sets 0 → 6 (30 slides)**. Existing 24 text drafts retained, six carousel drafts now rendered; no double counting. Actual subscribers remain 0, posted assets 0, merchant-confirmed offers 0. Visits/followers/redemptions/votes remain unmeasured.
- Live delivery: [eight-guide hub](https://sanfranciscomatcha.com/guides/), [Japantown](https://sanfranciscomatcha.com/guides/japantown-matcha-san-francisco/), [Richmond District](https://sanfranciscomatcha.com/guides/richmond-district-matcha-san-francisco/), [six carousel downloads](https://sanfranciscomatcha.com/social/).

Follow-up verification release `64c303bcbea5718a1c8336a7c6d4ba6b9757fb61` recorded working article/hub signup. All 30 public PNG downloads returned HTTP 200 and independently matched committed SHA-256 bytes after retrying the incomplete initial check. Final neighborhood evidence clarification retains earlier directory records and uses current article-specific source details.

## October 9 partner pipeline

- Established the durable partner ledger and stage model in `content/partner-pipeline.json`, with a readable report in `docs/PARTNER_PIPELINE.md`. The no-duplicates ledger matches directory IDs, names, addresses and aliases and preserves the three standing business exclusions.
- Added two verified independent prospects: **SŌHN — Dogpatch** and **California Kahve — Golden Gate Park**. Both are `ready_for_outreach` and explicitly `not_contacted`; no merchant interest or participation is claimed.
- Prepared unsent, location-specific drafts and proposed six-week terms: $1 off two named matcha drinks, one redemption per customer, 100 successful-redemption cap, $100 maximum proposed merchant discount cost, pause option and written confirmation required. Editorial awards remain separate.
- Verified SŌHN’s leadership, public inbox, address, hours and official $6 Matcha Latte / $7 Banana Oat Milk Matcha menu. Verified California Kahve’s founder first name, public inbox, address, daily hours and always-on Matcha Latte / Lavender Mint Matcha; current prices remain unverified and must be confirmed by the merchant.
- Corrected California Kahve’s directory hours from Tuesday–Sunday to the official current daily 9am–5pm schedule. No offer record was added to `offers.json`; live confirmed offers remain **0**.
- Next action requiring Angela: explicit authorization to send either draft. Until then, keep advancing evidence and the inactive claim/redemption architecture without contacting cafés.
