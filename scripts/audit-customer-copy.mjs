import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataBundle = fs.readFileSync(path.join(root, "dist/data.js"), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(dataBundle, context);

const shops = context.window.SHOPS;
if (!Array.isArray(shops)) throw new Error("Could not load shop data from dist/data.js");

const rules = [
  ["self-directed phone instruction", /call to confirm/i],
  ["self-directed confirmation instruction", /confirm current/i],
  ["self-directed hours instruction", /check hours/i],
  ["internal API troubleshooting", /restriction\s*\/\s*API check/i],
  ["internal list reference", /starter[- ]list/i],
  ["research-process wording", /\b(?:crawled|opening coverage|listing\/review evidence)\b/i],
  ["research uncertainty", /\bnot verified\b/i],
  ["customer instruction", /\bask (?:if|to)\b/i],
  ["research-note prefix", /^(?:confirmed|reported)\s*:/i],
  ["research-note status", /^no soy found\b/i],
  ["research-source wording", /\bcurrent (?:public )?sources\b/i],
];

const failures = [];
const requiredFields = ["note", "soyNote", "hours"];
const approvedHoursTbd = new Set(["double-black-sf"]);
const statusRules = {
  confirmed: /\bsoy(?: milk)?\b.*\b(?:available|listed)\b/i,
  reported: /\b(?:reported|may be available)\b/i,
  none: /\bsoy(?: milk)? is not listed\b/i,
  call: /\b(?:soy availability.*(?:not listed|unclear)|availability for matcha is unclear)\b/i,
};

for (const shop of shops) {
  for (const field of requiredFields) {
    const value = shop[field];
    if (typeof value !== "string" || !value.trim()) {
      failures.push(`${shop.id}.${field}: missing customer copy`);
      continue;
    }
    for (const [label, pattern] of rules) {
      if (pattern.test(value)) failures.push(`${shop.id}.${field}: ${label}: ${value}`);
    }
    if (field === "hours" && /\d(?:am|pm)?-\d/i.test(value)) {
      failures.push(`${shop.id}.hours: use an en dash for time ranges: ${value}`);
    }
    if (field === "hours" && /^hours not listed$/i.test(value)) {
      failures.push(`${shop.id}.hours: research a current schedule before using a fallback`);
    }
    if (field === "hours" && /\bTBD\b/i.test(value) && !approvedHoursTbd.has(shop.id)) {
      failures.push(`${shop.id}.hours: TBD requires explicit review and approval`);
    }
  }
  const statusRule = statusRules[shop.status];
  if (statusRule && !statusRule.test(shop.soyNote)) {
    failures.push(`${shop.id}.soyNote: does not match the customer-facing rule for status "${shop.status}"`);
  }
}

for (const file of ["app.jsx", "index.html"]) {
  const value = fs.readFileSync(path.join(root, file), "utf8");
  for (const [label, pattern] of rules) {
    if (pattern.test(value)) failures.push(`${file}: ${label}`);
  }
}

if (failures.length) {
  console.error(`Customer-copy audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Customer-copy audit passed: ${shops.length} shops and ${shops.length * requiredFields.length} shop fields checked.`);
