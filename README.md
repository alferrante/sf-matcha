# SF Matcha

Static site for sanfranciscomatcha.com.

## Editorial exclusions

Little Sweet, Avotoasty, and Haraz Coffee House are excluded from the guide at Angela's request (2026-10-03), across all locations. Do not re-add them during automated scouting unless she explicitly reverses this decision. This is an editorial choice, not a claim that these businesses are closed or do not serve matcha.

Jandii Cafe is mapped at its operating Taraval location (1100 Taraval St). Keep the announced Castro location (3499 16th St) off the map until it opens as a separate customer-ready location with verified opening status and a current business profile.

## Local Preview

Install the locked build tool and rebuild before previewing or publishing source changes:

```sh
npm ci --include=dev
npm run build
npm test
```

The build compiles all four JSX sources, preserves stable bundles for the scout/audit, and rewrites script URLs to content-hashed assets. Commit source, stable bundles, hashed assets and index.html together. Retain previously published hashed bundles so cached HTML can still load its versioned assets. No npm packages are loaded by the browser.

See [GOAL.md](GOAL.md) and [SPRINT_SCOREBOARD.md](SPRINT_SCOREBOARD.md) for the growth sprint and verified progress.

```sh
python3 -m http.server 8787
```

Then open `http://127.0.0.1:8787/`.

To preview the Google Maps layer locally, create an untracked `config.js` file:

```js
window.SF_MATCHA_CONFIG = { googleMapsApiKey: "YOUR_RESTRICTED_BROWSER_KEY" };
```

You can copy `config.example.js` as the starting shape.

## Render

This folder is a clean deploy repo. Push it to GitHub, then use the Render Blueprint in `render.yaml`.

Set `GOOGLE_MAPS_API_KEY` in Render as an environment variable. The build command writes it into `config.js` at deploy time, so the key is not committed to GitHub. Because browser map keys are visible to visitors, restrict the key in Google Cloud to the Maps JavaScript API and the production/local referrers only.

The Blueprint runs `npm ci --include=dev`, `npm run build`, then `npm run config`. Applying edited Blueprint settings to an existing service may require a Blueprint sync; committing render.yaml alone does not prove the live service settings changed. Hashed script filenames work with the existing Git-deploy setup too.

## Growth pages and newsletter

`content/guides.json` is the source for the static guides hub and articles. `content/methodology.html` and `content/perks.html` are reviewed standalone pages; `content/offers.json` starts empty and passes strict publication validation. `npm run build` regenerates these pages, the public partner kit/offers feed, sitemap, and browser bundles. Commit source and generated output together. Keep earlier content-addressed bundles so older cached HTML remains usable.

`docs/SOCIAL_LAUNCH.md` contains 24 source-backed text drafts. They have not been posted and are not finished visual assets. Recheck dated menus before distribution.

The newsletter frontend uses the verified public capture service at `https://sfmatcha-newsletter.onrender.com/api/newsletter/subscribe`. A public `NEWSLETTER_ENDPOINT` configuration can override it; an explicit empty value hides the form. `server/newsletter.mjs` is a separate Node backend; it cannot run on the static site. Read `docs/NEWSLETTER_SETUP.md` before deployment. Keep the private Resend key exclusively in the backend environment. Public config contains only the browser map key and signup URL.

The café pilot planner produces a local proposal and does not enroll merchants. An active offer requires explicit outreach authorization, written merchant confirmation, and a tested server claim/redemption service. A valid JSON record alone is not approval to activate an offer.
