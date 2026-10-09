import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pipeline = JSON.parse(await readFile(new URL('../content/partner-pipeline.json', import.meta.url), 'utf8'));
const data = await readFile(new URL('../data.jsx', import.meta.url), 'utf8');
const shops = Function(`${data.replace('window.SHOPS =', 'return ').replace(/;\s*$/, '')}`)();

const allowedStages = new Set(['candidate', 'researched', 'ready_for_outreach', 'contacted', 'interested', 'negotiating', 'confirmed', 'paused', 'declined']);

test('partner pipeline uses the complete stage model and unique directory locations', () => {
  assert.equal(pipeline.schemaVersion, 1);
  assert.deepEqual(new Set(pipeline.stages), allowedStages);
  assert.equal(pipeline.prospects.length, 2);
  assert.equal(new Set(pipeline.prospects.map(p => p.id)).size, pipeline.prospects.length);
  assert.equal(new Set(pipeline.prospects.map(p => p.shopId)).size, pipeline.prospects.length);
  const shopIds = new Set(shops.map(shop => shop.id));
  for (const prospect of pipeline.prospects) {
    assert.ok(shopIds.has(prospect.shopId), prospect.shopId);
    assert.ok(allowedStages.has(prospect.stage), prospect.stage);
  }
});

test('research-ready prospects have public evidence, unsent drafts and safe proposed terms', () => {
  for (const prospect of pipeline.prospects) {
    assert.equal(prospect.stage, 'ready_for_outreach');
    assert.equal(prospect.contactStatus, 'not_contacted');
    assert.equal(prospect.independent, true);
    assert.match(prospect.publicContact.source, /^https:\/\//);
    assert.ok(prospect.evidence.length >= 3);
    assert.ok(prospect.evidence.every(url => /^https:\/\//.test(url)));
    assert.match(prospect.outreachDraft, /Nothing would be published until/);
    assert.equal(prospect.proposedTerms.discountCents, 100);
    assert.equal(prospect.proposedTerms.redemptionCap, 100);
    assert.equal(prospect.proposedTerms.perCustomerLimit, 1);
    assert.equal(prospect.proposedTerms.merchantMaximumDiscountCostUsd, 100);
    assert.equal(prospect.proposedTerms.needsMerchantConfirmation, true);
  }
});

test('no-duplicates ledger covers every prospect and preserves standing exclusions', () => {
  const canonical = pipeline.noDuplicates.map(item => item.canonicalId);
  assert.equal(new Set(canonical).size, canonical.length);
  assert.deepEqual(new Set(canonical), new Set(pipeline.prospects.map(p => p.id)));
  assert.ok(pipeline.noDuplicates.every(item => item.aliases.length >= 3));
  assert.deepEqual(new Set(pipeline.doNotAdd), new Set(['Little Sweet', 'Avotoasty', 'Haraz Coffee House']));
});

test('pipeline cannot imply a live or confirmed café offer', () => {
  assert.equal(pipeline.rules.outreachRequiresExplicitApproval, true);
  assert.equal(pipeline.rules.publicationRequiresMerchantConfirmation, true);
  assert.ok(pipeline.prospects.every(p => !['contacted', 'interested', 'negotiating', 'confirmed'].includes(p.stage)));
  assert.doesNotMatch(JSON.stringify(pipeline), /merchantConfirmedAt|confirmationRef|claimPath/);
});
