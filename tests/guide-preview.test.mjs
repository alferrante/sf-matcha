import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadGuidePreviews } from "../lib/guide-preview.mjs";

const guide = { slug: "banana-matcha-san-francisco", title: "Banana matcha in SF", updatedAt: "2026-10-07" };
const imagePath = `social/${guide.slug}/slide-01.png`;
const actualRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "sf-matcha-preview-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const image = await readFile(path.join(actualRoot, imagePath));
  const cover = { slide: 1, file: imagePath, headline: guide.title, width: 1080, height: 1080, bytes: image.length, sha256: createHash("sha256").update(image).digest("hex") };
  const set = { guideSlug: guide.slug, guideUrl: `https://sanfranciscomatcha.com/guides/${guide.slug}/`, verifiedAt: guide.updatedAt, slides: [cover] };
  const manifest = { sets: [set] };
  await mkdir(path.join(root, "social", guide.slug), { recursive: true });
  await writeFile(path.join(root, imagePath), image);
  const save = () => writeFile(path.join(root, "social/manifest.json"), JSON.stringify(manifest));
  await save();
  return { root, image, cover, set, manifest, save };
}

test("matching title-slide previews use verified existing PNGs and concise alt text", async t => {
  const ui = await fixture(t);
  const result = await loadGuidePreviews({ root: ui.root, guides: [guide] });
  assert.deepEqual([...result], [[guide.slug, { urlPath: `/${imagePath}`, width: 1080, height: 1080, alt: guide.title }]]);
  const cardGuide = { ...guide, cardTitle: "Banana picks" };
  ui.cover.headline = cardGuide.cardTitle;
  await ui.save();
  assert.equal((await loadGuidePreviews({ root: ui.root, guides: [cardGuide] })).get(guide.slug).alt, "Banana picks");
});

test("missing manifest or artwork keeps optional previews absent", async t => {
  const ui = await fixture(t);
  await rm(path.join(ui.root, imagePath));
  assert.equal((await loadGuidePreviews({ root: ui.root, guides: [guide] })).size, 0);
  await rm(path.join(ui.root, "social/manifest.json"));
  assert.equal((await loadGuidePreviews({ root: ui.root, guides: [guide] })).size, 0);
});

test("stale evidence, changed titles, unknown guides and wrong canonical URLs are not previewed", async t => {
  const ui = await fixture(t);
  for (const change of [
    { verifiedAt: "2026-10-06" },
    { guideSlug: "not-a-current-guide" },
    { guideUrl: "https://evil.example/guides/banana-matcha-san-francisco/" },
    { guideUrl: `${ui.set.guideUrl}?private=value` },
  ]) {
    ui.manifest.sets = [{ ...ui.set, ...change }];
    await ui.save();
    assert.equal((await loadGuidePreviews({ root: ui.root, guides: [guide] })).size, 0);
  }
  ui.manifest.sets = [{ ...ui.set, slides: [{ ...ui.cover, headline: "Old headline" }] }];
  await ui.save();
  assert.equal((await loadGuidePreviews({ root: ui.root, guides: [guide] })).size, 0);
});

test("unsafe paths and symlink targets are rejected before reading external artwork", async t => {
  const ui = await fixture(t);
  for (const file of ["../../outside.png", "/tmp/outside.png", "https://evil.example/image.png", `social/${guide.slug}/../slide-01.png`]) {
    ui.cover.file = file;
    await ui.save();
    await assert.rejects(loadGuidePreviews({ root: ui.root, guides: [guide] }), /Unsafe guide preview path/);
  }
  ui.cover.file = imagePath;
  await ui.save();
  const outside = await mkdtemp(path.join(os.tmpdir(), "sf-matcha-external-preview-"));
  t.after(() => rm(outside, { recursive: true, force: true }));
  await writeFile(path.join(outside, "cover.png"), ui.image);
  await rm(path.join(ui.root, imagePath));
  await symlink(path.join(outside, "cover.png"), path.join(ui.root, imagePath));
  await assert.rejects(loadGuidePreviews({ root: ui.root, guides: [guide] }), /Unsafe guide preview target/);
});

test("PNG signature, IHDR size, dimensions, recorded bytes and hash must match", async t => {
  const ui = await fixture(t);
  const original = { ...ui.cover };
  for (const change of [{ width: 500 }, { height: 500 }, { bytes: ui.image.length - 1 }, { sha256: "0".repeat(64) }]) {
    Object.assign(ui.cover, original, change);
    await ui.save();
    await assert.rejects(loadGuidePreviews({ root: ui.root, guides: [guide] }), /Invalid guide preview integrity/);
  }
  for (const offset of [0, 8, 12, 16, 20]) {
    const corrupt = Buffer.from(ui.image);
    corrupt[offset] ^= 1;
    Object.assign(ui.cover, original, { sha256: createHash("sha256").update(corrupt).digest("hex") });
    await ui.save();
    await writeFile(path.join(ui.root, imagePath), corrupt);
    await assert.rejects(loadGuidePreviews({ root: ui.root, guides: [guide] }), /Invalid guide preview integrity/);
  }
});

test("malformed manifests and duplicate current-guide covers fail closed", async t => {
  const ui = await fixture(t);
  await writeFile(path.join(ui.root, "social/manifest.json"), "{}");
  await assert.rejects(loadGuidePreviews({ root: ui.root, guides: [guide] }), /sets array/);
  ui.manifest.sets.push(ui.set);
  await ui.save();
  await assert.rejects(loadGuidePreviews({ root: ui.root, guides: [guide] }), /Duplicate guide preview/);
});

test("production title slides provide integrity-checked previews for their matching guides", async () => {
  const guides = JSON.parse(await readFile(path.join(actualRoot, "content/guides.json"), "utf8"));
  const manifest = JSON.parse(await readFile(path.join(actualRoot, "social/manifest.json"), "utf8"));
  const previews = await loadGuidePreviews({ root: actualRoot, guides });
  const matching = manifest.sets.filter(set => guides.some(guide =>
    set.guideSlug === guide.slug && set.verifiedAt === guide.updatedAt &&
    set.guideUrl === `https://sanfranciscomatcha.com/guides/${guide.slug}/` &&
    set.slides[0]?.headline === (guide.cardTitle ?? guide.title)));
  assert.ok(matching.length > 0);
  assert.deepEqual([...previews.keys()], matching.map(set => set.guideSlug));
  assert.ok(previews.size <= guides.length);
});
