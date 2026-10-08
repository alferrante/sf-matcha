#!/usr/bin/env python3
"""Render deterministic, text-led SF Matcha guide carousels.

Source copy comes directly from content/social-launch.json. The output intentionally
uses no generated or third-party cafe photography.
"""

from __future__ import annotations

import hashlib
import html
import json
import math
import os
import shutil
import unicodedata
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = ROOT / "content" / "social-launch.json"
OUTPUT_DIR = ROOT / "social"
SIZE = 1080

CREAM = "#FFF8E7"
INK = "#1A1A1A"
MOSS = "#2F5233"
LIME = "#D9FF3F"
WHITE = "#FFFFFF"
MUTED = "#6A6A60"

FONT_BOLD = "/usr/share/fonts/opentype/urw-base35/NimbusSans-Bold.otf"
FONT_REGULAR = "/usr/share/fonts/opentype/urw-base35/NimbusSans-Regular.otf"
FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
FONT_MONO_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

GUIDE_STYLE = {
    "banana-matcha-san-francisco": {
        "label": "BANANA MATCHA",
        "accent": "#F2C94C",
        "pale": "#FFF0B8",
        "motif": "banana",
    },
    "matcha-cold-foam-san-francisco": {
        "label": "COLD FOAM + CLOUDS",
        "accent": "#A8DDF5",
        "pale": "#E5F6FD",
        "motif": "cloud",
    },
    "soy-milk-matcha-san-francisco": {
        "label": "SOY MILK MATCHA",
        "accent": "#8FBF3F",
        "pale": "#E7F2D4",
        "motif": "soy",
    },
    "strawberry-matcha-san-francisco": {
        "label": "STRAWBERRY MATCHA",
        "accent": "#EE6C6C",
        "pale": "#FFE1DE",
        "motif": "strawberry",
    },
    "ceremonial-hand-whisked-matcha-san-francisco": {
        "label": "TEA-FIRST MATCHA",
        "accent": "#AACB73",
        "pale": "#E4EED4",
        "motif": "bowl",
    },
    "matcha-under-seven-dollars-san-francisco": {
        "label": "MATCHA UNDER $7",
        "accent": LIME,
        "pale": "#F0FFB7",
        "motif": "coin",
    },
}

DOMAIN_KEYS = {
    "sohn": "sohnsf.com",
    "yakiniq": "toast.app",
    "kumo": "kumomatchaca.com",
    "q ·": "qspecialtycoffee.com",
    "q lists": "qspecialtycoffee.com",
    "tadaima": "tadaimasf.com",
    "il parco": "ilparcosf.com",
    "lulu": "lulufresh.co",
    "stonemill": "stonemillmatcha-us.com",
    "four chairs": "fourchairssf.com",
    "nagomi": "cafenagomi.com",
    "pixlcat": "pixlcatcoffee.com",
    "paper son": "papersoncoffee.com",
}


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size)


def wrap_by_width(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, max_width: int) -> str:
    paragraphs = text.split("\n")
    wrapped: list[str] = []
    for paragraph in paragraphs:
        words = paragraph.split()
        if not words:
            wrapped.append("")
            continue
        line = words[0]
        for word in words[1:]:
            candidate = f"{line} {word}"
            if draw.textbbox((0, 0), candidate, font=face)[2] <= max_width:
                line = candidate
            else:
                wrapped.append(line)
                line = word
        wrapped.append(line)
    return "\n".join(wrapped)


def fit_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    font_path: str,
    max_size: int,
    min_size: int,
    max_width: int,
    max_height: int,
    spacing: int = 10,
) -> tuple[str, ImageFont.FreeTypeFont]:
    for size in range(max_size, min_size - 1, -2):
        face = font(font_path, size)
        wrapped = wrap_by_width(draw, text, face, max_width)
        box = draw.multiline_textbbox((0, 0), wrapped, font=face, spacing=spacing)
        if box[2] - box[0] <= max_width and box[3] - box[1] <= max_height:
            return wrapped, face
    face = font(font_path, min_size)
    return wrap_by_width(draw, text, face, max_width), face


def unique_domains(urls: list[str]) -> list[str]:
    domains: list[str] = []
    for url in urls:
        value = urlparse(url).netloc.lower().removeprefix("www.")
        if value and value not in domains:
            domains.append(value)
    return domains


def slide_domains(slide: dict, all_domains: list[str]) -> list[str]:
    raw_haystack = f"{slide['headline']} {slide['body']}".lower()
    haystack = "".join(
        char for char in unicodedata.normalize("NFKD", raw_haystack)
        if not unicodedata.combining(char)
    )
    matches: list[str] = []
    for key, domain in DOMAIN_KEYS.items():
        if key in haystack and domain in all_domains and domain not in matches:
            matches.append(domain)
    if slide["number"] in (1, 5) or not matches:
        return all_domains
    return matches


def draw_dot_grid(draw: ImageDraw.ImageDraw, accent: str) -> None:
    for y in range(52, 1030, 36):
        for x in range(52, 1030, 36):
            if ((x // 36) + (y // 36)) % 3 == 0:
                draw.ellipse((x, y, x + 4, y + 4), fill=accent)


def draw_motif(draw: ImageDraw.ImageDraw, kind: str, accent: str, pale: str, x: int, y: int, scale: float = 1.0) -> None:
    s = scale
    if kind == "banana":
        box = (x, y, x + int(210*s), y + int(210*s))
        draw.arc(box, 34, 214, fill=INK, width=max(4, int(11*s)))
        inner = (x + int(24*s), y + int(28*s), x + int(190*s), y + int(190*s))
        draw.arc(inner, 34, 214, fill=accent, width=max(12, int(38*s)))
        draw.ellipse((x + int(4*s), y + int(114*s), x + int(24*s), y + int(136*s)), fill=INK)
    elif kind == "cloud":
        draw.rounded_rectangle((x, y + int(76*s), x + int(220*s), y + int(166*s)), radius=int(44*s), fill=WHITE, outline=INK, width=max(3, int(7*s)))
        for dx, dy, r in ((42, 66, 47), (104, 42, 62), (169, 70, 43)):
            draw.ellipse((x + int((dx-r)*s), y + int((dy-r)*s), x + int((dx+r)*s), y + int((dy+r)*s)), fill=WHITE, outline=INK, width=max(3, int(7*s)))
    elif kind == "soy":
        for dx, dy, rot in ((28, 42, -18), (102, 12, 18), (128, 100, -10)):
            bean = Image.new("RGBA", (100, 70), (0, 0, 0, 0))
            bd = ImageDraw.Draw(bean)
            bd.ellipse((5, 5, 95, 65), fill=accent, outline=INK, width=6)
            bd.arc((28, 14, 75, 56), 115, 285, fill=INK, width=5)
            bean = bean.rotate(rot, expand=True, resample=Image.Resampling.BICUBIC)
            draw._image.paste(bean, (x + int(dx*s), y + int(dy*s)), bean)
    elif kind == "strawberry":
        draw.polygon([(x+105, y+25), (x+30, y+88), (x+58, y+192), (x+152, y+192), (x+180, y+88)], fill=accent, outline=INK)
        draw.line([(x+105, y+25), (x+30, y+88), (x+58, y+192), (x+152, y+192), (x+180, y+88), (x+105, y+25)], fill=INK, width=7)
        draw.polygon([(x+105, y+28), (x+70, y), (x+75, y+45), (x+38, y+30), (x+68, y+68), (x+105, y+45), (x+142, y+68), (x+172, y+30), (x+135, y+45), (x+140, y)], fill=MOSS)
        for dx, dy in ((76, 95), (126, 92), (98, 132), (73, 151), (132, 151)):
            draw.ellipse((x+dx, y+dy, x+dx+8, y+dy+13), fill=CREAM)
    elif kind == "bowl":
        draw.pieslice((x, y+12, x+220, y+190), 0, 180, fill=accent, outline=INK, width=7)
        draw.line((x+16, y+100, x+204, y+100), fill=INK, width=7)
        for offset in range(0, 55, 11):
            draw.line((x+154+offset//2, y-20, x+112+offset, y+103), fill=INK, width=4)
    elif kind == "coin":
        draw.ellipse((x, y, x+200, y+200), fill=accent, outline=INK, width=8)
        draw.ellipse((x+20, y+20, x+180, y+180), outline=MOSS, width=5)
        f = font(FONT_BOLD, int(94*s))
        draw.text((x+100, y+96), "$", font=f, fill=INK, anchor="mm")


def draw_pill(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], text: str, fill: str) -> None:
    draw.rounded_rectangle(box, radius=22, fill=fill, outline=INK, width=3)
    draw.text(((box[0]+box[2])//2, (box[1]+box[3])//2), text, font=font(FONT_MONO_BOLD, 21), fill=INK, anchor="mm")


def draw_source_footer(draw: ImageDraw.ImageDraw, domains: list[str], verified_at: str, accent: str) -> None:
    y = 912
    draw.line((58, y, 1022, y), fill=INK, width=3)
    date = datetime.strptime(verified_at, "%Y-%m-%d").strftime("%b %-d, %Y").upper()
    source_text = "SOURCES: " + " · ".join(domains)
    if len(source_text) > 108:
        source_text = source_text[:104].rsplit(" · ", 1)[0] + " · +MORE"
    wrapped, face = fit_text(draw, source_text, FONT_MONO, 19, 16, 700, 48, 4)
    draw.multiline_text((58, 932), wrapped, font=face, fill=MUTED, spacing=4)
    draw.rounded_rectangle((795, 929, 1022, 970), radius=18, fill=accent, outline=INK, width=2)
    draw.text((908, 950), f"CHECKED {date}", font=font(FONT_MONO_BOLD, 16), fill=INK, anchor="mm")
    draw.text((58, 1008), "sf matcha.  •  menu evidence, not a tasting ranking", font=font(FONT_MONO, 17), fill=MOSS)


def render_slide(asset: dict, slide: dict, style: dict, output_path: Path) -> dict:
    image = Image.new("RGB", (SIZE, SIZE), CREAM)
    draw = ImageDraw.Draw(image)
    draw_dot_grid(draw, style["pale"])

    # Bold frame and upper-right motif create continuity with the live map's sticker style.
    draw.rounded_rectangle((28, 28, 1052, 1052), radius=42, outline=INK, width=8)
    draw.rounded_rectangle((46, 46, 1034, 894), radius=34, fill=CREAM, outline=INK, width=3)
    draw.ellipse((775, -72, 1110, 263), fill=style["pale"], outline=INK, width=6)
    draw_motif(draw, style["motif"], style["accent"], style["pale"], 834, 21, 0.72)

    draw_pill(draw, (66, 66, 560, 116), f"SF MATCHA  /  {style['label']}", style["accent"])
    draw.rounded_rectangle((894, 190, 1018, 236), radius=19, fill=CREAM, outline=INK, width=3)
    draw.text((956, 213), f"{slide['number']} / {len(asset['slides'])}", font=font(FONT_MONO_BOLD, 19), fill=INK, anchor="mm")

    headline_width = 680
    title_max = 84 if slide["number"] == 1 else 68
    title, title_face = fit_text(draw, slide["headline"], FONT_BOLD, title_max, 48, headline_width, 230, 8)
    title_y = 164
    draw.multiline_text((68, title_y), title, font=title_face, fill=INK, spacing=8)
    title_box = draw.multiline_textbbox((68, title_y), title, font=title_face, spacing=8)

    accent_y = min(420, title_box[3] + 24)
    draw.rounded_rectangle((68, accent_y, 212, accent_y + 15), radius=7, fill=style["accent"])
    draw.rounded_rectangle((220, accent_y, 276, accent_y + 15), radius=7, fill=MOSS)

    body_top = accent_y + 52
    body_bottom = 768
    draw.rounded_rectangle((68, body_top, 1012, body_bottom), radius=34, fill=WHITE, outline=INK, width=4)
    body, body_face = fit_text(draw, slide["body"], FONT_REGULAR, 48, 34, 844, body_bottom - body_top - 80, 14)
    body_box = draw.multiline_textbbox((0, 0), body, font=body_face, spacing=14)
    body_height = body_box[3] - body_box[1]
    body_y = body_top + max(38, (body_bottom - body_top - body_height) // 2)
    draw.multiline_text((110, body_y), body, font=body_face, fill=INK, spacing=14)

    # The final slide closes with an explicit guide CTA; earlier slides carry a quiet path reminder.
    short_path = asset["guideUrl"].replace("https://sanfranciscomatcha.com", "")
    if slide["number"] == len(asset["slides"]):
        draw.rounded_rectangle((68, 796, 1012, 878), radius=28, fill=LIME, outline=INK, width=4)
        draw.text((96, 817), "READ + SAVE THE SOURCE-BACKED GUIDE", font=font(FONT_MONO_BOLD, 21), fill=INK)
        path_text, path_face = fit_text(draw, f"sanfranciscomatcha.com{short_path}", FONT_MONO, 20, 16, 860, 30, 2)
        draw.text((96, 849), path_text, font=path_face, fill=MOSS)
    else:
        draw.text((70, 830), f"FULL GUIDE  →  {short_path}", font=font(FONT_MONO_BOLD, 19), fill=MOSS)

    draw_source_footer(draw, slide_domains(slide, unique_domains(asset["sources"])), asset["verifiedAt"], style["accent"])

    output_path.parent.mkdir(parents=True, exist_ok=True)
    # Write atomically: the shared workspace sync watches file-creation events,
    # so exposing a final filename before Pillow closes it can publish a zero- or
    # partially-written PNG to another worker.
    temporary_path = Path("/tmp") / f"sf-matcha-{output_path.parent.name}-{output_path.name}.tmp"
    image.save(temporary_path, format="PNG", optimize=True, compress_level=9)
    os.replace(temporary_path, output_path)
    payload = output_path.read_bytes()
    return {
        "file": str(output_path.relative_to(ROOT)),
        "slide": slide["number"],
        "headline": slide["headline"],
        "width": SIZE,
        "height": SIZE,
        "bytes": len(payload),
        "sha256": hashlib.sha256(payload).hexdigest(),
        "sourceDomains": slide_domains(slide, unique_domains(asset["sources"])),
    }


def render_gallery(manifest: dict) -> str:
    sections: list[str] = []
    for carousel in manifest["sets"]:
        slug = carousel["guideSlug"]
        style = GUIDE_STYLE[slug]
        cards: list[str] = []
        for slide in carousel["slides"]:
            relative_file = slide["file"].removeprefix("social/")
            cards.append(f"""
          <article class="slide-card">
            <a class="image-link" href="{html.escape(relative_file)}" download>
              <img src="{html.escape(relative_file)}" width="1080" height="1080" loading="lazy" alt="Slide {slide['slide']}: {html.escape(slide['headline'])}" />
            </a>
            <div class="slide-meta">
              <span>Slide {slide['slide']} of {carousel['slideCount']}</span>
              <span>{slide['bytes'] / 1024:.0f} KB</span>
            </div>
            <h3>{html.escape(slide['headline'])}</h3>
            <a class="download" href="{html.escape(relative_file)}" download>Download PNG ↓</a>
          </article>""")

        source_links = " ".join(
            f'<a href="{html.escape(url)}" target="_blank" rel="noreferrer">{html.escape(urlparse(url).netloc.removeprefix("www."))}</a>'
            for url in carousel["sourceUrls"]
        )
        sections.append(f"""
      <section class="carousel-set" id="{html.escape(slug)}" style="--accent:{style['accent']};--pale:{style['pale']}">
        <div class="set-heading">
          <div>
            <p class="eyebrow">Carousel set · {carousel['slideCount']} slides</p>
            <h2>{html.escape(style['label'].title())}</h2>
          </div>
          <a class="guide-link" href="{html.escape(carousel['guideUrl'])}">Open guide ↗</a>
        </div>
        <div class="slide-grid">{''.join(cards)}
        </div>
        <details>
          <summary>Official sources used</summary>
          <div class="source-links">{source_links}</div>
        </details>
      </section>""")

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>SF Matcha Social Export Gallery</title>
  <meta name="description" content="Ready-to-export SF Matcha guide carousel assets." />
  <style>
    :root {{ --cream:#FFF8E7; --ink:#1A1A1A; --moss:#2F5233; --lime:#D9FF3F; }}
    * {{ box-sizing:border-box; }}
    body {{ margin:0; color:var(--ink); background:var(--cream); font-family:Arial,Helvetica,sans-serif; }}
    a {{ color:inherit; }}
    header {{ padding:52px clamp(20px,5vw,72px) 42px; border-bottom:4px solid var(--ink); background:var(--moss); color:var(--cream); }}
    .brand {{ display:inline-flex; padding:8px 13px; border:2px solid var(--cream); border-radius:999px; font:700 12px/1 monospace; letter-spacing:.08em; text-transform:uppercase; }}
    h1 {{ max-width:920px; margin:24px 0 10px; font-size:clamp(48px,8vw,104px); line-height:.91; letter-spacing:-.055em; }}
    .intro {{ max-width:760px; margin:0; font-size:clamp(18px,2.2vw,25px); line-height:1.45; }}
    .status {{ display:inline-block; margin-top:24px; padding:10px 16px; border:3px solid var(--ink); border-radius:14px; color:var(--ink); background:var(--lime); box-shadow:4px 4px 0 var(--ink); font:700 14px/1.2 monospace; text-transform:lowercase; }}
    .tools {{ display:flex; gap:10px; flex-wrap:wrap; margin-top:28px; }}
    .tools a {{ padding:9px 12px; border:2px solid var(--cream); border-radius:999px; font:700 12px/1 monospace; text-decoration:none; }}
    main {{ width:min(1540px,100%); margin:0 auto; padding:44px clamp(16px,4vw,60px) 80px; }}
    .summary {{ display:flex; gap:14px; flex-wrap:wrap; margin-bottom:54px; }}
    .summary span {{ padding:11px 15px; border:2px solid var(--ink); border-radius:999px; background:#fff; box-shadow:3px 3px 0 var(--ink); font:700 13px/1 monospace; }}
    .carousel-set {{ margin:0 0 72px; padding:28px; border:4px solid var(--ink); border-radius:28px; background:var(--pale); box-shadow:8px 8px 0 var(--ink); }}
    .set-heading {{ display:flex; align-items:end; justify-content:space-between; gap:20px; margin-bottom:26px; }}
    .eyebrow {{ margin:0 0 8px; font:700 12px/1 monospace; letter-spacing:.06em; text-transform:uppercase; }}
    h2 {{ margin:0; font-size:clamp(34px,4vw,58px); line-height:.95; letter-spacing:-.035em; }}
    .guide-link,.download {{ display:inline-flex; align-items:center; justify-content:center; border:2px solid var(--ink); background:var(--accent); border-radius:999px; box-shadow:3px 3px 0 var(--ink); padding:11px 15px; font:700 13px/1 monospace; text-decoration:none; }}
    .slide-grid {{ display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:18px; align-items:start; }}
    .slide-card {{ min-width:0; padding:12px; border:3px solid var(--ink); border-radius:18px; background:#fff; box-shadow:4px 4px 0 var(--ink); }}
    .image-link {{ display:block; overflow:hidden; border:2px solid var(--ink); border-radius:10px; background:var(--cream); }}
    img {{ display:block; width:100%; height:auto; }}
    .slide-meta {{ display:flex; justify-content:space-between; gap:8px; margin:10px 2px 0; color:#68685f; font:700 10px/1.2 monospace; text-transform:uppercase; }}
    h3 {{ min-height:2.4em; margin:8px 2px 12px; font-size:16px; line-height:1.2; }}
    .download {{ width:100%; background:var(--lime); font-size:11px; }}
    details {{ margin-top:24px; padding-top:18px; border-top:2px solid var(--ink); }}
    summary {{ cursor:pointer; font:700 12px/1.2 monospace; text-transform:uppercase; }}
    .source-links {{ display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }}
    .source-links a {{ padding:7px 10px; border:1px solid var(--ink); border-radius:999px; background:#fff; font:12px/1.2 monospace; text-decoration:none; }}
    footer {{ padding:28px 20px; border-top:4px solid var(--ink); background:var(--ink); color:var(--cream); text-align:center; font:13px/1.5 monospace; }}
    @media (max-width:1100px) {{ .slide-grid {{ grid-template-columns:repeat(3,minmax(0,1fr)); }} }}
    @media (max-width:700px) {{ header {{ padding-top:34px; }} main {{ padding-top:28px; }} .carousel-set {{ padding:18px; border-radius:22px; }} .set-heading {{ align-items:start; flex-direction:column; }} .slide-grid {{ grid-template-columns:repeat(2,minmax(0,1fr)); }} }}
    @media (max-width:450px) {{ .slide-grid {{ grid-template-columns:1fr; }} h3 {{ min-height:0; }} }}
  </style>
</head>
<body>
  <header>
    <span class="brand">sf matcha · social studio</span>
    <h1>Guide carousel export gallery.</h1>
    <p class="intro">Six source-backed carousel sets generated from the current SF Matcha guides. Open any slide at full resolution or download the PNG directly.</p>
    <span class="status">ready to export; not posted</span>
    <nav class="tools" aria-label="Asset documentation">
      <a href="manifest.json">Source manifest</a>
      <a href="../docs/SOCIAL_ASSETS.md">Asset documentation</a>
      <a href="../guides/">Published guides</a>
    </nav>
  </header>
  <main>
    <div class="summary" aria-label="Asset counts">
      <span>{manifest['carouselSetCount']} carousel sets</span>
      <span>{manifest['individualSlideCount']} individual slides</span>
      <span>1080 × 1080 PNG</span>
      <span>{manifest['totalBytes'] / 1024 / 1024:.2f} MB total</span>
      <span>menus checked Oct 7, 2026</span>
    </div>
    {''.join(sections)}
  </main>
  <footer>SF Matcha menu evidence · Recheck linked café sources before posting · No publishing or reach claims</footer>
</body>
</html>
"""


def main() -> None:
    payload = json.loads(SOURCE_PATH.read_text())
    carousels = [asset for asset in payload["assets"] if asset.get("type") == "carousel"]
    if len(carousels) != 6:
        raise SystemExit(f"Expected 6 carousel sets, found {len(carousels)}")

    kumo_copy = " ".join(
        f"{slide['headline']} {slide['body']}"
        for asset in carousels
        if asset["guideSlug"] in {
            "banana-matcha-san-francisco",
            "matcha-cold-foam-san-francisco",
        }
        for slide in asset["slides"]
    ).lower()
    for required_phrase in ("containing dairy", "soy cloud ≠ dairy-free"):
        if required_phrase not in kumo_copy:
            raise SystemExit(f"Required Kumo dairy caveat missing: {required_phrase}")

    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True)
    (OUTPUT_DIR / ".gitignore").write_text("*.tmp\n")

    manifest_sets = []
    total_bytes = 0
    for asset in carousels:
        slug = asset["guideSlug"]
        if slug not in GUIDE_STYLE:
            raise SystemExit(f"Missing style for {slug}")
        if len(asset["slides"]) < 3:
            raise SystemExit(f"{slug} has fewer than 3 slides")
        files = []
        for slide in asset["slides"]:
            name = f"slide-{slide['number']:02d}.png"
            result = render_slide(asset, slide, GUIDE_STYLE[slug], OUTPUT_DIR / slug / name)
            files.append(result)
            total_bytes += result["bytes"]
        manifest_sets.append({
            "guideSlug": slug,
            "guideUrl": asset["guideUrl"],
            "verifiedAt": asset["verifiedAt"],
            "sourceUrls": asset["sources"],
            "slideCount": len(files),
            "slides": files,
        })

    # Re-open every completed file so a successful run is also an export check.
    rendered_paths = sorted(OUTPUT_DIR.glob("*/slide-*.png"))
    if len(rendered_paths) != 30:
        raise SystemExit(f"Expected 30 rendered slides, found {len(rendered_paths)}")
    for rendered_path in rendered_paths:
        with Image.open(rendered_path) as rendered:
            rendered.verify()
            if rendered.size != (SIZE, SIZE):
                raise SystemExit(f"Wrong dimensions for {rendered_path}: {rendered.size}")

    manifest = {
        "generatedFrom": str(SOURCE_PATH.relative_to(ROOT)),
        "sourceUpdatedAt": payload["updatedAt"],
        "status": "ready-to-export; not posted",
        "carouselSetCount": len(manifest_sets),
        "individualSlideCount": sum(item["slideCount"] for item in manifest_sets),
        "format": "PNG",
        "dimensions": {"width": SIZE, "height": SIZE},
        "totalBytes": total_bytes,
        "qa": {
            "allSlidesVerifiedAsPng": True,
            "allSlides1080Square": True,
            "kumoDairyCaveatPresent": True,
            "renderingMode": "deterministic text and geometric illustration; no cafe photography",
        },
        "sets": manifest_sets,
    }
    manifest_path = OUTPUT_DIR / "manifest.json"
    temporary_manifest = Path("/tmp") / "sf-matcha-social-manifest.json.tmp"
    temporary_manifest.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    os.replace(temporary_manifest, manifest_path)
    gallery_path = OUTPUT_DIR / "index.html"
    temporary_gallery = Path("/tmp") / "sf-matcha-social-index.html.tmp"
    temporary_gallery.write_text(render_gallery(manifest))
    os.replace(temporary_gallery, gallery_path)
    print(f"Rendered {manifest['carouselSetCount']} carousel sets / {manifest['individualSlideCount']} PNG slides")
    print(f"Total PNG bytes: {total_bytes:,}")


if __name__ == "__main__":
    main()
