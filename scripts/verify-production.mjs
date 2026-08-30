import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const distRoot = path.resolve('dist');
const deploymentBase = '/research-blog';
const productionOrigin = 'https://mihirmishra23.github.io';
const siteOrigin = `${productionOrigin}${deploymentBase}`;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(target) : [target];
    }),
  );

  return files.flat();
}

const allFiles = await walk(distRoot);
const relativeFiles = new Set(
  allFiles.map((file) =>
    path.relative(distRoot, file).split(path.sep).join('/'),
  ),
);
const htmlFiles = [...relativeFiles].filter((file) => file.endsWith('.html'));
const htmlByFile = new Map(
  await Promise.all(
    htmlFiles.map(async (file) => [
      file,
      await readFile(path.join(distRoot, file), 'utf8'),
    ]),
  ),
);

function pageUrlFor(file) {
  const suffix = file === 'index.html' ? '/' : `/${file}`;
  return `${siteOrigin}${suffix.replace(/index\.html$/, '')}`;
}

function outputFileFor(pathname) {
  const withoutBase = pathname.slice(deploymentBase.length).replace(/^\//, '');
  if (!withoutBase) return 'index.html';
  if (withoutBase.endsWith('/')) return `${withoutBase}index.html`;
  return withoutBase;
}

const brokenReferences = [];
let checkedReferences = 0;

for (const [sourceFile, html] of htmlByFile) {
  const references = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(
    (match) => match[1],
  );

  for (const reference of references) {
    if (
      /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference) ||
      reference.startsWith('#')
    ) {
      if (!reference.startsWith('#')) continue;
    }

    const resolved = new URL(reference, pageUrlFor(sourceFile));
    if (resolved.origin !== productionOrigin) continue;

    checkedReferences += 1;

    if (!resolved.pathname.startsWith(`${deploymentBase}/`)) {
      brokenReferences.push(
        `${sourceFile}: escaped deployment base with ${reference}`,
      );
      continue;
    }

    const outputFile = outputFileFor(resolved.pathname);
    if (!relativeFiles.has(outputFile)) {
      brokenReferences.push(
        `${sourceFile}: missing ${reference} -> ${outputFile}`,
      );
      continue;
    }

    if (resolved.hash && outputFile.endsWith('.html')) {
      const targetHtml = htmlByFile.get(outputFile);
      const fragment = decodeURIComponent(resolved.hash.slice(1));
      const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!new RegExp(`\\bid="${escaped}"`).test(targetHtml ?? '')) {
        brokenReferences.push(
          `${sourceFile}: missing fragment ${resolved.hash} in ${outputFile}`,
        );
      }
    }
  }

  assert.doesNotMatch(
    html,
    />\s*(?:undefined|null)\s*</,
    `${sourceFile} exposes an unset value`,
  );
}

assert.deepEqual(
  brokenReferences,
  [],
  `broken internal references:\n${brokenReferences.join('\n')}`,
);
assert.ok(checkedReferences > 250, 'expected a meaningful internal-link audit');

const cssFiles = [...relativeFiles].filter((file) => file.endsWith('.css'));
const brokenCssAssets = [];
for (const cssFile of cssFiles) {
  const css = await readFile(path.join(distRoot, cssFile), 'utf8');
  for (const match of css.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/g)) {
    const reference = match[2];
    if (/^(?:data:|https?:|\/\/)/i.test(reference)) continue;

    const outputFile = reference.startsWith(`${deploymentBase}/`)
      ? reference.slice(deploymentBase.length + 1)
      : path.posix.normalize(
          path.posix.join(path.posix.dirname(cssFile), reference),
        );
    if (!relativeFiles.has(outputFile)) {
      brokenCssAssets.push(`${cssFile}: missing ${reference}`);
    }
  }
}
assert.deepEqual(brokenCssAssets, []);

const [homepage, writingIndex, searchPage, sourceCss] = await Promise.all([
  readFile('dist/index.html', 'utf8'),
  readFile('dist/writing/index.html', 'utf8'),
  readFile('dist/search/index.html', 'utf8'),
  readFile('src/styles/global.css', 'utf8'),
]);

assert.match(homepage, /Semantic map \/ text view/);
assert.match(homepage, /class="llm-map__fallback"/);
assert.equal(
  (writingIndex.match(/<article\b[^>]*\bdata-writing-entry\b/g) ?? []).length,
  2,
  'the no-JavaScript writing archive must retain every published entry',
);
assert.match(searchPage, /<noscript>/);
assert.match(searchPage, /All writing and topics remain available/);
assert.doesNotMatch(homepage, /pagefind\/pagefind-ui\.js/);
assert.match(searchPage, /pagefind\/pagefind-ui\.js/);

assert.match(sourceCss, /@media \(max-width: 47rem\)/);
assert.match(sourceCss, /@media \(max-width: 25rem\)/);
assert.match(sourceCss, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(sourceCss, /:focus-visible/);

function variablesFor(block) {
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6})/gi)].map((match) => [
      match[1],
      match[2],
    ]),
  );
}

function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4),
    );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

const lightBlock = sourceCss.match(/:root\s*{([\s\S]*?)\n}/)?.[1] ?? '';
const darkBlock =
  sourceCss.match(/:root\[data-theme='dark'\]\s*{([\s\S]*?)\n}/)?.[1] ?? '';
const palettes = {
  light: variablesFor(lightBlock),
  dark: variablesFor(darkBlock),
};

for (const [name, palette] of Object.entries(palettes)) {
  for (const foreground of ['ink', 'ink-soft', 'accent', 'focus']) {
    const ratio = contrast(
      palette[`color-${foreground}`],
      palette['color-paper'],
    );
    assert.ok(
      ratio >= 4.5,
      `${name} ${foreground} contrast is ${ratio.toFixed(2)}:1`,
    );
  }
}

const generatedJavaScript = await Promise.all(
  [...relativeFiles]
    .filter((file) => file.endsWith('.js') && !file.startsWith('pagefind/'))
    .map(async (file) => ({
      file,
      bytes: (await stat(path.join(distRoot, file))).size,
    })),
);
const generatedJavaScriptBytes = generatedJavaScript.reduce(
  (total, file) => total + file.bytes,
  0,
);
assert.ok(
  generatedJavaScriptBytes < 25_000,
  `non-search JavaScript grew to ${generatedJavaScriptBytes} bytes`,
);

console.log(
  `Production QA checked ${htmlFiles.length} HTML files, ${checkedReferences} internal references, ${cssFiles.length} stylesheets, two no-JS fallbacks, both palettes, and ${generatedJavaScriptBytes} bytes of non-search JavaScript.`,
);
