import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, cpSync, symlinkSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const run = (script, cwd = root, env = process.env) => execFileSync(process.execPath, [script], { cwd, env });
function fixture() {
  const dir = mkdtempSync(path.join(os.tmpdir(), "sf-matcha-build-"));
  mkdirSync(path.join(dir, "scripts"));
  for (const file of ["index.html", "app.jsx", "data.jsx", "map.jsx", "tweaks-panel.jsx", "scripts/build.mjs", "scripts/write-config.mjs", "scripts/build-guides.mjs"]) {
    cpSync(path.join(root, file), path.join(dir, file));
  }
  for (const directory of ["content", "lib"]) cpSync(path.join(root, directory), path.join(dir, directory), {recursive:true});
  for (const directory of ["privacy", "social"]) {
    mkdirSync(path.join(dir, directory));
    cpSync(path.join(root, directory, "index.html"), path.join(dir, directory, "index.html"));
  }
  symlinkSync(path.join(root, "node_modules"), path.join(dir, "node_modules"));
  return dir;
}

test("source builds preserve venue data and produce reproducible, changing asset URLs", () => {
  const dir = fixture();
  try {
    run("scripts/build.mjs", dir);
    const first = readFileSync(path.join(dir, "index.html"), "utf8");
    const srcContext = { window: {} }, bundleContext = { window: {} };
    vm.runInNewContext(readFileSync(path.join(dir, "data.jsx"), "utf8"), srcContext);
    vm.runInNewContext(readFileSync(path.join(dir, "dist/data.js"), "utf8"), bundleContext);
    assert.equal(JSON.stringify(srcContext.window.SHOPS), JSON.stringify(bundleContext.window.SHOPS));
    assert.equal(JSON.stringify(srcContext.window.STATUS_META), JSON.stringify(bundleContext.window.STATUS_META));
    const assets = [...first.matchAll(/src="(dist\/[a-z-]+\.[a-f0-9]{12}\.js)"/g)].map(m => m[1]);
    assert.equal(assets.length, 4);
    for (const asset of assets) new vm.Script(readFileSync(path.join(dir, asset), "utf8"));
    const firstGuides = readFileSync(path.join(dir, "guides/index.html"), "utf8");
    const firstNewsletter = firstGuides.match(/src="(\/dist\/guide-newsletter\.[a-f0-9]{12}\.js)"/)[1];
    assert.match(readFileSync(path.join(dir, firstNewsletter.slice(1)), "utf8"), /initializeGuideNewsletter/);
    run("scripts/build.mjs", dir);
    assert.equal(readFileSync(path.join(dir, "index.html"), "utf8"), first);
    writeFileSync(path.join(dir, "data.jsx"), readFileSync(path.join(dir, "data.jsx"), "utf8") + '\nwindow.BUILD_TEST = true;\n');
    run("scripts/build.mjs", dir);
    const second = readFileSync(path.join(dir, "index.html"), "utf8");
    for (const asset of assets) assert.doesNotThrow(() => readFileSync(path.join(dir, asset)));
    assert.notEqual(second.match(/dist\/data\.[a-f0-9]{12}\.js/)[0], first.match(/dist\/data\.[a-f0-9]{12}\.js/)[0]);
    assert.equal(second.match(/dist\/app\.[a-f0-9]{12}\.js/)[0], first.match(/dist\/app\.[a-f0-9]{12}\.js/)[0]);
    writeFileSync(path.join(dir, "lib/guide-newsletter.mjs"), readFileSync(path.join(dir, "lib/guide-newsletter.mjs"), "utf8") + '\nexport const guideBuildTest = true;\n');
    run("scripts/build.mjs", dir);
    const nextNewsletter = readFileSync(path.join(dir, "guides/index.html"), "utf8").match(/src="(\/dist\/guide-newsletter\.[a-f0-9]{12}\.js)"/)[1];
    assert.notEqual(nextNewsletter, firstNewsletter);
    assert.doesNotThrow(() => readFileSync(path.join(dir, firstNewsletter.slice(1))));
    assert.doesNotThrow(() => readFileSync(path.join(dir, nextNewsletter.slice(1))));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("public config safely encodes environment values", () => {
  const dir = fixture();
  try {
    const key = 'test-key"\\\n';
    run("scripts/write-config.mjs", dir, { ...process.env, GOOGLE_MAPS_API_KEY: key });
    const context = { window: {} };
    vm.runInNewContext(readFileSync(path.join(dir, "config.js"), "utf8"), context);
    assert.equal(context.window.SF_MATCHA_CONFIG.googleMapsApiKey, key);
    run("scripts/write-config.mjs", dir, { ...process.env, GOOGLE_MAPS_API_KEY: "" });
    vm.runInNewContext(readFileSync(path.join(dir, "config.js"), "utf8"), context);
    assert.equal(context.window.SF_MATCHA_CONFIG.googleMapsApiKey, "");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
