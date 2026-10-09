export const CLOUDFLARE_ANALYTICS_TOKEN = "ca615ca6812e4fb884d8d758c6a5720c";
export const CLOUDFLARE_ANALYTICS_SRC = "https://static.cloudflareinsights.com/beacon.min.js";

const analyticsTag = `<script defer src="${CLOUDFLARE_ANALYTICS_SRC}" data-cf-beacon='{"token":"${CLOUDFLARE_ANALYTICS_TOKEN}"}'></script>`;
const analyticsPattern = /(?:<!--\s*Cloudflare Web Analytics\s*-->)?\s*<script\b(?=[^>]*\bsrc=["']https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js["'])[^>]*><\/script>\s*(?:<!--\s*End Cloudflare Web Analytics\s*-->)?/gi;

export function injectSiteAnalytics(html) {
  if (typeof html !== "string" || !/<\/body\s*>/i.test(html)) {
    throw new Error("Analytics injection requires a complete HTML document");
  }
  const withoutExisting = html.replace(analyticsPattern, "");
  return withoutExisting.replace(/<\/body\s*>/i, `${analyticsTag}\n</body>`);
}

