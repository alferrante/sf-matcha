import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../content/perks.html', import.meta.url), 'utf8');
const [offerScript, plannerScript] = [...source.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);

class Element {
  children = [];
  textContent = '';
  append(...elements) { this.children.push(...elements); }
  replaceChildren(...elements) { this.children = elements; }
}

function confirmedOffer() {
  const now = Date.now();
  return {
    id: 'example-cafe', shopId: 1, merchantName: 'Example café', address: '123 Example St, San Francisco',
    status: 'confirmed', merchantConfirmedAt: new Date(now - 60000).toISOString(), confirmationRef: 'test-approval',
    startsAt: new Date(now - 60000).toISOString(), expiresAt: new Date(now + 3600000).toISOString(),
    discountCents: 100, currency: 'USD', redemptionCap: 100, perCustomerLimit: 1,
    terms: ['$1 off one classic matcha. No add-ons.'], claimPath: '/api/offers/example-cafe/claim',
  };
}

async function renderOffers(offers = [], { fail = false, version = 1 } = {}) {
  const state = new Element();
  const output = new Element();
  const requests = [];
  vm.runInNewContext(offerScript, {
    document: { getElementById: id => id === 'offer-state' ? state : output, createElement: () => new Element() },
    Date, Intl,
    fetch: async (url, options) => {
      requests.push({ url, options });
      if (fail) throw new Error('Network unavailable');
      return { ok: true, json: async () => ({ schemaVersion: version, offers }) };
    },
  });
  await new Promise(resolve => setImmediate(resolve));
  return { state, output, requests };
}

test('empty offers produce no vouchers and availability is fetched without caching', async () => {
  const result = await renderOffers();
  assert.equal(result.output.children.length, 0);
  assert.equal(result.state.children.length, 0); // Preserve the HTML's honest initial no-active-offers state.
  assert.equal(result.requests[0].url, '/offers.json');
  assert.equal(result.requests[0].options.cache, 'no-store');
});

test('confirmed active offer renders the location, terms and first-party claim link', async () => {
  const offer = confirmedOffer();
  const { output } = await renderOffers([offer]);
  assert.equal(output.children.length, 1);
  const card = output.children[0];
  assert.equal(card.children[0].textContent, offer.merchantName);
  assert.equal(card.children[1].textContent, offer.address);
  assert.equal(card.children[2].children[0].textContent, offer.terms[0]);
  assert.equal(card.children.at(-1).href, offer.claimPath);
  assert.match(card.children[3].textContent, /Pacific time/);
});

test('planned, paused, future and expired offers cannot produce a claim link', async () => {
  const offer = confirmedOffer();
  for (const patch of [
    { status: 'planned' }, { paused: true },
    { startsAt: new Date(Date.now() + 60000).toISOString() },
    { expiresAt: new Date(Date.now() - 1).toISOString() },
    { merchantConfirmedAt: new Date(Date.now() + 60000).toISOString() },
  ]) {
    assert.equal((await renderOffers([{ ...offer, ...patch }])).output.children.length, 0);
  }
});

test('invalid money, limits, confirmation, IDs or third-party claim URLs are rejected', async () => {
  const offer = confirmedOffer();
  for (const patch of [
    { discountCents: 200 }, { currency: 'EUR' }, { redemptionCap: 0 }, { perCustomerLimit: 2 },
    { confirmationRef: '' }, { id: undefined }, { claimPath: 'https://untrusted.example/claim' }, { terms: [] },
  ]) {
    assert.equal((await renderOffers([{ ...offer, ...patch }])).output.children.length, 0);
  }
});

test('duplicate offer IDs are suppressed rather than publishing ambiguous claims', async () => {
  const offer = confirmedOffer();
  assert.equal((await renderOffers([offer, offer])).output.children.length, 0);
});

test('network and schema errors show unavailable state without issuing vouchers', async () => {
  for (const options of [{ fail: true }, { version: 999 }]) {
    const { state, output } = await renderOffers([], options);
    assert.equal(output.children.length, 0);
    assert.match(state.children[0].textContent, /unavailable/);
  }
});

function prepareProposal(patch = {}, { downloadWorks = true, nativeValid = true } = {}) {
  const ids = ['pilot-planner', 'planner-status', 'proposal-result', 'proposal-preview', 'proposal-download',
    'cafe-name', 'cafe-address', 'eligible-drinks', 'pilot-start', 'pilot-end', 'pilot-cap', 'pilot-exclusions'];
  const elements = Object.fromEntries(ids.map(id => [id, { value: '', hidden: true }]));
  const handlers = {};
  Object.assign(elements['pilot-planner'], {
    reportValidity: () => nativeValid,
    addEventListener: (event, handler) => { handlers[event] = handler; },
  });
  for (const [id, value] of Object.entries({
    'cafe-name': 'Example Café', 'cafe-address': '123 Example St, San Francisco',
    'eligible-drinks': 'Classic matcha', 'pilot-start': '2026-10-20', 'pilot-end': '2026-11-30',
    'pilot-cap': '100', ...patch,
  })) elements[id].value = value;
  let blob;
  let revocations = 0;
  vm.runInNewContext(plannerScript, {
    document: { getElementById: id => elements[id] }, Date, Intl, Blob,
    URL: {
      createObjectURL: value => {
        if (!downloadWorks) throw new Error('Download unavailable');
        blob = value;
        return 'blob:local-proposal';
      },
      revokeObjectURL: () => { revocations++; },
    },
    fetch: () => { throw new Error('The planner must not submit information'); },
  });
  handlers.submit({ preventDefault() {} });
  return { elements, handlers, get blob() { return blob; }, get revocations() { return revocations; } };
}

test('planner creates a local draft with merchant details, dates and maximum discount cost', async () => {
  const result = prepareProposal();
  const draft = await result.blob.text();
  assert.equal(result.blob.type, 'text/markdown;charset=utf-8');
  assert.equal(result.elements['proposal-result'].hidden, false);
  assert.equal(result.elements['proposal-download'].href, 'blob:local-proposal');
  assert.equal(result.elements['proposal-preview'].value, draft);
  assert.match(draft, /Example Café/);
  assert.match(draft, /2026-10-20 through 2026-11-30/);
  assert.match(draft, /Maximum merchant-funded discount cost: \$100/);
  assert.match(draft, /one successful redemption per café per customer/);
  assert.match(draft, /No café enrollment, offer activation, outreach or merchant confirmation/);
  assert.match(result.elements['planner-status'].textContent, /Nothing was submitted and no offer is active/);
});

test('planner rejects missing details, impossible/reversed dates and unsafe caps', () => {
  for (const patch of [
    { 'cafe-name': ' ' }, { 'cafe-address': '' }, { 'eligible-drinks': ' ' },
    { 'pilot-start': '2026-11-31' }, { 'pilot-end': '2026-09-01' },
    { 'pilot-cap': '101' }, { 'pilot-cap': '2.5' }, { 'pilot-cap': '0' },
  ]) {
    const result = prepareProposal(patch);
    assert.equal(result.elements['proposal-result'].hidden, true);
    assert.equal(result.blob, undefined);
    assert.ok(result.elements['planner-status'].textContent.length > 0);
  }
  assert.equal(prepareProposal({}, { nativeValid: false }).blob, undefined);
});

test('editing a proposal invalidates its download and revokes the old local URL', () => {
  const result = prepareProposal();
  result.handlers.input();
  assert.equal(result.elements['proposal-result'].hidden, true);
  assert.equal(result.elements['planner-status'].textContent, '');
  assert.equal(result.revocations, 1);
});

test('planner keeps a usable copyable draft when downloads are unavailable', () => {
  const result = prepareProposal({}, { downloadWorks: false });
  assert.equal(result.elements['proposal-result'].hidden, false);
  assert.equal(result.elements['proposal-download'].hidden, true);
  assert.match(result.elements['proposal-preview'].value, /Example Café/);
  assert.match(result.elements['planner-status'].textContent, /ready to copy/);
});

test('planner escapes user markup in its Markdown document', async () => {
  const result = prepareProposal({ 'cafe-name': '<script>alert(1)</script> [fake](https://example.com)', 'pilot-cap': '5' });
  const draft = await result.blob.text();
  assert.ok(draft.includes('\\<script\\>'));
  assert.ok(draft.includes('\\[fake\\]'));
  assert.match(draft, /Maximum merchant-funded discount cost: \$5/);
});
