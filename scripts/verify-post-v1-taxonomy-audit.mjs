import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [inventorySource, audit, plan] = await Promise.all([
  readFile('docs/post-v1-canonical-taxonomy.json', 'utf8'),
  readFile('docs/post-v1-taxonomy-audit.md', 'utf8'),
  readFile('POST_V1_MAP_ACTION_ITEMS.md', 'utf8'),
]);
const inventory = JSON.parse(inventorySource);
const candidateById = new Map(
  inventory.candidates.map((candidate) => [candidate.id, candidate]),
);

const areaCounts = new Map(inventory.areas.map((area) => [area.id, 0]));
const maturityCounts = new Map();
const neighbors = new Map(
  inventory.candidates.map((candidate) => [candidate.id, new Set()]),
);
const edges = new Set();

function connect(first, second) {
  assert.equal(candidateById.has(first), true, `missing topic ${first}`);
  assert.equal(candidateById.has(second), true, `missing topic ${second}`);
  const pair = [first, second].sort();
  edges.add(`${pair[0]}:${pair[1]}`);
  neighbors.get(first).add(second);
  neighbors.get(second).add(first);
}

for (const candidate of inventory.candidates) {
  areaCounts.set(candidate.category, areaCounts.get(candidate.category) + 1);
  maturityCounts.set(
    candidate.status,
    (maturityCounts.get(candidate.status) ?? 0) + 1,
  );

  if (candidate.parent) connect(candidate.id, candidate.parent);
  for (const field of ['prerequisites', 'cameBefore', 'leadsTo', 'related']) {
    for (const target of candidate[field]) connect(candidate.id, target);
  }

  assert.match(audit, new RegExp('`' + candidate.id + '`'));
}

assert.deepEqual(Object.fromEntries(areaCounts), {
  models: 3,
  'post-training': 5,
  inference: 4,
  multimodal: 3,
  memory: 1,
  agents: 1,
  interpretability: 3,
});
assert.deepEqual(Object.fromEntries(maturityCounts), {
  frontier: 7,
  established: 6,
  active: 7,
});
assert.equal(edges.size, 15, 'audit edge count drifted');
assert.deepEqual(
  [...neighbors]
    .filter(([, topicNeighbors]) => topicNeighbors.size === 0)
    .map(([id]) => id),
  [],
  'taxonomy contains a relationship orphan',
);

const degrees = [...neighbors].map(([id, topicNeighbors]) => ({
  id,
  degree: topicNeighbors.size,
}));
const maximumDegree = Math.max(...degrees.map((entry) => entry.degree));
assert.equal(maximumDegree, 4);
assert.deepEqual(
  degrees.filter((entry) => entry.degree === maximumDegree),
  [{ id: 'grpo', degree: 4 }],
);

assert.equal(
  neighbors.get('flashattention').has('speculative-decoding'),
  false,
  'weak FlashAttention–Speculative Decoding edge returned',
);
assert.equal(neighbors.get('flashattention').has('delta-attention'), true);
assert.equal(neighbors.get('limited-memory-language-models').has('mem0'), true);

for (const id of ['grouped-query-attention', 'clip', 'rome']) {
  const source = await readFile(`src/content/topics/${id}.md`, 'utf8');
  assert.match(source, /^status: established$/m);
  assert.match(source, /^draft: true$/m);
}

for (const area of inventory.areas) {
  assert.match(audit, new RegExp(`### ${area.label} — \\d+`));
}
assert.doesNotMatch(audit, /<(?:script|svg)\b/i);
assert.match(audit, /## Category-balance audit/);
assert.match(audit, /## Graph-health audit/);
assert.match(audit, /## Maturity audit/);
assert.match(audit, /## Boundaries requiring continued attention/);
assert.match(audit, /Status: \*\*approved by Mihir on 2026-08-31\*\*/);

const action14 = plan.match(
  /### 1\.4 Validate the taxonomy as a whole[\s\S]+?(?=## 2\.)/,
)?.[0];
assert.ok(action14, 'Action Item 1.4 section is missing');
assert.doesNotMatch(action14, /^\s*- \[ \]/gm);
assert.match(action14, /Mihir approved/);

console.log(
  `Taxonomy audit validates ${inventory.candidates.length} topics, ${inventory.areas.length} areas, ${edges.size} intentional edges, no orphans, and one reviewed four-neighbor hub.`,
);
