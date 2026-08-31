import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [scope, plan, schemas] = await Promise.all([
  readFile('docs/post-v1-taxonomy-scope.md', 'utf8'),
  readFile('POST_V1_MAP_ACTION_ITEMS.md', 'utf8'),
  readFile('src/content/schemas.ts', 'utf8'),
]);

const selectedCategories = [
  'training',
  'models',
  'post-training',
  'inference-systems',
  'multimodal',
  'retrieval',
  'agents',
  'evaluation',
  'safety',
];

for (const category of selectedCategories) {
  assert.match(
    scope,
    new RegExp(`\\|\\s+\`${category}\`\\s+\\|`),
    `scope table is missing ${category}`,
  );
  assert.match(
    schemas,
    new RegExp(`'${category}'`),
    `${category} is missing from TOPIC_CATEGORIES`,
  );
}

const budgetMatches = [
  ...scope.matchAll(/^\| [^|]+ \| `[^`]+`\s+\|\s+(\d+) \|/gm),
];
const totalBudget = budgetMatches.reduce(
  (total, match) => total + Number(match[1]),
  0,
);

assert.equal(budgetMatches.length, 9, 'expected nine selected areas');
assert.equal(totalBudget, 36, 'area budgets must total 36 concepts');
assert.match(scope, /\*\*30 additions\*\*/);
assert.match(
  scope,
  /`interpretability` remains a valid reserved schema category/,
);
assert.match(scope, /## Inclusion criteria/);
assert.match(scope, /## Exclusion criteria/);
assert.match(scope, /\*\*Hard target:\*\* 36 production concepts/);
assert.equal(
  (plan.match(/^- \[x\]/gm) ?? []).length >= 5,
  true,
  'Action Item 1.1 must remain complete',
);
assert.match(plan, /docs\/post-v1-taxonomy-scope\.md/);

console.log(
  'Post-V1 taxonomy scope selects nine schema-backed areas totaling 36 concepts with explicit entry and stopping rules.',
);
