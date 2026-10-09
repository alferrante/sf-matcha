import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import guides from "../content/guides.json" with { type: "json" };
import {
  CLOUDFLARE_ANALYTICS_SRC,
  CLOUDFLARE_ANALYTICS_TOKEN,
  injectSiteAnalytics,
} from "../lib/site-analytics.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("analytics injection is idempotent and replaces legacy markup", () => {
  const legacy = `<!doctype html><body><h1>Page</h1><!-- Cloudflare Web Analytics --><script defer src='${CLOUDFLARE_ANALYTICS_SRC}' data-cf-beacon='{"token": "${CLOUDFLARE_ANALYTICS_TOKEN}"}'></script><!-- End Cloudflare Web Analytics --></body>`;
  const once = injectSiteAnalytics(legacy);
  const twice = injectSiteAnalytics(once);
  assert.equal(twice, once);
  assert.equal((once.match(/static\.cloudflareinsights\.com\/beacon\.min\.js/g) ?? []).length, 1);
  assert.match(once, /<script defer src="https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js"/);
  assert.match(once, new RegExp(CLOUDFLARE_ANALYTICS_TOKEN));
  assert.doesNotMatch(once, /password|secret|api[_-]?key/i);
  assert.throws(() => injectSiteAnalytics("<p>fragment</p>"), /complete HTML document/);
});

test("every public HTML page has exactly one approved analytics beacon", async () => {
  const files = [
    "index.html",
    "guides/index.html",
    ...guides.map(guide => `guides/${guide.slug}/index.html`),
    "methodology/index.html",
    "perks/index.html",
    "privacy/index.html",
    "social/index.html",
  ];
  for (const file of files) {
    const html = await readFile(path.join(root, file), "utf8");
    assert.equal((html.match(/static\.cloudflareinsights\.com\/beacon\.min\.js/g) ?? []).length, 1, file);
    assert.match(html, new RegExp(CLOUDFLARE_ANALYTICS_TOKEN), file);
    assert.match(html, /<script defer src="https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js"/, file);
  }
});

