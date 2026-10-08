import { DEFAULT_NEWSLETTER_ENDPOINT, newsletterEndpoint, subscribe } from "./newsletter-client.mjs";

export function initializeGuideNewsletter({ doc = document, config = globalThis.window?.SF_MATCHA_CONFIG, origin = globalThis.location?.origin, subscribeImpl = subscribe } = {}) {
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
    const onSubmit = async event => {
      event.preventDefault();
      if (pending) return;
      if (form.checkValidity && !form.checkValidity()) { form.reportValidity?.(); return; }
      if (!consent.checked) { show("Please agree to receive SF Matcha emails.", "error"); return; }
      pending = true;
      const controls = [...form.querySelectorAll("input, button")];
      const disabled = controls.map(control => control.disabled);
      controls.forEach(control => { control.disabled = true; });
      const label = button.textContent;
      button.textContent = "Saving…";
      form.setAttribute("aria-busy", "true");
      show("Saving your signup… This may take a moment.", "saving");
      try {
        const result = await subscribeImpl({ endpoint, email: email.value, consent: consent.checked, website: website.value, source });
        show(result, "success");
        email.value = ""; consent.checked = false; website.value = "";
      } catch {
        show("Signup could not be completed. Please try again later.", "error");
      } finally {
        controls.forEach((control, index) => { control.disabled = disabled[index]; });
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
