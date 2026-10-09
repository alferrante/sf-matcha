import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

import records from "../content/buzzy-evidence.json" with { type: "json" };
import { isBuzzyCurrent, validateBuzzyEvidence } from "../lib/buzzy-evidence.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "data.jsx"), "utf8"), context);

test("only source-backed, unexpired Buzzy labels are active", () => {
  const byShop = validateBuzzyEvidence(records, context.window.SHOPS);
  assert.equal(byShop.size, records.length);
  assert.equal(records.length, 12);
  const now = Date.parse("2026-10-09T12:00:00Z");
  assert.equal(context.window.SHOPS.filter(shop => isBuzzyCurrent(shop, byShop, now)).length, 12);
  assert.equal(isBuzzyCurrent(context.window.SHOPS.find(shop => shop.id === "thaicocoa-japantown"), byShop, now), false);
  assert.equal(isBuzzyCurrent(context.window.SHOPS.find(shop => shop.id === "kumo-matcha-divisadero-market"), byShop, Date.parse("2026-11-09T00:00:00Z")), false);
});

test("Buzzy evidence rejects unsafe sources, unknown shops and reviews beyond 90 days", () => {
  const shops = context.window.SHOPS;
  assert.throws(() => validateBuzzyEvidence([{ ...records[0], source: "http://example.com" }], shops), /Unsafe Buzzy source/);
  assert.throws(() => validateBuzzyEvidence([{ ...records[0], shopId: "missing" }], shops), /Unknown Buzzy shop/);
  assert.throws(() => validateBuzzyEvidence([{ ...records[0], reviewBy: "2027-01-08" }], shops), /0–90 days/);
});
