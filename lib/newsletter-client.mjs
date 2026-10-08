// Public capture URL. Provider credentials remain in the separate backend environment.
export const DEFAULT_NEWSLETTER_ENDPOINT = 'https://sfmatcha-newsletter.onrender.com/api/newsletter/subscribe';

export function newsletterEndpoint(value, origin = 'https://sanfranciscomatcha.com') {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value, origin);
    if (url.username || url.password || url.hash) return '';
    if (url.protocol !== 'https:' && !(['localhost', '127.0.0.1'].includes(url.hostname) && url.protocol === 'http:')) return '';
    return url.href;
  } catch { return ''; }
}

export function signupSource(value) {
  return ['homepage', 'guides_hub', 'guide_article'].includes(value) ? value : 'homepage';
}

export async function subscribe({ endpoint, email, consent, source = 'homepage', website = '', fetchImpl = fetch }) {
  if (!newsletterEndpoint(endpoint)) throw new Error('Signup is not available yet.');
  if (consent !== true) throw new Error('Please agree to receive SF Matcha emails.');
  const response = await fetchImpl(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), consent: true, website, source: signupSource(source), consentVersion: '2026-10-07' }),
    signal: AbortSignal.timeout(60000)
  });
  let result;
  try { result = await response.json(); } catch { throw new Error('Signup could not be completed. Please try again later.'); }
  if (!response.ok || result?.success !== true) throw new Error('Signup could not be completed. Please try again later.');
  return 'Thanks! Your signup has been received. You can unsubscribe from any email.';
}
