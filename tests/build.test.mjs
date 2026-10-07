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
    run("scripts/build.mjs", dir);
    assert.equal(readFileSync(path.join(dir, "index.html"), "utf8"), first);
    writeFileSync(path.join(dir, "data.jsx"), readFileSync(path.join(dir, "data.jsx"), "utf8") + '\nwindow.BUILD_TEST = true;\n');
    run("scripts/build.mjs", dir);
    const second = readFileSync(path.join(dir, "index.html"), "utf8");
    for (const asset of assets) assert.doesNotThrow(() => readFileSync(path.join(dir, asset)));
    assert.notEqual(second.match(/dist\/data\.[a-f0-9]{12}\.js/)[0], first.match(/dist\/data\.[a-f0-9]{12}\.js/)[0]);
    assert.equal(second.match(/dist\/app\.[a-f0-9]{12}\.js/)[0], first.match(/dist\/app\.[a-f0-9]{12}\.js/)[0]);
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
