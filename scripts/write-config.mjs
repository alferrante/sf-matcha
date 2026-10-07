import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { DEFAULT_NEWSLETTER_ENDPOINT, newsletterEndpoint } from "../lib/newsletter-client.mjs";
const config = { googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "", newsletterEndpoint: newsletterEndpoint(process.env.NEWSLETTER_ENDPOINT ?? DEFAULT_NEWSLETTER_ENDPOINT) };
// JSON encoding prevents quotes, newlines, or backslashes from breaking JS.
writeFileSync(fileURLToPath(new URL("../config.js", import.meta.url)),
  `window.SF_MATCHA_CONFIG = ${JSON.stringify(config)};\n`);
console.log("Wrote public browser configuration.");
