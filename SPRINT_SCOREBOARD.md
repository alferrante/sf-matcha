# SF Matcha sprint scoreboard

Last updated: October 7, 2026. Goal: `GOAL.md`.

## Verified baseline

Repository baseline: `7d8fb15f21dfec29d65ad063d32b7bffd6ae8fa2` (current main when this run began).

| Metric | Current verified state | Target |
| --- | --- | ---: |
| Directory venues | 89 source/built venues; audit passes 267 fields | Accuracy and freshness |
| Monthly visits | Unknown; Cloudflare beacon exists, export not accessed | 50,000 |
| Active email subscribers | Unknown; provider/account not established in this run | 10,000 |
| Social followers | Unknown; project accounts not verified | 25,000 |
| Guides | 0 guide pages in baseline repository | 24 |
| Derivative assets | 0 completed assets verified in this run; strategy briefs exist | 120 |
| Live confirmed offers | 0 offer records in baseline repository | 20 |
| Redemptions | Unknown; no verified tracking system | 2,000 |
| Awards votes | Unknown; no verified voting system | 1,000 |

## October 7 delivery

- Established an isolated branch from current main; preserved the dirty data checkout and separate newsletter-redesign worktree. Earlier 87-shop local snapshot is stale and must not replace current main.
- Added locked esbuild dependency, four-source build, content-hashed browser asset URLs, safe public configuration generation, and deployment build instructions.
- Stable `dist/*.js` files remain available to the existing venue watcher and copy audit. Deployed index points to versioned files to bypass existing stale-cache entries.
- Changed Blueprint cache rules for stable assets/config to revalidate. Applying live Render configuration still needs verified access to the correct workspace; committed hashed URLs protect the normal Git deploy independently.
- Created persistent goal, evidence standards and this scoreboard. Native `/goal` must be activated through the app composer; no goal-control tool was available in this session.
- Validation passed: 89-shop/267-field copy audit; source-to-bundle data parity; deterministic rebuilds; changed source changes browser asset URL; public-config escaping. Browser smoke test could not run because the installed Playwright package has no browser executable; no app/layout source was changed in this foundation release.

## Next execution queue

1. Verify published hashes on the live site. Confirm actual Render build/header settings once correct workspace is accessible.
2. Reconcile the existing `codex/newsletter-redesign` work without overwriting it; ship real email integration with success/error states, consent and unsubscribe support.
3. Establish analytics baseline and provider/account evidence. Keep unknown metrics explicitly unknown until measured.
4. Build SEO-visible `/guides/` pages and first banana/cold-foam/dairy-free candidate guides, using current menus and respecting README exclusions.
5. Add Buzzy expiry/reason metadata and publish transparent editorial methodology; gather tasting evidence before Best awards.
6. Create merchant-confirmation records, offer schema/UI and outreach-ready café pipeline. Do not activate invented offers.

## Dependencies requiring evidence or access

- Email provider/public signup endpoint and privacy/unsubscribe configuration.
- Analytics data and identified SF Matcha social accounts.
- Firsthand tasting notes/photos for qualitative rankings and awards.
- Explicit outreach authorization and merchant acceptance for $1-off offers.

## Run protocol

The growth lead owns writes to this scoreboard and source publication. Other workstreams provide draft outputs and handoffs. Pull current main, inspect in-progress work, choose unblocked actions, test/audit/build, publish, verify, and log exact evidence. Record attempted paths and specific blockers; continue independent work.
