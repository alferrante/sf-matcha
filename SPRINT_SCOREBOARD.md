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
| Guides | 6 articles built and tested; publication verification pending | 24 |
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
5. **Email infrastructure blocker verified:** connected Resend initially had only unrelated verified domains and a General segment. Created a dedicated SF Matcha newsletter audience (`81330e1a-e521-40ab-87ed-220feca6e848`) plus consent timestamp/version/source fields; audience query confirms zero contacts. No hosted signup form exists. No backend/API credentials are present. Connected Supabase contains only an unrelated project, which was not repurposed. Render exposes one workspace, but its tool explicitly requires user-confirmed workspace selection before service operations. The Node newsletter backend and 14 provider-mocked behavioral tests are complete, including consent metadata, exact-origin validation, request limits, timeouts, missing setup, and opt-out preservation. Working public signup is not yet achieved.

6. **Distribution drafts completed:** 24 source-linked text assets across six guide topics, including carousel copy, Instagram captions, short posts and video scripts. Not posted; no social reach/follower gain or finished visual assets claimed.

7. **Cache continuity fixed:** builds retain previous content-addressed assets so cached older HTML can still load them. A regression test verifies old referenced assets remain after a source change.

Validation: all 41 automated tests, source build, copy audit (89 venues/267 fields), reproducible hashed assets, source-to-built data parity, guide validation/escaping/canonical/schema checks and newsletter client failure/consent handling pass. Browser cannot reach the local preview through the cloud browser; public deployment will be checked in-browser after publication. Publication verification is pending for this launch release.

## Next execution queue

1. Publish and verify the six-guide/methodology/perks/homepage release. Confirm actual Render build/header settings once correct workspace is accessible.
2. Deploy the tested newsletter service after confirming the Render workspace; create a server-only contact-management credential, set the public endpoint, verify a saved signup and opt-out handling, then enable the form.
3. Establish analytics baseline and provider/account evidence. Keep unknown metrics explicitly unknown until measured.
4. Expand the six-guide library with verified neighborhood/seasonal articles and derivative content after launch verification.
5. Add Buzzy expiry/reason metadata and publish transparent editorial methodology; gather tasting evidence before Best awards.
6. Create merchant-confirmation records, offer schema/UI and outreach-ready café pipeline. Do not activate invented offers.

## Dependencies requiring evidence or access

- Render workspace confirmation required by connector, server-only contact-management credential and live endpoint. A dedicated audience and consent fields are established. Verify an SF Matcha sending domain and broadcast unsubscribe before sending newsletter emails.
- Analytics data and identified SF Matcha social accounts.
- Firsthand tasting notes/photos for qualitative rankings and awards.
- Explicit outreach authorization and merchant acceptance for $1-off offers.

## Run protocol

The growth lead owns writes to this scoreboard and source publication. Other workstreams provide draft outputs and handoffs. Pull current main, inspect in-progress work, choose unblocked actions, test/audit/build, publish, verify, and log exact evidence. Record attempted paths and specific blockers; continue independent work.
