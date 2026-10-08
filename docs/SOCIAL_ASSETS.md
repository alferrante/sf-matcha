# SF Matcha social carousel assets

Ready-to-export visual package generated from `content/social-launch.json`.

Browse the export gallery at [`/social/`](https://sanfranciscomatcha.com/social/). It exposes all six sets and 30 individual PNG downloads, plus the source manifest and documentation. Its status is **ready to export; not posted**.

## Counts

- **6 carousel sets** — one for each of the six original launch guides
- **30 individual slides** — five per carousel
- **0 published posts** — these files are production assets only
- Format: 1080 × 1080 PNG, RGB

The six sets cover banana matcha, cold foam/clouds, soy-milk matcha, strawberry matcha, ceremonial/hand-whisked matcha, and matcha under $7.

## Rebuild

```sh
python3 scripts/render-social-assets.py
```

The renderer deletes and rebuilds `social/`, including `social/index.html` and `social/manifest.json`. Output is deterministic for a fixed Python/Pillow/font environment. The manifest records every slide's dimensions, byte count, SHA-256 digest, source domains, source URLs, verification date, and guide URL.

## Editorial and design rules

- Copy is taken from the six original source-backed carousel drafts; the renderer does not invent drinks, ingredients, tasting notes, café photography, rankings, partnerships, or discount claims.
- Every slide includes a source footer and the October 7, 2026 menu-check date. Every carousel carries its guide path, with a full guide CTA on the closing slide.
- The package uses only deterministic type, line work, and geometric motifs. There are no café or drink photos to license or misattribute.
- Kumo's banana and London Fog slides retain the important caveat: a soy or vanilla cloud does **not** make those drinks dairy-free; Kumo marks the relevant drinks as containing dairy.
- Prices are framed as menu prices and modifiers, not evergreen promises. Recheck the linked sources before posting.
- “Ceremonial” is attributed to café descriptions and is not presented as an SF Matcha quality award.
- The under-$7 carousel states that prices are before tax, tip, and extras and that no café discount is implied.

## Export QA

- Canvas: 1080 × 1080 on all 30 slides
- Typography: large high-contrast black type on cream/white, with moss and lime accents
- Safe area: primary text remains inside a 68 px inset; source/date footer remains inside the outer frame
- Slide order: filenames are zero-padded (`slide-01.png` through `slide-05.png`)
- Sources: domain-level labels are visible on-slide; full source URLs are preserved in the manifest
- Status language: `ready-to-export; not posted`; no reach or publishing claims

When publishing, upload each guide directory in numeric filename order. Use the matching caption from `content/social-launch.json`, recheck each café source, and replace the raw guide URL with the platform's supported profile or story link where needed.
