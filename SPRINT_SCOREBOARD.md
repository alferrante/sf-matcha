# SF Matcha sprint scoreboard

Last updated: October 13, 2026. Goal: `GOAL.md`.

## Verified baseline

Repository baseline for October 8: `4e908193bca7135f5cf8163bd3a5b25ab05cd749` (verified current main before work; October 7 history is retained below).

| Metric | Current verified state | Target |
| --- | --- | ---: |
| Directory venues | 96 current-main source/built venues; audit passes 288 fields | Accuracy and freshness |
| Monthly visits | Unknown; Cloudflare beacon exists, export not accessed | 50,000 |
| Active email subscribers | 0 active real subscribers, audience queried October 12; signup live; two opted-out synthetic tests excluded | 10,000 |
| Social followers | Unknown; project accounts not verified | 25,000 |
| Guides | 13 published articles / 45 sourced entries prepared October 13 | 24 |
| Derivative assets | 36 complete drafts across nine topics; nine carousel drafts rendered as 9 finished sets / 48 PNG slides; 0 posted. Count each carousel once, not each slide | 120 |
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

## October 9 Friday growth release

- **Measurement coverage:** extended the existing, privacy-disclosed Cloudflare Web Analytics beacon from the homepage to all 16 public HTML surfaces: the homepage, guide hub, 10 articles, methodology, perks, privacy and social gallery. Build-time injection is idempotent and uses one validated public token; tests prevent missing, duplicate or alternate-host beacons. This enables a future dashboard export to include editorial traffic but does not create or claim a traffic baseline without analytics access.
- **Two new evidence-backed guides:** published an unranked five-stop Mission District route and a four-menu ube matcha guide. Both use existing directory venues and official/current merchant evidence, distinguish incomplete dairy and soy disclosures, and avoid tasting or popularity claims. The directory bundle remains 89 venues. Corrected Binge Coffee House’s current merchant hours to Mon–Fri 9am–6pm and Sat–Sun 9am–7pm.
- **Buzzy receipts enforced:** audited 58 legacy `buzzy: true` flags. All lacked the reason/source/date/review metadata required by the public methodology. The live product now displays only 12 freshly checked labels with a specific reason, HTTPS source, October 9 verification date and review deadline no more than 90 days away; the other 46 legacy flags are suppressed until rechecked. Every active shop detail exposes the receipt and dates. Kumo’s recurring pop-up receives a shorter November 8 review.
- **Metric movement:** guides **8 → 10** and sourced guide entries **27 → 36**. Measured public HTML surfaces **1 → 16**. Visible policy-compliant Buzzy labels are now **12**; this is a credibility correction, not an audience-growth claim. Finished visual sets remain 6/30 slides, actual active subscribers 0, posted assets 0, merchant-confirmed offers 0. Visits, followers, redemptions and votes remain unknown.
- **Validation:** source build produced 10 articles and 16 measured HTML pages; all 65 automated tests passed; customer-copy audit passed 89 shops / 267 fields; changed files passed whitespace checks. No café was contacted and no offer, award, post or email was activated.

Live targets after publication: [guide hub](https://sanfranciscomatcha.com/guides/), [Mission District guide](https://sanfranciscomatcha.com/guides/mission-district-matcha-san-francisco/), [ube matcha guide](https://sanfranciscomatcha.com/guides/ube-matcha-san-francisco/), [Buzzy methodology](https://sanfranciscomatcha.com/methodology/).

Publication: release `d029c38ff6fb6badf52568cede217cc76510e534` is on main and verified live October 9. Browser verification shows 10 guides, 12 visible Buzzy labels, corrected Binge hours and the dated Best Boy evidence receipt. All 16 public HTML surfaces returned HTTP 200 with exactly one approved analytics beacon; deployed app/data assets matched committed SHA-256 bytes.

### Next unblocked queue

1. Render distribution carousel sets for the Mission and ube guides, then prepare the next two source-backed guide packages toward 24.
2. Recheck the next highest-value legacy Buzzy candidates and migrate only those with current official evidence; expire Kumo’s label if its recurring schedule changes.
3. Implement the authenticated atomic claim/redemption service in an inactive state while merchant outreach remains unapproved.

## October 11 approved copy rollout

- Angela approved the concise guide/perks draft and requested publication. Started a clean checkout at verified current main `16a16d7228fa3b4fb46d71acf69de2376a8e60d1`; preserved the local review branch and other worktrees.
- Updated all ten guide-card/article headlines and switched all articles to the compact layout. Removed the hub subtitle. Article copy is 58–65% shorter against the previously visible main content; the hub is 68% shorter. Each article keeps drink names, prices or explicit unknown-price wording, milk/soy caveats, hours, directions and original source links.
- Perks now opens with the honest zero-offers status and puts the local merchant planner in a closed “For café owners” disclosure. Shortened homepage discovery/signup copy, badge/award explanations, privacy text and the social gallery heading. Consent, opt-out behavior, local-only proposal generation and offer-confirmation safeguards are unchanged.
- All 36 guide entries retain their venue IDs, drink names, sources and original October 7–9 verification dates. No new menu-verification claim, venue, ranking, winner, merchant participation, email or social post. Directory remains 89 venues; guides remain 10. This release improves clarity; no audience-growth claim.
- Validation: `npm ci --include=dev`, source build, all 65 tests, customer-copy audit (89 shops / 267 fields), source/date preservation checks and whitespace checks passed. Extended compact-layout regression coverage for fresh soy/hours overrides, unknown prices and HTML escaping. Published hashes will be retained alongside the stable bundles for cached-page compatibility.
- Published release `34e7a7dafb54d10c84f008b97fe933fbf07c96b9` to main through the connected GitHub API after the local CLI lacked write credentials. The published tree exactly matched the tested local tree.
- Live verification completed October 11: all 16 canonical public HTML pages and five current hashed browser assets returned HTTP 200 and matched committed bytes. Six cached pages initially showed the previous release; their five-minute cache expired, and all 21 checks then passed without cache-busting URLs.
- Browser verification confirms the new hub/headlines, compact banana article, shorter badge page, homepage with no header subtitle, initialized signup controls with required unchecked consent, and perks with its merchant tools collapsed by default and opening correctly. No live signup was submitted during this copy-only release.
- Live URLs: [guides](https://sanfranciscomatcha.com/guides/), [perks](https://sanfranciscomatcha.com/perks/), [badge methodology](https://sanfranciscomatcha.com/methodology/), [homepage](https://sanfranciscomatcha.com/). The new README copy rules guide future editorial runs.

## October 12 venue watch

- Added five verified, nonduplicate locations: operating Florecita Panadería (3349 23rd St, tres-leches cold-foam matcha) and Adan Cafe (120 Mason St, banana-pudding matcha); planned California Kahve — Sutter (2108 Sutter St), CHAGEE — City Center (2675 Geary Blvd, C-2), and CHAGEE — Stonestown (3251 20th Ave). The CHAGEE branches are expected in 2027; planned-location cards explicitly leave branch menus, dates and hours unannounced.
- Verified address/status/menu evidence, checked milk disclosures and hours, and documented uncertainty in `docs/VENUE_WATCH_2026-10-12.md`. No new soy confirmation, subjective ranking or Buzzy label. Urban Matcha and Elsewhere remain on address watch. Held Avocado Green because fresh local reporting says temporarily closed for permitting. Preserved README exclusions and Jandii Castro's opening restriction.
- Metrics: directory **89 → 94**. All original 89 venue records and the October 11 concise guide/perks copy are preserved. Guides remain **10**, confirmed offers **0**; no new subscriber, traffic, follower, redemption or vote measurement is claimed.
- Validation: clean dependency install, source build, **65 passing tests**, customer-copy audit **94 shops / 282 fields**, source/bundle parity and whitespace checks. Commit includes source, stable data bundle, current hashed data bundle and index reference together; previously published hashes retained.
- Published release `a611a4b9a4fcd27ce0774bd2de4caf8f4aec2bfa` to main without force using an expected-head lease; its tree exactly matches the tested local tree. October 12 canonical live homepage and currently referenced `dist/data.b6e37f3a2708.js` both returned HTTP 200 and matched committed bytes. Executed the live bundle independently: **94 venues**, all five new IDs present; all original 89 records preserved. Bundle SHA-256: `b6e37f3a2708b1cbce7141307de5d936e961e7473183b0bbca3cb40cb85a34f1`. No cache-busting URL used.
- Evidence report: [October 12 venue watch](docs/VENUE_WATCH_2026-10-12.md). Live directory: https://sanfranciscomatcha.com/.

## October 12 partner pipeline

- Expanded the independent café ledger **2 → 4** with Best Boy Electric — Japantown and Constance Tea — Outer Richmond. Pool now has **3 ready for outreach / 1 researched**, all **not contacted**. Preserved the no-duplicates list and editorial exclusions.
- Prepared two short personalized drafts and location-specific $1-off proposals: Best Boy Matcha Latte / Black Sesame Matcha Latte; Constance standard green matcha only, with reserve/black matcha/einspänner exclusions. Proposed six-week windows, one use per person, 100-redemption cap and maximum $100 merchant-funded discount cost each. Dates remain illustrative; no participation or automatic activation.
- Verified Best Boy's public contact route, hours and $6.50/$7.50 menu. Constance's owner/manager names, official public inbox, address and hours are verified; exact standard-drink SKU and current price remain unresolved because its official menu image could not be fetched. Kept Constance researched instead of falsely marking it ready.
- Refreshed SŌHN's changed official PDF menu link after visually checking the current menu: matcha $6 / banana oat matcha $7 unchanged; oat/almond alternatives listed, soy unlisted. California Kahve's new Sutter branch remains outside its park-only proposal. Full evidence, unsent drafts and next actions are in `content/partner-pipeline.json` and `docs/PARTNER_PIPELINE.md`.
- Confirmed offers remain **0**. No café contacted; no replies, redemptions or audience growth claimed. Explicit send approval, merchant confirmation and a tested claim/redemption service remain prerequisites.
- Validation: clean install, reproducible build with no generated/public-page changes, **65 passing tests**, customer-copy audit **94 shops / 282 fields**, and whitespace checks. Strengthened existing pipeline checks for growing unique locations, inclusive 42-day windows, cap/cost consistency and unresolved research blockers.
- Published partner release `5df9b6dc6263fcfbde55bb99ac74f01fc51fadc3` to main without force under an expected-head lease. Fetched main and verified its entire tree equals the tested local tree. Public page/build outputs were unchanged; canonical `/offers.json` returned HTTP 200 with **0 offers**.

## October 12 growth release

- Started from current main `b8716923a9c7012bc6c209764f45bc68c09b4c33`. Inspected canonical live map, hub, perks, methodology, social gallery, offers feed and newsletter health; all returned HTTP 200 and matched the current repository where applicable. Preserved today's 94 venues and four-prospect partner ledger, all exclusions, planned-location constraints and October 11 concise-copy changes.
- **Two new compact guides:** coconut-water matcha (Bageletto, Kiss Clement, Origin Lab) and matcha without milk (Stonemill, Best Boy, Bageletto), three documented orders each. Fresh primary menu prices, location hours and recipe/foam uncertainty are linked. Origin's foam contains dairy and honey; no coconut-base-to-dairy-free inference. Best Boy's online ordering unavailability is explicit. All original ten guide records and dates are unchanged. Evidence is in `docs/EDITORIAL_OCT12.md`.
- **Reader sharing:** all twelve articles now have a short Share guide control. Native sharing where supported; otherwise copy the canonical article URL. Cancellation does not unexpectedly write the clipboard. Clipboard failure provides a selectable read-only link. Unsafe/nonarticle/tracking canonicals never enable sharing. No contact, post, subscriber email or tracking event was sent by this work.
- **Distribution assets:** completed Mission and ube text packages and carousel renders. Drafts **24 → 32** across eight topics; finished carousel sets **6 → 8**, PNG slides **30 → 43**. Original six sets refreshed to the approved concise headlines/copy; menu dates remain October 7, with Mission/ube October 9. All 43 slides visually checked. Renderer rejects overflow and repeated render hashes match. Carousel sets count once as conversions of their corresponding drafts, not 43 extra growth assets. None posted.
- **Current metrics:** guides **10 → 12**, sourced entries **36 → 42**, analytics-covered public HTML surfaces **16 → 18**. Dedicated audience query October 12 found **0 active real subscribers**; two opted-out synthetic tests excluded. Newsletter health reports signup configured. Sender verification is now **failed** (DKIM and SPF records), with CNAME `not_started`; exact unchanged setup records remain in `docs/EMAIL_DNS_SETUP.md`. Actual monthly visits and project social follower counts remain unknown because no analytics export or identified social account access is available. Offers remain **0**, redemptions/votes unmeasured. These deliveries are not evidence of audience growth.
- **Validation:** `npm ci --include=dev`, build, all **69 tests**, copy audit **94 venues / 282 fields**, source/date preservation, PNG dimensions/bytes/hashes, deterministic rendering and whitespace checks passed. The release includes source, stable and changed hashed app/newsletter bundles, synchronized homepage index, all regenerated pages, sitemap, manifest and binary social files; previously published browser hashes are retained. The homepage guide count is built from guide metadata and now reads 12; its changed app hash and index reference are committed together. The 94-venue data hash remains unchanged.
- Published release `ce495faa5b2d8599e9b94bd5a6eba7e5f1afdba4` to main with expected-head lease and no force. The remote tree exactly matches the tested local tree, including executable renderer mode and all 43 binary slide blobs. Canonical verification passed **69/69 HTTP 200 byte comparisons**: all 18 public HTML surfaces, current browser assets, sitemap, offers/manifest and all 43 PNGs. Hub has **12 cards**; homepage references unchanged 94-venue data and the new app bundle.
- Browser confirms both new guides and initialized unchecked-consent signup. The coconut guide Share button shows “Link copied.” Native/copy/cancel/error behavior is unit-tested; the remote browser automation virtual clipboard remained empty, so pasted clipboard contents were not independently verified. No live subscription was submitted. Live screenshot: `docs/LIVE_GUIDE_2026-10-12.jpg`.

### Next actions

1. Build the inactive authenticated atomic offer claim/redemption service; activate only after written merchant confirmation and approved outreach.
2. Keep producing distinct menu-backed guides toward 24 and distribution formats toward 120.
3. Distribution needs identified project social account access; traffic reporting needs a Cloudflare analytics export; newsletter delivery needs the documented sender DNS records and verified unsubscribe setup. Café outreach remains unsent pending explicit approval.

## October 12 initial partner outreach

- User authorized initial proposals to Best Boy Electric and Constance Tea only. Constance's email was sent and verified in Sent at 10:39pm PT; stage is now `contacted`, awaiting a reply and current item/price confirmation.
- Best Boy's verified Instagram account requires sign-in in the connected browser; approved DM remains unsent. Approval persists for that initial message. SŌHN and California Kahve remain uncontacted; no follow-up or final agreement is authorized.
- No merchant acceptance, active offer or redemption claimed. Public ledger excludes private sender and message identifiers.

## October 13 growth release

- Started from verified current main `4defacdb5a1fb60f3fbb6cd18ad8beb5626dd1ce`, preserving the October 12 partner ledger, all editorial exclusions and the Jandii Castro hold.
- Added **Home Coffee Roasters — Noriega** as a separate, operating directory location at 1222 Noriega St. Current merchant evidence lists a $7.25 ceremonial-grade Matcha Latte, $5.25 Matchacano, soy/oat/almond substitutions and ordering hours. The Grant record remains separate. Directory moves **94 → 95**.
- Added the compact, unranked guide **3 SF cafés for matcha and a laptop**: SŌHN, Jandii Taraval and Home Noriega. It separates current merchant menus from dated third-party work-space observations and labels Jandii’s $8.50 as an August 5 reported price. Guides move **12 → 13** and sourced entries **42 → 45**.
- Sorted the guide hub by verification date so the new guide appears first, without duplicating cards or adding more hub copy. Analytics-covered public HTML surfaces move **18 → 19**.
- Added four source-backed distribution drafts and rendered a five-slide text-led carousel. Drafts move **32 → 36** across nine topics; finished carousel sets move **8 → 9** and PNG slides **43 → 48**. Visual QA passed on the cover, Jandii, Home and closing cards. None posted.
- Validation: clean `npm ci --include=dev`; deterministic source build; **70 passing tests**; customer-copy audit **95 venues / 285 fields**; source/bundle parity; current hashed app/data assets and homepage references generated together; PNG dimensions, bytes and hashes verified; whitespace checks passed.
- Evidence: `docs/EDITORIAL_OCT13.md`. No subscriber, traffic, follower, live-offer, redemption or awards-vote growth is claimed. No café was contacted and no email or social post was sent.
- Publication: release `2345dfdc1fd5d11f304d7cf1cf3d6007389c9bbb` is on `main` and verified live October 13. The canonical guide returns the committed article; it is the first card on `/guides/`; the homepage references `data.d10abe483f9e.js` and `app.dfe1a3389307.js`; the live data bundle matches the committed SHA-256 bytes and exposes **95** venues including Home Noriega; and the live social manifest exposes **9 sets / 48 slides** with a byte-identical work-cafés cover.

## October 13 evening partner outreach

- Angela approved ten new personalized initial emails and explicitly excluded SŌHN. Sent and read back all ten at **8:56pm PT**: Best Boy Electric, Junbi San Francisco, California Kahve (Golden Gate Park), Home (Noriega), Tadaima (Mission), Paper Son (303 2nd St), Kiss of Matcha (Clement), Asha (17 Kearny), Origin Lab (211 Sutter) and Motoring Coffee (1525 Union).
- Initial emails sent: **1 → 11** total; prospect pool **4 → 12**, with **11 contacted / 1 paused**. SŌHN has a persistent do-not-contact rule. Constance was not contacted again.
- Merchant contact pages verified; Best Boy’s merchant-published email resolved the Instagram blocker. No confirmed participation, offer activation, redemption, audience growth or new reply claimed. Follow-ups are outside this initial-send approval.
- The exact sent wording and public source evidence are in `content/partner-pipeline.json`; `docs/PARTNER_PIPELINE.md` reflects the current stages. Tests validate receipts, user approval, unique location identities, tentative merchant-funded terms and the SŌHN hold without requiring boilerplate in email copy.

Validation for the outreach ledger: clean install/build, **71 passing tests**, customer-copy audit **96 shops / 288 fields**. The 96-venue dataset was already on current main; this outreach batch added no directory listings or public offers.
