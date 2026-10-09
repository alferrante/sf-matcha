import { build } from "esbuild";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildGuides } from "./build-guides.mjs";
import { injectSiteAnalytics } from "../lib/site-analytics.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entries = ["tweaks-panel", "data", "map", "app"];
const dist = path.join(root, "dist");
await mkdir(dist, { recursive: true });

// Keep the stable bundles for the directory scout and customer-copy audit.
for (const name of entries) {
  await build({
    absWorkingDir: root,
    entryPoints: [`${name}.jsx`],
    outfile: `dist/${name}.js`,
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2020",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    charset: "utf8",
    logLevel: "warning",
  });
}

// Content-addressed URLs bypass already-cached stable bundle URLs.
// Retain prior content-addressed files so a cached older index can still load.
let html = await readFile(path.join(root, "index.html"), "utf8");
for (const name of entries) {
  const contents = await readFile(path.join(dist, `${name}.js`));
  const hash = createHash("sha256").update(contents).digest("hex").slice(0, 12);
  const filename = `${name}.${hash}.js`;
  await writeFile(path.join(dist, filename), contents);
  const pattern = new RegExp(`(<script\\s+src=")[./]*dist/${name}(?:\\.[a-f0-9]{12})?\\.js(?:\\?[^" ]*)?("[^>]*></script>)`, "g");
  let replacements = 0;
  html = html.replace(pattern, (_match, start, end) => {
    replacements++;
    return `${start}dist/${filename}${end}`;
  });
  if (replacements !== 1) throw new Error(`Expected one script tag for ${name}; found ${replacements}`);
}
await writeFile(path.join(root, "index.html"), html);
console.log("Built four source bundles and four versioned browser assets.");

// Standalone guide pages share the newsletter client without loading the map app.
await build({
  absWorkingDir: root, entryPoints: ["lib/guide-newsletter.mjs"],
  outfile: "dist/guide-newsletter.js", bundle: true, format: "esm",
  platform: "browser", target: "es2020", charset: "utf8", logLevel: "warning",
});
const newsletterBundle = await readFile(path.join(dist, "guide-newsletter.js"));
const newsletterHash = createHash("sha256").update(newsletterBundle).digest("hex").slice(0, 12);
const newsletterFilename = `guide-newsletter.${newsletterHash}.js`;
await writeFile(path.join(dist, newsletterFilename), newsletterBundle);
const guidesResult = await buildGuides({ root, newsletterAsset: `/dist/${newsletterFilename}` });
console.log(`Built ${guidesResult.guides} guide articles and editorial pages.`);

// Measure every public HTML surface with the same existing privacy-disclosed
// Cloudflare beacon. Rewriting is idempotent, so repeated builds never duplicate it.
const publicHtml = new Set([
  "index.html",
  ...guidesResult.pages.filter(file => file.endsWith(".html")),
  "privacy/index.html",
  "social/index.html",
]);
for (const file of publicHtml) {
  const absolute = path.join(root, file);
  const document = await readFile(absolute, "utf8");
  await writeFile(absolute, injectSiteAnalytics(document));
}
console.log(`Injected site analytics into ${publicHtml.size} public HTML pages.`);
