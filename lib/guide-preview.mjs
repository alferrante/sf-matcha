import { createHash } from "node:crypto";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";

const origin = "https://sanfranciscomatcha.com";
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Preview artwork is optional. Missing or stale covers stay text-only; a cover
// claiming to be current must pass its recorded file-integrity checks.
export async function loadGuidePreviews({ root, guides }) {
  let manifest;
  try {
    manifest = JSON.parse(await readFile(path.join(root, "social/manifest.json"), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return new Map();
    throw error;
  }
  if (!Array.isArray(manifest?.sets)) throw new Error("Guide preview manifest needs a sets array");
  const bySlug = new Map(guides.map(guide => [guide.slug, guide]));
  const previews = new Map();
  const seen = new Set();
  const projectRoot = await realpath(root);

  for (const set of manifest.sets) {
    const guide = bySlug.get(set?.guideSlug);
    if (!guide || !slugPattern.test(guide.slug)) continue;
    if (seen.has(guide.slug)) throw new Error(`Duplicate guide preview: ${guide.slug}`);
    seen.add(guide.slug);
    const cover = set.slides?.[0];
    if (!cover || cover.slide !== 1) continue;
    const expectedPath = `social/${guide.slug}/slide-01.png`;
    if (cover.file !== expectedPath) throw new Error(`Unsafe guide preview path: ${guide.slug}`);
    if (set.guideUrl !== `${origin}/guides/${guide.slug}/` ||
        set.verifiedAt !== guide.updatedAt ||
        cover.headline !== (guide.cardTitle ?? guide.title)) continue;

    let absolute;
    let image;
    try {
      absolute = await realpath(path.join(projectRoot, expectedPath));
      if (!absolute.startsWith(`${projectRoot}${path.sep}`)) throw new Error(`Unsafe guide preview target: ${guide.slug}`);
      image = await readFile(absolute);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    const validPng = image.length >= 33 && image.subarray(0, 8).equals(pngSignature) &&
      image.readUInt32BE(8) === 13 && image.toString("ascii", 12, 16) === "IHDR" &&
      image.readUInt32BE(16) === 1080 && image.readUInt32BE(20) === 1080;
    if (!validPng || cover.width !== 1080 || cover.height !== 1080 ||
        cover.bytes !== image.length || !/^[a-f0-9]{64}$/.test(cover.sha256 ?? "") ||
        cover.sha256 !== createHash("sha256").update(image).digest("hex")) {
      throw new Error(`Invalid guide preview integrity: ${guide.slug}`);
    }
    previews.set(guide.slug, { urlPath: `/${expectedPath}`, width: 1080, height: 1080, alt: cover.headline });
  }
  return previews;
}
