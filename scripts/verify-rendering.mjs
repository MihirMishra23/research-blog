import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile('dist/rendering-test/index.html', 'utf8');

assert.match(html, /class="katex"/, 'inline math did not render with KaTeX');
assert.match(
  html,
  /class="katex-display"/,
  'display math did not render with KaTeX',
);
assert.match(
  html,
  /class="[^"]*astro-code[^"]*"[^>]*data-language="python"/,
  'the Python block was not highlighted or labeled',
);
assert.match(
  html,
  /--shiki-light:/,
  'the light Shiki theme variables are missing',
);
assert.match(
  html,
  /--shiki-dark:/,
  'the dark Shiki theme variables are missing',
);
assert.doesNotMatch(
  html,
  /class="code-block__copy"/,
  'the copy button should only be added through progressive enhancement',
);
assert.match(html, />4 tokens inspected</, 'the MDX expression did not render');

console.log(
  'Rendering fixture contains static math, dual-theme code, and MDX.',
);
