# SF Matcha sprint scoreboard

Last updated: October 7, 2026. Goal: `GOAL.md`.

## Verified baseline

Repository baseline: `7d8fb15f21dfec29d65ad063d32b7bffd6ae8fa2` (current main when this run began).

| Metric | Current verified state | Target |
| --- | --- | ---: |
| Directory venues | 89 source/built venues; audit passes 267 fields | Accuracy and freshness |
| Monthly visits | Unknown; Cloudflare beacon exists, export not accessed | 50,000 |
| Active email subscribers | 0 in newly created dedicated Resend audience, verified October 7; public signup not yet live | 10,000 |
| Social followers | Unknown; project accounts not verified | 25,000 |
| Guides | 6 published articles / 21 sourced entries, live verified October 7 | 24 |
| Derivative assets | 24 complete text drafts (6 carousel scripts, 6 captions, 6 short posts, 6 video scripts); 0 published posts or rendered visual assets | 120 |
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

1. Complete repeat-submission and opt-out integration checks, publish the enabled signup alongside header/navigation corrections, and verify the real browser flow.
2. Verify an SF Matcha sending domain and broadcast unsubscribe before sending any newsletter. Signup capture does not send email.
3. Establish analytics baseline and provider/account evidence. Keep unknown metrics explicitly unknown until measured.
4. Expand the six-guide library with verified neighborhood/seasonal articles and derivative content after launch verification.
5. Add Buzzy expiry/reason metadata and publish transparent editorial methodology; gather tasting evidence before Best awards.
6. Obtain explicit outreach authorization and merchant confirmation, then implement and deploy authenticated atomic claim/redemption service before activating the first $1-off pilot. The public proposal planner and validation schema are ready.

## Dependencies requiring evidence or access

- Dedicated audience, consent fields, private credential and Render backend are established. An SF Matcha sending domain and broadcast unsubscribe still need verification before sending newsletter emails.
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
