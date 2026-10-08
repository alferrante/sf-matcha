import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultOrigin = "https://sanfranciscomatcha.com";
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const json = value => JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
const paragraph = text => String(text ?? "").split(/\n\s*\n/).filter(Boolean).map(p => `<p>${esc(p)}</p>`).join("\n");
const css = `
*{box-sizing:border-box}body{margin:0;background:#fff8e7;color:#1a1a1a;font-family:Nunito,system-ui,sans-serif;line-height:1.65}a{color:inherit;text-underline-offset:4px}a:hover{color:#45691e}a:focus-visible,summary:focus-visible{outline:3px solid #45691e;outline-offset:5px}header,main,footer{max-width:1080px;margin:auto;padding:24px}header{display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:2px solid #1a1a1a}nav{display:flex;gap:18px;flex-wrap:wrap;font-weight:800;font-size:15px}.brand{font-family:'Bricolage Grotesque',sans-serif;font-size:25px;font-weight:800;text-decoration:none}h1,h2,h3{font-family:'Bricolage Grotesque',system-ui,sans-serif;line-height:1.12;letter-spacing:-.025em}h1{font-size:clamp(36px,6vw,66px);max-width:850px;margin:20px 0}h2{font-size:30px}h3{font-size:24px}.eyebrow,.date{font-family:'Space Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:.04em}.hero{padding:32px 0 22px}.lead{font-size:21px;max-width:780px}.prose{max-width:800px;font-size:18px}.note{border-left:5px solid #8fbf3f;background:#edf3dc;padding:18px 22px;margin:24px 0}.note p{margin:0}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;margin:28px 0}.card,.venue{background:#fffef9;border:2px solid #1a1a1a;border-radius:20px;padding:24px;box-shadow:4px 4px 0 #1a1a1a}.card h2{font-size:27px}.card a{display:block;text-decoration:none}.card .emoji{font-size:36px}.venue{margin:28px 0}.venue h2{margin:10px 0 6px}.location{font-size:15px;color:#555}.drink{display:inline-block;background:#d9ff3f;border-radius:8px;padding:4px 10px;font-weight:800}.verdict{font-size:20px;font-weight:800}dl{display:grid;grid-template-columns:120px 1fr;gap:9px 16px;font-size:16px}dt{font-weight:800}dd{margin:0}.sources{font-size:14px;border-top:1px solid #dfdccf;padding-top:16px}.sources ul{padding-left:20px}.button{display:inline-block;border:2px solid #1a1a1a;border-radius:99px;padding:10px 20px;background:#d9ff3f;font-weight:800;text-decoration:none}.links{display:flex;gap:16px;align-items:center;flex-wrap:wrap}details{border-bottom:1px solid #bdb9ae;padding:16px 0}summary{font-weight:800;cursor:pointer}footer{border-top:2px solid #1a1a1a;margin-top:48px;font-size:14px}.breadcrumbs{font-size:14px;margin-top:20px}.toc{padding-left:22px}.status{font-size:13px;font-weight:800;color:#4b632c}@media(max-width:650px){header{align-items:flex-start;flex-direction:column;padding:20px}main,footer{padding:20px}.cards{grid-template-columns:1fr}dl{grid-template-columns:1fr;gap:3px}dd{margin-bottom:12px}.venue{padding:20px;box-shadow:3px 3px 0 #1a1a1a}.lead{font-size:19px}.hero{padding-top:20px}}`;

const signupCss = `.guide-newsletter{position:relative;background:#d9ff3f;border:2px solid #1a1a1a;border-radius:20px;padding:28px;margin:38px 0;box-shadow:4px 4px 0 #1a1a1a}.guide-newsletter h2{margin:0 0 12px}.signup-row{display:flex;gap:10px;flex-wrap:wrap}.signup-row input{flex:1;min-width:180px;width:100%;padding:12px;border:2px solid #1a1a1a;border-radius:10px;background:#fffef9;font:inherit}.signup-row button{border:2px solid #1a1a1a;border-radius:10px;padding:12px 20px;background:#1a1a1a;color:#fff8e7;font:800 16px Nunito,system-ui;cursor:pointer}.signup-row button:disabled{opacity:.65;cursor:wait}.signup-consent{display:flex;align-items:flex-start;gap:10px;font-size:14px;margin:16px 0}.signup-consent input{margin-top:5px;width:17px;height:17px;flex-shrink:0;accent-color:#1a1a1a}.signup-email-label{display:block;font-weight:800;margin-bottom:6px}.signup-trap{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}.signup-message{min-height:26px;font-size:14px;font-weight:800}.signup-message[data-status="error"]{color:#8a1b1b}.signup-privacy{font-size:14px}.guide-newsletter input:focus-visible,.guide-newsletter button:focus-visible{outline:3px solid #5842db;outline-offset:3px}`;

function newsletterForm(source) {
  return `<section class="guide-newsletter" data-guide-newsletter data-newsletter-source="${esc(source)}" aria-labelledby="guide-newsletter-heading"><h2 id="guide-newsletter-heading">Your next matcha find, in your inbox.</h2><p>Get new SF matcha spots, fresh guides, and café perks as they launch.</p><form><label class="signup-email-label" for="guide-newsletter-email">Email address</label><div class="signup-row"><input id="guide-newsletter-email" name="email" type="email" inputmode="email" autocomplete="email" required maxlength="254" placeholder="you@example.com"><button type="submit" disabled>Get matcha updates →</button></div><label class="signup-consent"><input name="consent" type="checkbox" required> Send me SF Matcha guides and new-spot emails. Unsubscribe anytime.</label><label class="signup-trap" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><a class="signup-privacy" href="/privacy/">Privacy details</a></form><p class="signup-message" data-signup-message role="status" aria-live="polite"></p><noscript><p>Enable JavaScript to sign up for matcha updates.</p></noscript></section>`;
}

function shell({ title, description, canonical, body, structured, newsletterAsset }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} | SF Matcha</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="${structured ? "article" : "website"}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta name="twitter:card" content="summary">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Nunito:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>${css}${newsletterAsset ? signupCss : ""}</style>${structured ? `<script type="application/ld+json">${json(structured)}</script>` : ""}</head>
<body><header><a class="brand" href="/">🍵 sf matcha, mapped</a><nav aria-label="Main navigation"><a href="/">Map</a><a href="/guides/">Guides</a><a href="/perks/">Perks</a></nav></header><main>${body}</main><footer><p>Fresh finds. Clear milk details. San Francisco matcha, mapped.</p><p><a href="/">Explore the map</a> · <a href="/guides/">Browse guides</a> · <a href="/methodology/">How we verify</a> · <a href="/perks/">Café perks</a></p></footer>${newsletterAsset ? `<script src="/config.js"></script><script type="module" src="${esc(newsletterAsset)}"></script>` : ""}</body></html>\n`;
}

function requireText(value, name) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${name} must be a nonempty string`);
}

function validDay(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

function validStamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return false;
  return validDay(value.slice(0, 10)) && Number(value.slice(11, 13)) < 24 && Number(value.slice(14, 16)) < 60 && Number(value.slice(17, 19)) < 60 && Number.isFinite(Date.parse(value));
}

export function validateOffers(data, shops, { now = Date.now() } = {}) {
  if (!data || data.schemaVersion !== 1 || !validDay(data.updatedAt) || !Array.isArray(data.offers)) throw new Error("Offers need schemaVersion 1, ISO updatedAt and an offers array");
  for (const field of Object.keys(data)) if (!["schemaVersion", "updatedAt", "offers"].includes(field)) throw new Error(`Unknown or private offers document field: ${field}`);
  const shopById = new Map(shops.map(shop => [shop.id, shop]));
  const ids = new Set();
  const fields = new Set(["id", "shopId", "merchantName", "address", "status", "merchantConfirmedAt", "confirmationRef", "startsAt", "expiresAt", "discountCents", "currency", "redemptionCap", "perCustomerLimit", "terms", "claimPath", "paused"]);
  for (const offer of data.offers) {
    if (!offer || typeof offer !== "object" || Array.isArray(offer)) throw new Error("Offer must be an object");
    for (const field of Object.keys(offer)) if (!fields.has(field)) throw new Error(`Unknown or private offer field: ${field}`);
    if (typeof offer.id !== "string" || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(offer.id)) throw new Error("Invalid offer id");
    if (ids.has(offer.id)) throw new Error(`Duplicate offer id: ${offer.id}`);
    ids.add(offer.id);
    const shop = shopById.get(offer.shopId);
    if (!shop) throw new Error(`Unknown offer shopId: ${offer.shopId}`);
    for (const field of ["merchantName", "address", "confirmationRef"]) requireText(offer[field], `Offer ${offer.id}.${field}`);
    if (offer.address !== shop.address) throw new Error(`Offer address does not match current shop: ${offer.id}`);
    if (offer.status !== "confirmed") throw new Error(`Offer ${offer.id} must be merchant confirmed`);
    if (!validStamp(offer.merchantConfirmedAt) || Date.parse(offer.merchantConfirmedAt) > now) throw new Error(`Offer ${offer.id} needs a past confirmation timestamp with an explicit offset`);
    if (!validStamp(offer.startsAt) || !validStamp(offer.expiresAt) || Date.parse(offer.startsAt) <= 0 || Date.parse(offer.expiresAt) <= Date.parse(offer.startsAt)) throw new Error(`Offer ${offer.id} needs valid start and later expiry timestamps with explicit offsets`);
    if (offer.discountCents !== 100 || offer.currency !== "USD") throw new Error(`Offer ${offer.id} must offer 100 cents USD`);
    if (!Number.isInteger(offer.redemptionCap) || offer.redemptionCap < 1 || offer.perCustomerLimit !== 1) throw new Error(`Offer ${offer.id} needs a positive integer cap and perCustomerLimit 1`);
    if (!Array.isArray(offer.terms) || !offer.terms.length) throw new Error(`Offer ${offer.id} needs terms`);
    for (const term of offer.terms) requireText(term, `Offer ${offer.id} term`);
    if (offer.claimPath !== `/api/offers/${offer.id}/claim`) throw new Error(`Offer ${offer.id} has an unsafe claim path`);
    if (offer.paused !== undefined && typeof offer.paused !== "boolean") throw new Error(`Offer ${offer.id}.paused must be boolean`);
  }
}

export function validateGuides(guides, shops) {
  if (!Array.isArray(guides) || !guides.length) throw new Error("Guides must be a nonempty array");
  const shopIds = new Set(shops.map(s => s.id));
  const slugs = new Set();
  for (const guide of guides) {
    for (const field of ["slug", "title", "description", "updatedAt", "intro", "methodology"]) requireText(guide[field], `Guide ${guide.slug ?? "?"}.${field}`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(guide.slug)) throw new Error(`Invalid guide slug: ${guide.slug}`);
    if (slugs.has(guide.slug)) throw new Error(`Duplicate guide slug: ${guide.slug}`);
    slugs.add(guide.slug);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(guide.updatedAt) || !Number.isFinite(Date.parse(guide.updatedAt)) || new Date(guide.updatedAt).toISOString().slice(0, 10) !== guide.updatedAt) throw new Error(`Invalid updatedAt: ${guide.updatedAt}`);
    if (!Array.isArray(guide.entries) || !guide.entries.length) throw new Error(`${guide.slug} needs nonempty entries`);
    const entryIds = new Set();
    for (const entry of guide.entries) {
      if (!shopIds.has(entry.shopId)) throw new Error(`Unknown shopId in ${guide.slug}: ${entry.shopId}`);
      if (entryIds.has(entry.shopId)) throw new Error(`Duplicate shopId in ${guide.slug}: ${entry.shopId}`);
      entryIds.add(entry.shopId);
      for (const field of ["drink", "verdict", "details"]) requireText(entry[field], `${guide.slug}.${entry.shopId}.${field}`);
      if (!Array.isArray(entry.sources) || !entry.sources.length) throw new Error(`${guide.slug}.${entry.shopId} needs sources`);
      for (const source of entry.sources) {
        requireText(source.label, "Source label");
        let url;
        try { url = new URL(source.url); } catch { throw new Error(`Invalid source URL: ${source.url}`); }
        if (url.protocol !== "https:" || url.username || url.password) throw new Error(`Source must use HTTPS without credentials: ${source.url}`);
      }
    }
    if (guide.faqs !== undefined && !Array.isArray(guide.faqs)) throw new Error(`${guide.slug}.faqs must be an array`);
    for (const faq of guide.faqs ?? []) {
      requireText(faq.question, `${guide.slug}.faq.question`);
      requireText(faq.answer, `${guide.slug}.faq.answer`);
    }
  }
}

function guidePage(guide, shops, origin, newsletterAsset) {
  const canonical = `${origin}/guides/${guide.slug}/`;
  const shopById = new Map(shops.map(shop => [shop.id, shop]));
  const entries = guide.entries.map(entry => {
    const shop = shopById.get(entry.shopId);
    const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name}, ${shop.address}, San Francisco, CA`)}`;
    const rows = [["Milk details", entry.milkNote], ["Soy status", shop.soyNote], ["Price", entry.price], ["Availability", entry.availability], ["Hours", shop.hours]].filter(([, value]) => value);
    return `<article class="venue" id="${esc(shop.id)}"><span class="drink">${esc(entry.drink)}</span><h2>${esc(shop.name)}</h2><p class="location">${esc(shop.address)} · ${esc(shop.hood)} · San Francisco</p><p class="verdict">${esc(entry.verdict)}</p>${paragraph(entry.details)}<dl>${rows.map(([label, value]) => `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`).join("")}</dl><div class="links"><a class="button" href="${esc(map)}" target="_blank" rel="noopener noreferrer">Get directions ↗</a><a href="/">Explore the matcha map</a></div><div class="sources"><strong>Sources</strong><ul>${entry.sources.map(source => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)} ↗</a></li>`).join("")}</ul></div></article>`;
  }).join("\n");
  const structured = {
    "@context": "https://schema.org",
    "@graph": [{ "@type": "Article", "@id": `${canonical}#article`, headline: guide.title, description: guide.description, dateModified: guide.updatedAt, mainEntityOfPage: canonical, author: { "@type": "Organization", name: "SF Matcha", url: `${origin}/` }, publisher: { "@type": "Organization", name: "SF Matcha", url: `${origin}/` }, about: "Matcha in San Francisco", mainEntity: { "@id": `${canonical}#list` } }, { "@type": "ItemList", "@id": `${canonical}#list`, name: guide.title, itemListOrder: "https://schema.org/ItemListUnordered", numberOfItems: guide.entries.length, itemListElement: guide.entries.map((entry, index) => { const shop = shopById.get(entry.shopId); return { "@type": "ListItem", position: index + 1, url: `${canonical}#${shop.id}`, name: `${shop.name}: ${entry.drink}`, item: { "@type": "CafeOrCoffeeShop", name: shop.name, address: { "@type": "PostalAddress", streetAddress: shop.address, addressLocality: "San Francisco", addressRegion: "CA", addressCountry: "US" } } }; }) }],
  };
  const date = new Date(`${guide.updatedAt}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  return shell({ title: guide.title, description: guide.description, canonical, structured, newsletterAsset, body: `<div class="breadcrumbs"><a href="/guides/">← All matcha guides</a></div><section class="hero"><div class="eyebrow">${esc(guide.emoji ?? "🍵")} SF Matcha Guide</div><h1>${esc(guide.title)}</h1><p class="lead">${esc(guide.description)}</p><p class="date">Updated ${esc(date)}</p></section><div class="prose">${paragraph(guide.intro)}<aside class="note"><p>${esc(guide.methodology)}</p><p><a href="/methodology/">Read our editorial and badge methodology</a></p></aside><h2>In this guide</h2><ul class="toc">${guide.entries.map(entry => `<li><a href="#${esc(entry.shopId)}">${esc(shopById.get(entry.shopId).name)} — ${esc(entry.drink)}</a></li>`).join("")}</ul>${entries}${guide.faqs?.length ? `<section><h2>Before you go</h2>${guide.faqs.map(faq => `<details><summary>${esc(faq.question)}</summary>${paragraph(faq.answer)}</details>`).join("")}</section>` : ""}<aside class="note"><p>Menus, prices, and hours can change. Check the linked café sources before making a special trip; ask the café about allergies and shared preparation.</p></aside><p><a class="button" href="/">Find your next matcha on the map →</a></p>${newsletterForm("guide_article")}</div>` });
}

export async function buildGuides({ root = projectRoot, outDir = root, origin = defaultOrigin, allowMissing = false, newsletterAsset = "/dist/guide-newsletter.js" } = {}) {
  if (!/^\/dist\/guide-newsletter(?:\.[a-f0-9]{12})?\.js$/.test(newsletterAsset)) throw new Error("Invalid guide newsletter asset path");
  origin = origin.replace(/\/$/, "");
  const parsedOrigin = new URL(origin);
  if (parsedOrigin.protocol !== "https:" || parsedOrigin.pathname !== "/" || parsedOrigin.search || parsedOrigin.hash) throw new Error("Canonical origin must be an HTTPS origin");
  let source;
  try { source = await readFile(path.join(root, "content/guides.json"), "utf8"); }
  catch (error) { if (allowMissing && error.code === "ENOENT") return { guides: 0, pages: [], skipped: true }; throw error; }
  const parsed = JSON.parse(source);
  const guides = Array.isArray(parsed) ? parsed : parsed.guides;
  const context = { window: {} };
  vm.runInNewContext(await readFile(path.join(root, "data.jsx"), "utf8"), context, { timeout: 1000, filename: "data.jsx" });
  const shops = context.window.SHOPS;
  if (!Array.isArray(shops) || !shops.length) throw new Error("No shops exported by data.jsx");
  validateGuides(guides, shops);
  // These documents are reviewed repository content, not venue-provided HTML.
  const [methodology, perks, partnerKit, offers] = await Promise.all(["methodology.html", "perks.html", "partner-kit.md", "offers.json"].map(file => readFile(path.join(root, "content", file), "utf8")));
  for (const [route, document] of [["methodology", methodology], ["perks", perks]]) {
    if (!/^\s*<!doctype html>/i.test(document) || !document.includes(`<link rel="canonical" href="${origin}/${route}/"`)) throw new Error(`${route}.html needs a complete document and the correct canonical URL`);
  }
  validateOffers(JSON.parse(offers), shops);
  const pages = new Map();
  const cards = guides.map(guide => `<article class="card"><a href="/guides/${esc(guide.slug)}/"><span class="emoji" aria-hidden="true">${esc(guide.emoji ?? "🍵")}</span><h2>${esc(guide.title)}</h2><p>${esc(guide.description)}</p><p class="date">Updated ${esc(guide.updatedAt)}</p><strong>Read the guide →</strong></a></article>`).join("\n");
  pages.set("guides/index.html", shell({ title: "San Francisco Matcha Guides", description: "Find your next matcha with source-backed San Francisco guides to banana matcha, cold foam, dairy-free options, and more.", canonical: `${origin}/guides/`, newsletterAsset, body: `<section class="hero"><div class="eyebrow">🍵 What to order next</div><h1>San Francisco matcha guides</h1><p class="lead">Fresh menu finds, milk details, and useful ordering notes for your next matcha stop.</p></section><aside class="note"><p>Our guides use café menus and published sources. They are not firsthand tasting rankings. <a href="/methodology/">See how we choose and verify.</a></p></aside><section class="cards" aria-label="Matcha guides">${cards}</section>${newsletterForm("guides_hub")}` }));
  for (const guide of guides) pages.set(`guides/${guide.slug}/index.html`, guidePage(guide, shops, origin, newsletterAsset));
  pages.set("methodology/index.html", methodology);
  pages.set("perks/index.html", perks);
  pages.set("perks/partner-kit.md", partnerKit);
  pages.set("partner-kit.md", partnerKit);
  pages.set("offers.json", offers);
  const latest = guides.map(g => g.updatedAt).sort().at(-1);
  const urls = [`${origin}/`, `${origin}/guides/`, ...guides.map(g => `${origin}/guides/${g.slug}/`), `${origin}/methodology/`, `${origin}/perks/`, `${origin}/privacy/`];
  pages.set("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${esc(url)}</loc><lastmod>${esc(latest)}</lastmod></url>`).join("\n")}\n</urlset>\n`);
  for (const [file, contents] of pages) {
    await mkdir(path.dirname(path.join(outDir, file)), { recursive: true });
    await writeFile(path.join(outDir, file), contents);
  }
  return { guides: guides.length, pages: [...pages.keys()] };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await buildGuides();
  console.log(`Built ${result.guides} evidence-backed guides and ${result.pages.length} static files.`);
}
