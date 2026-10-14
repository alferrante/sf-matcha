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
const launch = JSON.parse(fs.readFileSync(path.join(root, "content/social-launch.json"), "utf8"));
const carousels = launch.assets.filter(asset => asset.type === "carousel");
const slideCount = carousels.reduce((count, asset) => count + asset.slides.length, 0);

function pngDimensions(buffer) {
  assert.equal(buffer.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "valid PNG signature");
  assert.equal(buffer.subarray(12, 16).toString("ascii"), "IHDR", "IHDR is first chunk");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

test("social manifest matches every source-backed carousel and original check date", () => {
  assert.ok(carousels.length >= 10, "preserve published carousel production");
  assert.equal(manifest.carouselSetCount, carousels.length);
  assert.equal(manifest.individualSlideCount, slideCount);
  assert.deepEqual(manifest.dimensions, { width: 1080, height: 1080 });
  assert.equal(manifest.status, "ready-to-export; not posted");
  assert.equal(manifest.qa.kumoDairyCaveatPresent, true);
  assert.equal(manifest.sets.length, carousels.length);
  assert.equal(new Set(manifest.sets.map(set => set.guideSlug)).size, carousels.length);
  for (const set of manifest.sets) {
    assert.equal(set.slideCount, set.slides.length);
    assert.ok(set.slideCount >= 3);
    assert.match(set.guideUrl, /^https:\/\/sanfranciscomatcha\.com\/guides\//);
    const source = carousels.find(asset => asset.guideSlug === set.guideSlug);
    assert.ok(source, set.guideSlug);
    assert.equal(set.verifiedAt, source.verifiedAt);
    assert.deepEqual(set.sourceUrls, source.sources);
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
  assert.equal(seen.size, slideCount);
  assert.equal(totalBytes, manifest.totalBytes);
});

test("export gallery links every current download and its evidence files", () => {
  assert.match(gallery, /ready to export; not posted/);
  assert.match(gallery, /href="manifest\.json"/);
  assert.match(gallery, /href="\.\.\/docs\/SOCIAL_ASSETS\.md"/);
  assert.equal((gallery.match(/class="carousel-set"/g) || []).length, carousels.length);
  assert.equal((gallery.match(/class="download"/g) || []).length, slideCount);
  for (const set of manifest.sets) {
    for (const slide of set.slides) {
      const relative = slide.file.replace(/^social\//, "");
      assert.ok(gallery.includes(`href="${relative}" download`), `missing download ${relative}`);
    }
  }
});
