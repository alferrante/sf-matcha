import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const socialRoot = path.join(root, "social");
const manifest = JSON.parse(fs.readFileSync(path.join(socialRoot, "manifest.json"), "utf8"));
const gallery = fs.readFileSync(path.join(socialRoot, "index.html"), "utf8");

function pngDimensions(buffer) {
  assert.equal(buffer.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "valid PNG signature");
  assert.equal(buffer.subarray(12, 16).toString("ascii"), "IHDR", "IHDR is first chunk");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

test("social manifest describes six complete, source-backed carousel sets", () => {
  assert.equal(manifest.carouselSetCount, 6);
  assert.equal(manifest.individualSlideCount, 30);
  assert.deepEqual(manifest.dimensions, { width: 1080, height: 1080 });
  assert.equal(manifest.status, "ready-to-export; not posted");
  assert.equal(manifest.qa.kumoDairyCaveatPresent, true);
  assert.equal(manifest.sets.length, 6);
  for (const set of manifest.sets) {
    assert.equal(set.slideCount, 5);
    assert.equal(set.slides.length, 5);
    assert.match(set.guideUrl, /^https:\/\/sanfranciscomatcha\.com\/guides\//);
    assert.equal(set.verifiedAt, "2026-10-07");
    assert.ok(set.sourceUrls.length > 0);
  }
});

test("every social PNG matches manifest dimensions, bytes and SHA-256", () => {
  let totalBytes = 0;
  const seen = new Set();
  for (const set of manifest.sets) {
    for (const slide of set.slides) {
      assert.ok(!seen.has(slide.file), `duplicate ${slide.file}`);
      seen.add(slide.file);
      const relative = slide.file.replace(/^social\//, "");
      const buffer = fs.readFileSync(path.join(socialRoot, relative));
      assert.deepEqual(pngDimensions(buffer), { width: 1080, height: 1080 });
      assert.equal(buffer.length, slide.bytes, `${slide.file} byte count`);
      assert.equal(createHash("sha256").update(buffer).digest("hex"), slide.sha256, `${slide.file} digest`);
      totalBytes += buffer.length;
    }
  }
  assert.equal(seen.size, 30);
  assert.equal(totalBytes, manifest.totalBytes);
});

test("export gallery links all 30 downloads and its evidence files", () => {
  assert.match(gallery, /ready to export; not posted/);
  assert.match(gallery, /href="manifest\.json"/);
  assert.match(gallery, /href="\.\.\/docs\/SOCIAL_ASSETS\.md"/);
  assert.equal((gallery.match(/class="carousel-set"/g) || []).length, 6);
  assert.equal((gallery.match(/class="download"/g) || []).length, 30);
  for (const set of manifest.sets) {
    for (const slide of set.slides) {
      const relative = slide.file.replace(/^social\//, "");
      assert.ok(gallery.includes(`href="${relative}" download`), `missing download ${relative}`);
    }
  }
});
