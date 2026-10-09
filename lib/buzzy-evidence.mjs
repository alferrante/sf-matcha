const DAY = 86_400_000;

function parseDay(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value ? timestamp : NaN;
}

export function validateBuzzyEvidence(records, shops) {
  if (!Array.isArray(records)) throw new Error("Buzzy evidence must be an array");
  const shopById = new Map(shops.map(shop => [shop.id, shop]));
  const ids = new Set();
  for (const record of records) {
    const fields = ["shopId", "reason", "source", "verifiedAt", "reviewBy"];
    if (!record || typeof record !== "object" || Array.isArray(record)) throw new Error("Buzzy evidence must be an object");
    for (const field of fields) if (typeof record[field] !== "string" || !record[field].trim()) throw new Error(`Buzzy evidence needs ${field}`);
    for (const field of Object.keys(record)) if (!fields.includes(field)) throw new Error(`Unknown Buzzy evidence field: ${field}`);
    if (ids.has(record.shopId)) throw new Error(`Duplicate Buzzy evidence: ${record.shopId}`);
    ids.add(record.shopId);
    const shop = shopById.get(record.shopId);
    if (!shop) throw new Error(`Unknown Buzzy shop: ${record.shopId}`);
    if (shop.buzzy !== true) throw new Error(`Buzzy evidence points to a disabled legacy label: ${record.shopId}`);
    let url;
    try { url = new URL(record.source); } catch { throw new Error(`Invalid Buzzy source: ${record.source}`); }
    if (url.protocol !== "https:" || url.username || url.password) throw new Error(`Unsafe Buzzy source: ${record.source}`);
    const verified = parseDay(record.verifiedAt);
    const review = parseDay(record.reviewBy);
    if (!Number.isFinite(verified) || !Number.isFinite(review) || review < verified || review - verified > 90 * DAY) throw new Error(`Buzzy review window must be 0–90 days: ${record.shopId}`);
  }
  return new Map(records.map(record => [record.shopId, record]));
}

export function isBuzzyCurrent(shop, evidenceByShop, now = Date.now()) {
  const record = shop?.buzzy === true ? evidenceByShop.get(shop.id) : null;
  if (!record) return false;
  const verified = parseDay(record.verifiedAt);
  const review = parseDay(record.reviewBy) + DAY - 1;
  return Number.isFinite(verified) && Number.isFinite(review) && verified <= now && now <= review;
}
