import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { transformSync } from "esbuild";

const guides = JSON.parse(readFileSync(new URL("../content/guides.json", import.meta.url), "utf8"));
const source = readFileSync(new URL("../lib/guide-discovery.jsx", import.meta.url), "utf8");
const context = { module: { exports: {} }, React: { createElement(type, props, ...children) { return { type, props: props ?? {}, children: children.flat(Infinity).filter(child => child !== null && child !== undefined && typeof child !== "boolean") }; } } };
vm.runInNewContext(transformSync(source, { loader: "jsx", format: "cjs" }).code, context);
const render = records => context.module.exports.GuideDiscovery({ guides: records });
const nodes = element => typeof element === "object" ? [element, ...element.children.flatMap(nodes)] : [];
const text = element => typeof element === "object" ? element.children.map(text).join("") : String(element);

test("homepage guide links point directly to three existing articles with a separate hub link", () => {
  const tree = render(guides);
  assert.equal(tree.type, "nav");
  assert.equal(tree.props["aria-label"], "Matcha guides");
  const links = nodes(tree).filter(node => node.type === "a");
  assert.deepEqual(links.map(link => link.props.href), ["/guides/", "/guides/banana-matcha-san-francisco/", "/guides/matcha-cold-foam-san-francisco/", "/guides/soy-milk-matcha-san-francisco/"]);
  assert.equal(text(links[0]), `${guides.length} matcha guides →`);
  for (const link of links) assert.equal(nodes(link).filter(node => node.type === "a").length, 1, "Links must not be nested");
  for (const link of links.slice(1)) {
    assert.match(link.props["aria-label"], /guide$/);
    assert.ok(guides.some(guide => link.props.href === `/guides/${guide.slug}/`));
  }
});

test("removed guides are not advertised and the guide count follows its current catalog", () => {
  const records = guides.filter(guide => guide.slug !== "banana-matcha-san-francisco");
  const links = nodes(render(records)).filter(node => node.type === "a");
  assert.equal(links.length, 3);
  assert.equal(text(links[0]), `${records.length} matcha guides →`);
  assert.equal(links.some(link => link.props.href.includes("banana")), false);
  const empty = nodes(render([])).filter(node => node.type === "a");
  assert.equal(empty.length, 1);
  assert.equal(text(empty[0]), "0 matcha guides →");
});

test("guide discovery retains wrapping, touch targets and a visible keyboard focus style", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /\.guide-discovery-row\s*\{[^}]*flex-wrap:wrap/);
  assert.match(html, /\.guide-discovery-topics\s*\{[^}]*flex-wrap:wrap/);
  assert.match(html, /\.guide-discovery a\s*\{[^}]*min-height:44px/);
  assert.match(html, /\.guide-discovery a:focus-visible\s*\{[^}]*outline:3px/);
  assert.doesNotMatch(source, /Find a drink|Explore a neighborhood/);
});
