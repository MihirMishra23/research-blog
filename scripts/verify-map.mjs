import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const html = await readFile('dist/map-preview/index.html', 'utf8');
const homepage = await readFile('dist/index.html', 'utf8');
const assetFiles = await readdir('dist/_astro');
const css = (
  await Promise.all(
    assetFiles
      .filter((file) => file.endsWith('.css'))
      .map((file) => readFile(`dist/_astro/${file}`, 'utf8')),
  )
).join('\n');
const topicIds = [
  'sft',
  'rlhf',
  'grpo',
  'flashattention',
  'speculative-decoding',
  'multimodal-models',
];

assert.equal(
  (html.match(/data-map-node="[^"]+"/g) ?? []).length,
  10,
  'map should render one root, three areas, and six topic nodes',
);
assert.equal(
  (html.match(/data-node-kind="topic"/g) ?? []).length,
  6,
  'map should render all six topic nodes',
);
assert.equal(
  (html.match(/data-map-edge="[^"]+"/g) ?? []).length,
  14,
  'map should render every V1 edge',
);

for (const id of topicIds) {
  assert.match(
    html,
    new RegExp(`href="/research-blog/topics/${id}/"[^>]*data-map-node="${id}"`),
    `interactive node "${id}" is not a permanent topic link`,
  );
  assert.match(
    html,
    new RegExp(
      `class="llm-map__fallback[\\s\\S]*href="/research-blog/topics/${id}/"`,
    ),
    `semantic fallback omits "${id}"`,
  );
}

assert.match(html, /role="img"/, 'SVG does not expose an image role');
assert.match(html, /<title id="llm-map-svg-title"/, 'SVG title is missing');
assert.match(
  html,
  /<desc id="llm-map-svg-description"/,
  'SVG description is missing',
);
assert.match(html, /id="llm-map-dot-grid"/, 'dotted-paper pattern is missing');
assert.equal(
  (html.match(/class="llm-map__oval"/g) ?? []).length,
  4,
  'root and major areas should render as irregular ovals',
);
assert.match(
  html,
  /llm-map__progress-marks/,
  'red progression marks are missing',
);
assert.match(
  html,
  /llm-map__frontier-mark/,
  'active/frontier marks are missing',
);
assert.match(
  html,
  /aria-controls="llm-map-detail"/,
  'node panel controls are missing',
);
assert.match(html, /data-map-reset/, 'return-to-overview action is missing');
assert.match(html, /data-map-detail-maturity/, 'maturity detail is missing');
assert.match(
  html,
  /data-map-prerequisite-list/,
  'prerequisite detail is missing',
);
assert.match(html, /data-map-related-list/, 'relationship detail is missing');
assert.match(
  html,
  /Semantic map \/ text view/,
  'semantic non-graph fallback is missing',
);
assert.match(
  css,
  /shantell-sans-latin-wght-normal[^)]*\.woff2/,
  'locally bundled handwritten font is missing',
);
assert.doesNotMatch(
  `${html}\n${css}`,
  /fonts\.(?:googleapis|gstatic)\.com/,
  'map font must not depend on a remote font service',
);
assert.match(
  homepage,
  /href="\/research-blog\/map-preview\/"/,
  'homepage does not link to the map preview',
);

console.log(
  'Interactive SVG map, detail controls, and semantic fallback are present.',
);
