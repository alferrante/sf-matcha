# SF Matcha

Static site for sanfranciscomatcha.com.

## Local Preview

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
