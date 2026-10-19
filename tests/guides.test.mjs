import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import { buildGuides, validateOffers } from "../scripts/build-guides.mjs";

const shop = { id: "test-cafe", name: "Tea & Matcha", address: "1 Main St", hood: "FiDi", soyNote: "Soy is available.", hours: "Daily 8am–4pm" };
const emptyOffers = { schemaVersion: 1, updatedAt: "2026-10-07", offers: [] };
function confirmedOffer() {
  return { id: "test-pilot", shopId: shop.id, merchantName: shop.name, address: shop.address, status: "confirmed", merchantConfirmedAt: "2026-10-01T09:00:00-07:00", confirmationRef: "merchant-agreement-2026-10-01", startsAt: "2027-01-01T09:00:00-08:00", expiresAt: "2027-02-01T09:00:00-08:00", discountCents: 100, currency: "USD", redemptionCap: 100, perCustomerLimit: 1, terms: ["One eligible matcha; add-ons excluded."], claimPath: "/api/offers/test-pilot/claim" };
}
function guide(index = 0) {
  return { slug: `guide-${index}`, title: `Matcha Guide ${index}`, description: "Find matcha with current menu details.", emoji: "🍵", updatedAt: "2026-10-07", intro: "Source-backed drinks to try.", methodology: "Menu research, not a tasting ranking.", entries: [{ shopId: shop.id, drink: "Classic matcha", verdict: "Order with soy.", details: "A whisked matcha latte.", milkNote: "Check toppings for dairy.", price: "$6", availability: "Currently on the menu", sources: [{ label: "Official menu", url: "https://example.com/menu" }] }], faqs: [{ question: "Is soy available?", answer: "The café lists soy milk." }] };
}
async function fixture(guides = [guide()]) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "sf-matcha-guides-"));
  await mkdir(path.join(dir, "content"));
  await writeFile(path.join(dir, "data.jsx"), `window.SHOPS = ${JSON.stringify([shop])};`);
  await writeFile(path.join(dir, "content/guides.json"), JSON.stringify(guides));
  await writeFile(path.join(dir, "content/methodology.html"), '<!doctype html><html lang="en"><head><link rel="canonical" href="https://sanfranciscomatcha.com/methodology/"></head><body><h1>How we choose</h1><p>Menu research and transparent badges.</p></body></html>');
  await writeFile(path.join(dir, "content/perks.html"), '<!doctype html><html lang="en"><head><link rel="canonical" href="https://sanfranciscomatcha.com/perks/"></head><body><h1>Café perks</h1><p>No offers active yet.</p></body></html>');
  await writeFile(path.join(dir, "content/partner-kit.md"), "# Partner pilot\nMerchant confirmation required.\n");
  await writeFile(path.join(dir, "content/offers.json"), JSON.stringify(emptyOffers));
  return dir;
}

test("all guides have canonical URLs, source links, current venue facts and structured data", async () => {
  const dir = await fixture(Array.from({ length: 6 }, (_, i) => guide(i)));
  try {
    const newsletterAsset = "/dist/guide-newsletter.123456abcdef.js";
    const result = await buildGuides({ root: dir, newsletterAsset });
    assert.equal(result.guides, 6);
    const index = await readFile(path.join(dir, "guides/index.html"), "utf8");
    assert.equal((index.match(/class="card"/g) ?? []).length, 6);
    assert.match(index, /data-newsletter-source="guides_hub"/);
    assert.equal((index.match(/data-guide-newsletter /g) ?? []).length, 1);
    const sitemap = await readFile(path.join(dir, "sitemap.xml"), "utf8");
    assert.match(sitemap, /<loc>https:\/\/sanfranciscomatcha\.com\/<\/loc>/);
    assert.equal((sitemap.match(/<url>/g) ?? []).length, 11);
    for (let i = 0; i < 6; i++) {
      const html = await readFile(path.join(dir, `guides/guide-${i}/index.html`), "utf8");
      assert.match(html, new RegExp(`<link rel="canonical" href="https://sanfranciscomatcha.com/guides/guide-${i}/">`));
      assert.match(html, /href="https:\/\/example.com\/menu"/);
      assert.match(html, /1 Main St/);
      assert.match(html, /Daily 8am–4pm/);
      assert.match(html, /Soy is available/);
      assert.equal((html.match(/data-guide-newsletter /g) ?? []).length, 1);
      assert.match(html, /data-newsletter-source="guide_article"/);
      assert.equal((html.match(/data-guide-sharing/g) ?? []).length, 1);
      assert.match(html, /type="button" hidden>Share guide/);
      assert.match(html, /<script type="module" src="\/dist\/guide-newsletter\.123456abcdef\.js">/);
      assert.match(html, /name="consent" type="checkbox" required>/);
      assert.doesNotMatch(html, /name="consent"[^>]*checked/);
      assert.match(html, /href="\/privacy\/"/);
      assert.match(html, /name="website" tabindex="-1" autocomplete="off"/);
      assert.match(html, /google.com\/maps\/search\/\?api=1&amp;query=/);
      const structured = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
      assert.equal(structured["@graph"][0]["@type"], "Article");
      assert.equal(structured["@graph"][1]["@type"], "ItemList");
      assert.equal(structured["@graph"][1].itemListOrder, "https://schema.org/ItemListUnordered");
      assert.equal(structured["@graph"][1].itemListElement[0].item.name, shop.name);
      assert.equal(structured["@graph"][0].dateModified, "2026-10-07");
    }
    const methodology = await readFile(path.join(dir, "methodology/index.html"), "utf8");
    assert.match(methodology, /<h1>How we choose<\/h1>/);
    assert.equal((methodology.match(/<html/g) ?? []).length, 1);
    assert.equal(methodology, await readFile(path.join(dir, "content/methodology.html"), "utf8"));
    assert.match(await readFile(path.join(dir, "perks/index.html"), "utf8"), /No offers active yet/);
    assert.equal(await readFile(path.join(dir, "perks/partner-kit.md"), "utf8"), "# Partner pilot\nMerchant confirmation required.\n");
    assert.equal(await readFile(path.join(dir, "partner-kit.md"), "utf8"), "# Partner pilot\nMerchant confirmation required.\n");
    assert.deepEqual(JSON.parse(await readFile(path.join(dir, "offers.json"), "utf8")), emptyOffers);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("guide hub shows the newest verified guide first", async () => {
  const older = guide(0);
  const newer = guide(1);
  newer.updatedAt = "2026-10-13";
  const dir = await fixture([older, newer]);
  try {
    await buildGuides({ root: dir });
    const index = await readFile(path.join(dir, "guides/index.html"), "utf8");
    assert.ok(index.indexOf("/guides/guide-1/") < index.indexOf("/guides/guide-0/"));
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("sitemap dates belong to each article and do not advance when another guide is added", async () => {
  const older = guide(0);
  older.updatedAt = "2024-02-29";
  const newer = guide(1);
  newer.updatedAt = "2026-10-13";
  const dir = await fixture([older, newer]);
  const sitemapEntries = text => new Map([...text.matchAll(/<url><loc>([^<]+)<\/loc>(.*?)<\/url>/g)].map(([, loc, metadata]) => [loc, metadata]));
  try {
    await buildGuides({ root: dir });
    const before = sitemapEntries(await readFile(path.join(dir, "sitemap.xml"), "utf8"));
    for (const record of [older, newer]) {
      assert.equal(before.get(`https://sanfranciscomatcha.com/guides/${record.slug}/`), `<lastmod>${record.updatedAt}</lastmod>`);
    }
    const olderHtml = await readFile(path.join(dir, "guides/guide-0/index.html"), "utf8");
    const newest = guide(2);
    newest.updatedAt = "2026-10-19";
    await writeFile(path.join(dir, "content/guides.json"), JSON.stringify([older, newer, newest]));
    await buildGuides({ root: dir });
    const sitemap = await readFile(path.join(dir, "sitemap.xml"), "utf8");
    const after = sitemapEntries(sitemap);
    assert.equal(after.size, before.size + 1);
    for (const [loc, metadata] of before) assert.equal(after.get(loc), metadata, `Unrelated page date changed: ${loc}`);
    assert.equal(after.get("https://sanfranciscomatcha.com/guides/guide-2/"), "<lastmod>2026-10-19</lastmod>");
    assert.equal((sitemap.match(/<lastmod>/g) ?? []).length, 3);
    assert.equal(await readFile(path.join(dir, "guides/guide-0/index.html"), "utf8"), olderHtml);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("sitemap omits unknown modification dates for nonarticle pages", async () => {
  const dir = await fixture();
  try {
    await buildGuides({ root: dir });
    const sitemap = await readFile(path.join(dir, "sitemap.xml"), "utf8");
    for (const route of ["/", "/guides/", "/methodology/", "/perks/", "/privacy/"]) {
      assert.ok(sitemap.includes(`<url><loc>https://sanfranciscomatcha.com${route}</loc></url>`), `Unexpected inferred date for ${route}`);
    }
    assert.equal((sitemap.match(/<lastmod>/g) ?? []).length, 1);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("guide previews render matching covers in both layouts and remove stale image metadata", async () => {
  const image = await readFile(new URL("../social/banana-matcha-san-francisco/slide-01.png", import.meta.url));
  for (const compactLayout of [true, false]) {
    const record = { ...guide(), compactLayout, title: 'Matcha "guide" & picks </script>' };
    const dir = await fixture([record]);
    const file = `social/${record.slug}/slide-01.png`;
    try {
      await mkdir(path.join(dir, "social", record.slug), { recursive: true });
      await writeFile(path.join(dir, file), image);
      const set = { guideSlug: record.slug, guideUrl: `https://sanfranciscomatcha.com/guides/${record.slug}/`, verifiedAt: record.updatedAt, slides: [{ file, slide: 1, headline: record.title, width: 1080, height: 1080, bytes: image.length, sha256: createHash("sha256").update(image).digest("hex") }] };
      await writeFile(path.join(dir, "social/manifest.json"), JSON.stringify({ sets: [set] }));
      await buildGuides({ root: dir });
      const html = await readFile(path.join(dir, `guides/${record.slug}/index.html`), "utf8");
      const imageUrl = `https://sanfranciscomatcha.com/${file}`;
      assert.ok(html.includes(`<meta property="og:image" content="${imageUrl}">`));
      assert.ok(html.includes(`<meta name="twitter:image" content="${imageUrl}">`));
      assert.match(html, /property="og:image:width" content="1080"/);
      assert.match(html, /property="og:image:height" content="1080"/);
      assert.match(html, /property="og:image:alt" content="Matcha &quot;guide&quot; &amp; picks &lt;\/script&gt;"/);
      assert.match(html, /name="twitter:card" content="summary"/);
      assert.doesNotMatch(html, /summary_large_image/);
      const structured = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
      assert.deepEqual(structured["@graph"][0].image, { "@type": "ImageObject", url: imageUrl, width: 1080, height: 1080, caption: record.title });
      assert.equal(structured["@graph"][0].dateModified, record.updatedAt);
      assert.doesNotMatch(await readFile(path.join(dir, "guides/index.html"), "utf8"), /og:image|twitter:image/);
      set.verifiedAt = "2026-10-06";
      await writeFile(path.join(dir, "social/manifest.json"), JSON.stringify({ sets: [set] }));
      await buildGuides({ root: dir });
      const fallback = await readFile(path.join(dir, `guides/${record.slug}/index.html`), "utf8");
      assert.doesNotMatch(fallback, /og:image|twitter:image|ImageObject/);
      assert.equal(fallback.split("</head>")[1], html.split("</head>")[1]);
    } finally { await rm(dir, { recursive: true, force: true }); }
  }
});

test("related guide links use curated order, existing local URLs and escaped titles", async () => {
  for (const compactLayout of [true, false]) {
    const records = [guide(0), guide(1), guide(2), guide(3)];
    records[0].compactLayout = compactLayout;
    records[0].relatedGuides = ["guide-2", "guide-1"];
    records[2].cardTitle = '<img src=x onerror=alert(1)> & tea';
    const dir = await fixture(records);
    try {
      await buildGuides({ root: dir });
      const html = await readFile(path.join(dir, "guides/guide-0/index.html"), "utf8");
      const nav = html.match(/<nav class="related-guides"[^>]*>([\s\S]*?)<\/nav>/)[1];
      assert.equal((nav.match(/<li>/g) ?? []).length, 2);
      assert.ok(nav.indexOf('/guides/guide-2/') < nav.indexOf('/guides/guide-1/'));
      assert.doesNotMatch(nav, /guide-0|guide-3|<img/);
      assert.match(nav, /&lt;img src=x onerror=alert\(1\)&gt; &amp; tea/);
      assert.ok(html.indexOf('aria-label="More matcha guides"') < html.indexOf('data-guide-newsletter'));
      const noRelated = await readFile(path.join(dir, "guides/guide-3/index.html"), "utf8");
      assert.doesNotMatch(noRelated, /<nav class="related-guides"/);
      const structured = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
      assert.equal(structured["@graph"][0].dateModified, records[0].updatedAt);
    } finally { await rm(dir, { recursive: true, force: true }); }
  }
});

test("bad related guides fail before writing any public page", async () => {
  for (const relatedGuides of [["missing"], ["guide-0"], ["guide-1", "guide-1"], ["guide-1", "guide-2", "guide-3", "guide-4"], "guide-1", ["../perks"], ["https://evil.example/"]]) {
    const records = Array.from({ length: 5 }, (_, i) => guide(i));
    records[0].relatedGuides = relatedGuides;
    const dir = await fixture(records);
    try {
      await assert.rejects(buildGuides({ root: dir }), /related guide|relatedGuides/);
      await assert.rejects(readFile(path.join(dir, "guides/index.html")), { code: "ENOENT" });
    } finally { await rm(dir, { recursive: true, force: true }); }
  }
});

test("offer validation permits a future pilot only with completed merchant confirmation", () => {
  assert.doesNotThrow(() => validateOffers({ ...emptyOffers, offers: [confirmedOffer()] }, [shop], { now: Date.parse("2026-10-07T18:00:00Z") }));
  const cases = [
    { modify: offer => { offer.merchantConfirmedAt = "2026-10-08T09:00:00-07:00"; }, error: /past confirmation/ },
    { modify: offer => { offer.startsAt = "2027-01-01T09:00:00"; }, error: /explicit offsets/ },
    { modify: offer => { offer.expiresAt = "2027-01-01T09:00:00-08:00"; }, error: /later expiry/ },
    { modify: offer => { offer.expiresAt = "2027-02-30T09:00:00-08:00"; }, error: /later expiry/ },
    { modify: offer => { offer.address = "2 Main St"; }, error: /address does not match/ },
    { modify: offer => { offer.discountCents = 200; }, error: /100 cents USD/ },
    { modify: offer => { offer.redemptionCap = 1.5; }, error: /positive integer/ },
    { modify: offer => { offer.terms = []; }, error: /needs terms/ },
    { modify: offer => { offer.apiKey = "private"; }, error: /private offer field/ },
  ];
  for (const { modify, error } of cases) {
    const offer = confirmedOffer(); modify(offer);
    assert.throws(() => validateOffers({ ...emptyOffers, offers: [offer] }, [shop], { now: Date.parse("2026-10-07T18:00:00Z") }), error);
  }
  assert.throws(() => validateOffers({ ...emptyOffers, offers: [confirmedOffer(), confirmedOffer()] }, [shop]), /Duplicate offer id/);
  assert.throws(() => validateOffers({ ...emptyOffers, apiKey: "private" }, [shop]), /private offers document field/);
});

test("fresh guide soy and hours evidence overrides older directory fields and rejects nontext overrides", async () => {
  const record = guide();
  record.compactLayout = true;
  delete record.entries[0].price;
  record.entries[0].soyNote = "Current menu does not confirm soy; ask the shop.";
  record.entries[0].hours = "Call for current hours.";
  const dir = await fixture([record]);
  try {
    await buildGuides({ root: dir });
    const html = await readFile(path.join(dir, "guides/guide-0/index.html"), "utf8");
    assert.match(html, /Ask the café/);
    assert.match(html, /Current menu does not confirm soy; ask the shop\./);
    assert.match(html, /Call for current hours\./);
    assert.doesNotMatch(html, /Soy is available\./);
    assert.doesNotMatch(html, /Daily 8am–4pm/);
    for (const field of ["soyNote", "hours"]) {
      const badRecord = guide();
      badRecord.entries[0][field] = { text: "unsafe type" };
      await writeFile(path.join(dir, "content/guides.json"), JSON.stringify([badRecord]));
      await assert.rejects(buildGuides({ root: dir }), /must be a nonempty string/);
      badRecord.entries[0][field] = "   ";
      await writeFile(path.join(dir, "content/guides.json"), JSON.stringify([badRecord]));
      await assert.rejects(buildGuides({ root: dir }), /must be a nonempty string/);
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("unconfirmed offers, unknown cafés and unsafe claims prevent all generated files", async () => {
  const cases = [
    { modify: offer => { offer.shopId = "missing-cafe"; }, error: /Unknown offer shopId/ },
    { modify: offer => { offer.status = "pending"; }, error: /merchant confirmed/ },
    { modify: offer => { offer.claimPath = "https://evil.example/claim"; }, error: /unsafe claim path/ },
    { modify: offer => { offer.claimEndpoint = "https://evil.example/claim"; }, error: /private offer field/ },
  ];
  for (const { modify, error } of cases) {
    const dir = await fixture();
    try {
      const offer = confirmedOffer(); modify(offer);
      await writeFile(path.join(dir, "content/offers.json"), JSON.stringify({ ...emptyOffers, offers: [offer] }));
      await assert.rejects(buildGuides({ root: dir }), error);
      await assert.rejects(readFile(path.join(dir, "guides/index.html")), { code: "ENOENT" });
    } finally { await rm(dir, { recursive: true, force: true }); }
  }
});

test("guide text is escaped in HTML, attributes and JSON-LD without ending its script", async () => {
  const value = '</script><script>alert("x")</script>&';
  const record = guide();
  record.title = value;
  record.description = value;
  record.intro = value;
  record.entries[0].drink = value;
  record.entries[0].sources[0] = { label: value, url: "https://example.com/?x=1&y=2" };
  record.faqs[0].answer = value;
  for (const compactLayout of [false, true]) {
    record.compactLayout = compactLayout;
    record.cardTitle = value;
    const dir = await fixture([record]);
    try {
      await buildGuides({ root: dir });
      const html = await readFile(path.join(dir, "guides/guide-0/index.html"), "utf8");
      assert.doesNotMatch(html, /<script>alert/);
      assert.match(html, /&lt;\/script&gt;&lt;script&gt;alert\(&quot;x&quot;\)/);
      assert.match(html, /href="https:\/\/example.com\/\?x=1&amp;y=2"/);
      assert.equal((html.match(/<script/g) ?? []).length, 3);
      const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
      assert.match(raw, /\\u003c\/script\\u003e/);
      assert.equal(JSON.parse(raw)["@graph"][0].headline, value);
    } finally { await rm(dir, { recursive: true, force: true }); }
  }
});

test("bad venue IDs, duplicate slugs, impossible dates and unsafe sources fail before files are written", async () => {
  const cases = [
    { modify: records => { records[0].entries[0].shopId = "missing"; }, error: /Unknown shopId/ },
    { modify: records => { records.push(structuredClone(records[0])); }, error: /Duplicate guide slug/ },
    { modify: records => { records[0].slug = "../bad"; }, error: /Invalid guide slug/ },
    { modify: records => { records[0].updatedAt = "2026-02-30"; }, error: /Invalid updatedAt/ },
    { modify: records => { records[0].updatedAt = "2026-02-29"; }, error: /Invalid updatedAt/ },
    { modify: records => { records[0].updatedAt = "2026-10-07T00:00:00Z"; }, error: /Invalid updatedAt/ },
    { modify: records => { records[0].updatedAt = "2026-10-07</lastmod><priority>1</priority>"; }, error: /Invalid updatedAt/ },
    { modify: records => { records[0].entries[0].sources[0].url = "javascript:alert(1)"; }, error: /HTTPS/ },
    { modify: records => { records[0].entries[0].sources[0].url = "https://user:password@example.com"; }, error: /credentials/ },
    { modify: records => { records[0].entries = []; }, error: /nonempty entries/ },
    { modify: records => { records[0].entries[0].sources = []; }, error: /needs sources/ },
  ];
  for (const scenario of cases) {
    const records = [guide()];
    scenario.modify(records);
    const dir = await fixture(records);
    try {
      await assert.rejects(buildGuides({ root: dir }), scenario.error);
      await assert.rejects(readFile(path.join(dir, "guides/index.html")), { code: "ENOENT" });
    } finally { await rm(dir, { recursive: true, force: true }); }
  }
});

test("missing initial content can be explicitly skipped but malformed content never silently skips", async () => {
  const dir = await fixture();
  try {
    await rm(path.join(dir, "content/guides.json"));
    assert.equal((await buildGuides({ root: dir, allowMissing: true })).skipped, true);
    await assert.rejects(buildGuides({ root: dir }), { code: "ENOENT" });
    await writeFile(path.join(dir, "content/guides.json"), "not json");
    await assert.rejects(buildGuides({ root: dir, allowMissing: true }), SyntaxError);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
