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
assert.match(
  html,
  /class="breadcrumbs"[^>]*aria-label="Breadcrumb"/,
  'the shared breadcrumb component did not render',
);
assert.match(
  html,
  /class="article-summary__metadata"/,
  'the shared article summary did not render',
);
assert.match(
  html,
  /class="topic-label"[^>]*data-topic="markdown-mdx"/,
  'the shared topic label did not render',
);
assert.match(
  html,
  /status-label--active status-label--maturity/,
  'the maturity indicator did not render',
);
assert.match(
  html,
  />Code for this article /,
  'the optional article code link did not render',
);
assert.match(
  html,
  /<h2 id="continue-exploring">Continue exploring<\/h2>/,
  'the shared article navigation did not render',
);

console.log(
  'Rendering fixture contains technical content and the shared article UI.',
);
