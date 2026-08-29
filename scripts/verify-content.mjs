import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile('dist/content-preview/index.html', 'utf8');
const topicIds = [
  'sft',
  'rlhf',
  'grpo',
  'flashattention',
  'speculative-decoding',
  'multimodal-models',
];
const writingIds = ['why-post-training-exists', 'why-inference-memory-bound'];

for (const id of topicIds) {
  assert.match(
    html,
    new RegExp(`id="topic-${id}"`),
    `topic "${id}" did not render`,
  );
}

for (const id of writingIds) {
  assert.match(
    html,
    new RegExp(`id="writing-${id}"`),
    `article "${id}" did not render`,
  );
}

const targets = new Set(
  [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
);
const fragmentLinks = [...html.matchAll(/href="#([^"]+)"/g)].map(
  (match) => match[1],
);

for (const fragment of fragmentLinks) {
  assert.equal(
    targets.has(fragment),
    true,
    `fragment link "#${fragment}" has no rendered target`,
  );
}

assert.match(html, /class="katex"/, 'sample math did not render');
assert.match(html, /data-language="python"/, 'sample code did not render');
assert.equal(
  (html.match(/<strong>Sample (?:article|content):<\/strong>/g) ?? []).length,
  8,
  'every sample entry must carry a visible placeholder notice',
);

console.log(
  'Six topics and two sample articles render with valid preview links.',
);
