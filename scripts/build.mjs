import { build } from "esbuild";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entries = ["tweaks-panel", "data", "map", "app"];
const dist = path.join(root, "dist");
await mkdir(dist, { recursive: true });

// Keep the stable bundles for the directory scout and customer-copy audit.
for (const name of entries) {
  await build({
    absWorkingDir: root,
    entryPoints: [`${name}.jsx`],
    outfile: `dist/${name}.js`,
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2020",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    charset: "utf8",
    logLevel: "warning",
  });
}

// Content-addressed URLs bypass already-cached stable bundle URLs.
for (const filename of await readdir(dist)) {
  if (/^(app|data|map|tweaks-panel)\.[a-f0-9]{12}\.js$/.test(filename)) {
    await unlink(path.join(dist, filename));
  }
}
let html = await readFile(path.join(root, "index.html"), "utf8");
for (const name of entries) {
  const contents = await readFile(path.join(dist, `${name}.js`));
  const hash = createHash("sha256").update(contents).digest("hex").slice(0, 12);
  const filename = `${name}.${hash}.js`;
  await writeFile(path.join(dist, filename), contents);
  const pattern = new RegExp(`(<script\\s+src=")[./]*dist/${name}(?:\\.[a-f0-9]{12})?\\.js(?:\\?[^" ]*)?("[^>]*></script>)`, "g");
  let replacements = 0;
  html = html.replace(pattern, (_match, start, end) => {
    replacements++;
    return `${start}dist/${filename}${end}`;
  });
  if (replacements !== 1) throw new Error(`Expected one script tag for ${name}; found ${replacements}`);
}
await writeFile(path.join(root, "index.html"), html);
console.log("Built four source bundles and four versioned browser assets.");
