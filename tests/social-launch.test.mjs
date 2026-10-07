import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const guides = JSON.parse(await readFile(new URL('../content/guides.json', import.meta.url), 'utf8'));
const launch = JSON.parse(await readFile(new URL('../content/social-launch.json', import.meta.url), 'utf8'));
const expectedTypes = ['carousel', 'instagram-caption', 'short-post', 'video-script'];

test('social launch counts only 24 complete drafts, with four formats per guide', () => {
  assert.equal(launch.status, 'draft');
  assert.equal(launch.assetCount, 24);
  assert.equal(launch.assets.length, 24);
  assert.equal(new Set(launch.assets.map(a => a.id)).size, 24);
  for (const guide of guides) {
    const assets = launch.assets.filter(a => a.guideSlug === guide.slug);
    assert.equal(assets.length, 4);
    assert.deepEqual(assets.map(a => a.type).sort(), [...expectedTypes].sort());
  }
});

test('every social draft links its real guide and uses that guide’s evidence', () => {
  for (const asset of launch.assets) {
    const guide = guides.find(g => g.slug === asset.guideSlug);
    assert.ok(guide, asset.id);
    assert.equal(asset.guideUrl, `https://sanfranciscomatcha.com/guides/${guide.slug}/`);
    assert.equal(asset.status, 'draft');
    assert.equal(asset.verifiedAt, guide.updatedAt);
    const validSources = new Set(guide.entries.flatMap(e => e.sources.map(s => s.url)));
    assert.ok(asset.sources.length > 0);
    for (const source of asset.sources) assert.ok(validSources.has(source), `${asset.id}: ${source}`);
  }
});

test('short posts fit 280 characters including their guide URL', () => {
  for (const asset of launch.assets.filter(a => a.type === 'short-post')) {
    assert.ok(asset.text.length <= 280, `${asset.id}: ${asset.text.length}`);
    assert.ok(asset.text.includes(asset.guideUrl));
  }
});

test('carousel and video drafts contain actual copy with evidence instructions', () => {
  for (const asset of launch.assets) {
    if (asset.type === 'carousel') {
      assert.equal(asset.slides.length, 5);
      for (const [i, slide] of asset.slides.entries()) {
        assert.equal(slide.number, i + 1);
        assert.ok(slide.headline.trim().length > 0);
        assert.ok(slide.body.trim().length > 0);
      }
      assert.ok(asset.callToAction.includes(asset.guideUrl));
    }
    if (asset.type === 'video-script') {
      assert.ok(asset.voiceover.trim().split(/\s+/).length >= 50);
      assert.ok(asset.overlayDirection.length > 40);
      assert.ok(asset.endCard.includes(asset.guideUrl));
    }
  }
});

test('drafts preserve the known Kumo dairy caveat and editorial exclusions', () => {
  const all = JSON.stringify(launch);
  assert.doesNotMatch(all, /Little Sweet|Avotoasty|Haraz/i);
  for (const asset of launch.assets.filter(a => a.guideSlug === 'banana-matcha-san-francisco')) {
    const text = JSON.stringify(asset);
    assert.match(text, /Kumo/);
    assert.match(text, /dairy/);
  }
});
