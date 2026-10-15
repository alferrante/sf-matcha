// Server-only, aggregate accounting output. Never accepts or emits claim/customer secrets.
export const MAX_REPORT_OFFERS = 100;

const csvCell = value => {
  let text = String(value);
  // Quoting alone does not stop spreadsheet formulas, including leading whitespace/control.
  if (/^[\s\u0000-\u001f]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};

/** One complete row per approved pilot, including pilots with zero claims. */
export function reconciliationCSV(report) {
  const fields = ['offerId', 'startsAt', 'expiresAt', 'paused', 'redemptionCap',
    'reservedClaims', 'unredeemedClaims', 'successfulRedemptions', 'discountCents', 'discountTotalCents', 'currency'];
  if (!Array.isArray(report.offers) || report.offers.length > MAX_REPORT_OFFERS) throw new Error('Invalid complete report');
  return [fields.map(csvCell).join(','), ...report.offers.map(offer => fields.map(field => csvCell(offer[field])).join(','))].join('\r\n') + '\r\n';
}
