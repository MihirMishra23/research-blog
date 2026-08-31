import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [scope, plan, schemas] = await Promise.all([
  readFile('docs/post-v1-taxonomy-scope.md', 'utf8'),
  readFile('POST_V1_MAP_ACTION_ITEMS.md', 'utf8'),
  readFile('src/content/schemas.ts', 'utf8'),
]);

const selectedCategories = [
  'models',
  'post-training',
  'inference',
  'multimodal',
  'memory',
  'agents',
  'interpretability',
];

for (const category of selectedCategories) {
  assert.match(
    scope,
    new RegExp('\\\\|\\\\s+`' + category + '`\\\\s+\\\\|'),
    `scope table is missing ${category}`,
  );
  assert.match(
    schemas,
    new RegExp(`'${category}'`),
    `${category} is missing from TOPIC_CATEGORIES`,
  );
}

for (const removedCategory of ['training', 'inference-systems', 'retrieval']) {
  assert.doesNotMatch(
    schemas,
    new RegExp(`'${removedCategory}'`),
    `${removedCategory} should not remain in TOPIC_CATEGORIES`,
  );
}

const countMatches = [
  ...scope.matchAll(/^\| [^|]+ \| `[^`]+`\s+\|\s+(\d+) \|/gm),
];
const totalCount = countMatches.reduce(
  (total, match) => total + Number(match[1]),
  0,
);

assert.equal(countMatches.length, 7, 'expected seven selected areas');
assert.equal(totalCount, 19, 'area counts must total 19 concepts');
assert.match(scope, /\*\*13 additions\*\*/);
assert.match(scope, /Training, Evaluation, and Safety are deferred/);
assert.match(scope, /## Inclusion criteria/);
assert.match(scope, /## Exclusion criteria/);
assert.match(scope, /\*\*Hard target:\*\* 19 production concepts/);

for (const candidate of [
  'Delta Attention',
  'Grouped-Query Attention',
  'Multi-head Latent Attention',
  'Group Sequence Policy Optimization',
  'DAPO',
  'DFlash',
  'Multi-Token Prediction',
  'Omni-family models',
  'Limited Memory Language Models',
  'Mem0',
  'Sparse Autoencoders',
  'ROME',
  'Circuit Tracing',
]) {
  assert.match(scope, new RegExp(candidate), `scope is missing ${candidate}`);
}

assert.equal(
  (plan.match(/^- \[x\]/gm) ?? []).length >= 5,
  true,
  'Action Item 1.1 must remain complete',
);
assert.match(plan, /docs\/post-v1-taxonomy-scope\.md/);

console.log(
  'Post-V1 taxonomy scope selects seven schema-backed areas totaling 19 concepts with explicit entry and stopping rules.',
);
