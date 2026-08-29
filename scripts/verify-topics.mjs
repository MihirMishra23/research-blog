import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const topicIds = [
  'sft',
  'rlhf',
  'grpo',
  'flashattention',
  'speculative-decoding',
  'multimodal-models',
];
const index = await readFile('dist/topics/index.html', 'utf8');

for (const id of topicIds) {
  assert.match(
    index,
    new RegExp(`href="/research-blog/topics/${id}/"`),
    `topic index does not link to "${id}"`,
  );
}

assert.equal(
  (index.match(/class="topic-index-item"/g) ?? []).length,
  topicIds.length,
  'topic index should contain all six visible topics',
);
assert.match(
  index,
  /id="category-post-training"/,
  'post-training group missing',
);
assert.match(
  index,
  /id="category-inference-systems"/,
  'inference systems group missing',
);
assert.match(index, /id="category-multimodal"/, 'multimodal group missing');
assert.match(
  index,
  /href="\/research-blog\/topics\/" aria-current="page"/,
  'topic index does not mark Topics as the current primary section',
);

for (const id of topicIds) {
  const html = await readFile(`dist/topics/${id}/index.html`, 'utf8');

  assert.match(html, /class="breadcrumbs"/, `${id} breadcrumbs are missing`);
  assert.match(
    html,
    /class="topic-framework"/,
    `${id} conceptual framework is missing`,
  );
  for (const step of [
    'Problem',
    'Idea · how it works',
    'Consequence',
    'Limitations',
    'What came next',
  ]) {
    assert.match(html, new RegExp(`>${step}<`), `${id} omits ${step}`);
  }
  assert.match(
    html,
    /class="topic-explanation"/,
    `${id} explanation body is missing`,
  );
  assert.match(
    html,
    /Where is the frontier\?/,
    `${id} frontier questions are missing`,
  );
  assert.match(html, /Important papers/, `${id} paper links are missing`);
  assert.match(
    html,
    /href="\/research-blog\/topics\/" aria-current="page"/,
    `${id} does not mark Topics as the current primary section`,
  );
  assert.doesNotMatch(
    html,
    />\s*(?:undefined|null)\s*</,
    `${id} exposes missing optional metadata`,
  );
}

const sft = await readFile('dist/topics/sft/index.html', 'utf8');
assert.match(
  sft,
  /href="\/research-blog\/topics\/rlhf\/"/,
  'SFT does not link to its next concept, RLHF',
);
assert.match(
  sft,
  /href="\/research-blog\/writing\/why-post-training-exists\/"/,
  'SFT does not list its associated article',
);

const flashAttention = await readFile(
  'dist/topics/flashattention/index.html',
  'utf8',
);
assert.match(
  flashAttention,
  /href="\/research-blog\/writing\/why-inference-memory-bound\/"/,
  'FlashAttention does not list its associated article',
);

console.log('Grouped topic index and six permanent topic routes are valid.');
