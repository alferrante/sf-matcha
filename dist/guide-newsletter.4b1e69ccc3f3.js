// lib/newsletter-client.mjs
var DEFAULT_NEWSLETTER_ENDPOINT = "https://sfmatcha-newsletter.onrender.com/api/newsletter/subscribe";
function newsletterEndpoint(value, origin = "https://sanfranciscomatcha.com") {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value, origin);
    if (url.username || url.password || url.hash) return "";
    if (url.protocol !== "https:" && !(["localhost", "127.0.0.1"].includes(url.hostname) && url.protocol === "http:")) return "";
    return url.href;
  } catch {
    return "";
  }
}
function signupSource(value) {
  return ["homepage", "guides_hub", "guide_article"].includes(value) ? value : "homepage";
}
async function subscribe({ endpoint, email, consent, source = "homepage", website = "", fetchImpl = fetch }) {
  if (!newsletterEndpoint(endpoint)) throw new Error("Signup is not available yet.");
  if (consent !== true) throw new Error("Please agree to receive SF Matcha emails.");
  const response = await fetchImpl(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), consent: true, website, source: signupSource(source), consentVersion: "2026-10-07" }),
    signal: AbortSignal.timeout(6e4)
  });
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("Signup could not be completed. Please try again later.");
  }
  if (!response.ok || result?.success !== true) throw new Error("Signup could not be completed. Please try again later.");
  return "Thanks! Your signup has been received. You can unsubscribe from any email.";
}

// lib/guide-newsletter.mjs
function initializeGuideNewsletter({ doc = document, config = globalThis.window?.SF_MATCHA_CONFIG, origin = globalThis.location?.origin, subscribeImpl = subscribe } = {}) {
  const endpoint = newsletterEndpoint(config?.newsletterEndpoint ?? DEFAULT_NEWSLETTER_ENDPOINT, origin);
  const subscriptions = [];
  for (const section of doc.querySelectorAll("[data-guide-newsletter]")) {
    const form = section.querySelector("form");
    if (!form || form.dataset.initialized === "true") continue;
    const email = form.querySelector('[name="email"]');
    const consent = form.querySelector('[name="consent"]');
    const website = form.querySelector('[name="website"]');
    const button = form.querySelector('button[type="submit"]');
    const message = section.querySelector("[data-signup-message]");
    const source = section.dataset.newsletterSource;
    if (!email || !consent || !website || !button || !message || !["guides_hub", "guide_article"].includes(source)) continue;
    form.dataset.initialized = "true";
    let pending = false;
    const show = (text, status) => {
      message.textContent = text;
      message.dataset.status = status;
      message.setAttribute("role", status === "error" ? "alert" : "status");
    };
    if (!endpoint) {
      form.hidden = true;
      show("Email signup is temporarily unavailable. Please try again later.", "error");
      continue;
    }
    button.disabled = false;
    const onSubmit = async (event) => {
      event.preventDefault();
      if (pending) return;
      if (form.checkValidity && !form.checkValidity()) {
        form.reportValidity?.();
        return;
      }
      if (!consent.checked) {
        show("Please agree to receive SF Matcha emails.", "error");
        return;
      }
      pending = true;
      const controls = [...form.querySelectorAll("input, button")];
      const disabled = controls.map((control) => control.disabled);
      controls.forEach((control) => {
        control.disabled = true;
      });
      const label = button.textContent;
      button.textContent = "Saving…";
      form.setAttribute("aria-busy", "true");
      show("Saving your signup… This may take a moment.", "saving");
      try {
        const result = await subscribeImpl({ endpoint, email: email.value, consent: consent.checked, website: website.value, source });
        show(result, "success");
        email.value = "";
        consent.checked = false;
        website.value = "";
      } catch {
        show("Signup could not be completed. Please try again later.", "error");
      } finally {
        controls.forEach((control, index) => {
          control.disabled = disabled[index];
        });
        button.textContent = label;
        form.setAttribute("aria-busy", "false");
        pending = false;
      }
    };
    form.addEventListener("submit", onSubmit);
    subscriptions.push(onSubmit);
  }
  return subscriptions;
}
if (typeof document !== "undefined") initializeGuideNewsletter();
export {
  initializeGuideNewsletter
};
