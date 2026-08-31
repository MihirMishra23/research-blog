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

assert.doesNotMatch(scope, /target concept count/i);
assert.doesNotMatch(scope, /concept budget/i);
assert.doesNotMatch(scope, /hard target/i);
assert.doesNotMatch(scope, /exactly 19/i);
assert.doesNotMatch(scope, /\*\*Total\*\*/);
assert.match(scope, /\*\*No-cap rule:\*\*/);
assert.match(scope, /\*\*Source-of-truth rule:\*\*/);
assert.match(scope, /\*\*Dynamic-layout rule:\*\*/);
assert.match(scope, /Training, Evaluation, and Safety are deferred/);
assert.match(scope, /## Inclusion criteria/);
assert.match(scope, /## Exclusion criteria/);

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
  'Post-V1 taxonomy scope selects seven schema-backed areas and an open-ended, production-derived node set with no numeric cap.',
);
