import test from "node:test";
import assert from "node:assert/strict";
import { initializeGuideNewsletter } from "../lib/guide-newsletter.mjs";

function surface(source = "guide_article") {
  const fields = { email: { value: "reader@example.com", disabled: false }, consent: { checked: false, disabled: false }, website: { value: "", disabled: false } };
  const button = { textContent: "Get matcha updates →", disabled: true };
  const message = { textContent: "", dataset: {}, attrs: {}, setAttribute(name, value) { this.attrs[name] = value; } };
  const form = { dataset: {}, attrs: {}, listeners: [], setAttribute(name, value) { this.attrs[name] = value; }, querySelector(selector) { return selector.startsWith("button") ? button : fields[selector.match(/name="(.*?)"/)[1]]; }, querySelectorAll() { return [...Object.values(fields), button]; }, checkValidity() { return true; }, addEventListener(_name, handler) { this.listeners.push(handler); } };
  const section = { dataset: { newsletterSource: source }, querySelector(selector) { return selector === "form" ? form : message; } };
  const doc = { querySelectorAll() { return [section]; } };
  return { doc, fields, form, button, message, event: { preventDefault() {} } };
}

test("guide signup requires explicit consent and initializes once", async () => {
  const ui = surface();
  let requests = 0;
  initializeGuideNewsletter({ doc: ui.doc, subscribeImpl: async () => { requests++; } });
  initializeGuideNewsletter({ doc: ui.doc, subscribeImpl: async () => { requests++; } });
  assert.equal(ui.form.listeners.length, 1);
  assert.equal(ui.button.disabled, false);
  await ui.form.listeners[0](ui.event);
  assert.equal(requests, 0);
  assert.match(ui.message.textContent, /agree/);
  assert.equal(ui.message.attrs.role, "alert");
});

test("article and hub subscriptions preserve source, saving state, honeypot and prevent duplicate requests", async () => {
  for (const source of ["guide_article", "guides_hub"]) {
    const ui = surface(source);
    ui.fields.consent.checked = true;
    ui.fields.website.value = "bot-value";
    let resolveRequest;
    let request;
    const promise = new Promise(resolve => { resolveRequest = resolve; });
    initializeGuideNewsletter({ doc: ui.doc, subscribeImpl: params => { assert.equal(request, undefined); request = params; return promise; } });
    const pending = ui.form.listeners[0](ui.event);
    await ui.form.listeners[0](ui.event);
    assert.equal(request.source, source);
    assert.equal(request.website, "bot-value");
    assert.equal(request.consent, true);
    assert.match(request.endpoint, /^https:\/\/sfmatcha-newsletter.onrender.com\//);
    assert.equal(ui.button.disabled, true);
    assert.equal(ui.form.attrs["aria-busy"], "true");
    assert.equal(ui.message.dataset.status, "saving");
    resolveRequest("Thanks! Your signup has been received.");
    await pending;
    assert.equal(ui.message.dataset.status, "success");
    assert.match(ui.message.textContent, /received/);
    assert.equal(ui.fields.email.value, "");
    assert.equal(ui.fields.consent.checked, false);
    assert.equal(ui.fields.website.value, "");
    assert.equal(ui.button.disabled, false);
    assert.equal(ui.form.attrs["aria-busy"], "false");
  }
});

test("failed capture keeps entered values and consent for retry; invalid endpoints cannot submit", async () => {
  const ui = surface();
  ui.fields.consent.checked = true;
  initializeGuideNewsletter({ doc: ui.doc, subscribeImpl: async () => { throw new Error("provider secret details"); } });
  await ui.form.listeners[0](ui.event);
  assert.equal(ui.message.attrs.role, "alert");
  assert.match(ui.message.textContent, /try again/);
  assert.doesNotMatch(ui.message.textContent, /secret/);
  assert.equal(ui.fields.email.value, "reader@example.com");
  assert.equal(ui.fields.consent.checked, true);
  assert.equal(ui.button.disabled, false);
  const unavailable = surface();
  initializeGuideNewsletter({ doc: unavailable.doc, config: { newsletterEndpoint: "javascript:alert(1)" } });
  assert.equal(unavailable.form.hidden, true);
  assert.equal(unavailable.form.listeners.length, 0);
  assert.equal(unavailable.button.disabled, true);
});
