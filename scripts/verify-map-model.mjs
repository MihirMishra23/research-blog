import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const model = JSON.parse(await readFile('dist/map-data.json', 'utf8'));
const topicIds = [
  'sft',
  'rlhf',
  'grpo',
  'flashattention',
  'speculative-decoding',
  'multimodal-models',
];
const topicNodes = model.nodes.filter((node) => node.kind === 'topic');
const nodeIds = new Set(model.nodes.map((node) => node.id));

assert.equal(model.version, 'v1');
assert.deepEqual(model.extensions, {});
assert.equal(topicNodes.length, topicIds.length);
assert.equal(nodeIds.size, model.nodes.length, 'map node IDs must be unique');
assert.equal(model.nodes.filter((node) => node.kind === 'root').length, 1);
assert.equal(model.nodes.filter((node) => node.kind === 'area').length, 3);

for (const id of topicIds) {
  const node = topicNodes.find((candidate) => candidate.id === id);
  assert.ok(node, `map topic "${id}" is missing`);
  assert.equal(node.slug, id);
  assert.equal(node.href, `/topics/${id}/`);
  assert.equal(typeof node.label, 'string');
  assert.equal(typeof node.description, 'string');
  assert.equal(typeof node.category, 'string');
  assert.equal(typeof node.maturity, 'string');
  assert.equal(Array.isArray(node.prerequisites), true);
  assert.equal(Array.isArray(node.relationships.related), true);
  assert.equal(Number.isFinite(node.position.x), true);
  assert.equal(Number.isFinite(node.position.y), true);
  await access(`dist/topics/${node.slug}/index.html`);
}

for (const edge of model.edges) {
  assert.equal(nodeIds.has(edge.source), true, `${edge.id} has missing source`);
  assert.equal(nodeIds.has(edge.target), true, `${edge.id} has missing target`);
}

for (const edgeId of [
  'progression:sft:rlhf',
  'progression:sft:grpo',
  'related:grpo:rlhf',
  'related:flashattention:speculative-decoding',
  'related:flashattention:multimodal-models',
]) {
  assert.equal(
    model.edges.some((edge) => edge.id === edgeId),
    true,
    `expected map edge "${edgeId}" is missing`,
  );
}

const crossCategory = model.edges.find(
  (edge) => edge.id === 'related:flashattention:multimodal-models',
);
assert.ok(crossCategory, 'cross-category exploration edge is missing');

console.log(
  'Typed V1 map data contains six resolvable topics and valid renderer-neutral edges.',
);
