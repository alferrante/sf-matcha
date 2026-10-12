import test from 'node:test';
import assert from 'node:assert/strict';
import { initializeGuideSharing } from '../lib/guide-sharing.mjs';

const url = 'https://sanfranciscomatcha.com/guides/banana-matcha-san-francisco/';
function surface(canonical = url) {
  const button = { dataset: {}, hidden: true, disabled: false, listeners: [], addEventListener(_type, handler) { this.listeners.push(handler); } };
  const message = { textContent: '' };
  const input = { hidden: true, value: '', focus() { this.focused = true; }, select() { this.selected = true; } };
  const section = { querySelector(selector) { return selector === 'button' ? button : selector === 'input' ? input : message; } };
  const doc = { querySelector(selector) { return selector === 'h1' ? { textContent: 'Banana matcha in SF' } : { href: canonical }; }, querySelectorAll() { return [section]; } };
  return { doc, button, message, input };
}

test('native guide sharing uses the canonical article and prevents duplicate dialogs', async () => {
  const ui = surface();
  let finish, calls = 0;
  const nav = { share(payload) { calls++; assert.deepEqual(payload, { title: 'Banana matcha in SF', url }); return new Promise(resolve => { finish = resolve; }); } };
  initializeGuideSharing({ doc: ui.doc, nav });
  initializeGuideSharing({ doc: ui.doc, nav });
  assert.equal(ui.button.listeners.length, 1);
  const pending = ui.button.listeners[0]();
  await ui.button.listeners[0]();
  assert.equal(calls, 1);
  assert.equal(ui.button.disabled, true);
  finish(); await pending;
  assert.equal(ui.button.disabled, false);
  assert.equal(ui.message.textContent, '');
});

test('canceling the native sheet does not unexpectedly copy a link', async () => {
  const ui = surface();
  let copies = 0;
  initializeGuideSharing({ doc: ui.doc, nav: { share: async () => { throw { name: 'AbortError' }; }, clipboard: { writeText: async () => { copies++; } } } });
  await ui.button.listeners[0]();
  assert.equal(copies, 0);
  assert.equal(ui.input.hidden, true);
  assert.equal(ui.button.disabled, false);
});

test('unsupported native sharing copies the URL, while clipboard failures expose a selectable link', async () => {
  for (const blocked of [false, true]) {
    const ui = surface();
    let copied;
    initializeGuideSharing({ doc: ui.doc, nav: { canShare: () => false, share: async () => { throw Error('should not open'); }, clipboard: { writeText: async value => { if (blocked) throw Error('private system details'); copied = value; } } } });
    await ui.button.listeners[0]();
    if (blocked) {
      assert.equal(ui.input.value, url);
      assert.equal(ui.input.hidden, false);
      assert.equal(ui.input.readOnly, true);
      assert.equal(ui.input.selected, true);
      assert.equal(ui.message.textContent, 'Copy this link');
    } else {
      assert.equal(copied, url);
      assert.equal(ui.message.textContent, 'Link copied');
      assert.equal(ui.input.hidden, true);
    }
    assert.equal(ui.button.disabled, false);
  }
});

test('sharing never enables external, credentialed, script, tracking or non-article canonicals', () => {
  for (const canonical of ['javascript:alert(1)', 'https://evil.example/guides/a/', 'https://sanfranciscomatcha.com.evil.example/guides/a/', 'https://reader@sanfranciscomatcha.com/guides/a/', url + '?email=private', url + '#private', 'https://sanfranciscomatcha.com/guides/']) {
    const ui = surface(canonical);
    assert.deepEqual(initializeGuideSharing({ doc: ui.doc, nav: {} }), []);
    assert.equal(ui.button.hidden, true);
    assert.equal(ui.button.listeners.length, 0);
  }
});
