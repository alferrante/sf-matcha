export function initializeGuideSharing({ doc = document, nav = globalThis.navigator } = {}) {
  const canonical = doc.querySelector('link[rel="canonical"]')?.href;
  let url;
  try { url = new URL(canonical); } catch { return []; }
  if (url.origin !== 'https://sanfranciscomatcha.com' || url.username || url.password || url.search || url.hash || !/^\/guides\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(url.pathname)) return [];
  const title = doc.querySelector('h1')?.textContent || 'SF Matcha';
  const handlers = [];
  for (const section of doc.querySelectorAll('[data-guide-sharing]')) {
    const button = section.querySelector('button');
    const message = section.querySelector('[data-share-message]');
    const fallback = section.querySelector('input');
    if (!button || !message || !fallback || button.dataset.initialized === 'true') continue;
    button.dataset.initialized = 'true';
    button.hidden = false;
    fallback.value = url.href;
    fallback.readOnly = true;
    let pending = false;
    const onShare = async () => {
      if (pending) return;
      pending = true;
      button.disabled = true;
      message.textContent = '';
      fallback.hidden = true;
      try {
        const payload = { title, url: url.href };
        if (typeof nav?.share === 'function' && (!nav.canShare || nav.canShare(payload))) {
          try { await nav.share(payload); return; }
          catch (error) { if (error?.name === 'AbortError') return; }
        }
        if (typeof nav?.clipboard?.writeText === 'function') {
          await nav.clipboard.writeText(url.href);
          message.textContent = 'Link copied';
        } else {
          throw new Error('Clipboard unavailable');
        }
      } catch {
        fallback.hidden = false;
        fallback.focus?.();
        fallback.select?.();
        message.textContent = 'Copy this link';
      } finally {
        button.disabled = false;
        pending = false;
      }
    };
    button.addEventListener('click', onShare);
    handlers.push(onShare);
  }
  return handlers;
}
