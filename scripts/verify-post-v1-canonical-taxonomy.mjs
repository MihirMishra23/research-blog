import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { findContentReferenceErrors } from '../src/content/references.ts';
import {
  CONCEPT_TYPES,
  MATURITY_STATUSES,
  TOPIC_CATEGORIES,
  slugSchema,
} from '../src/content/schemas.ts';

const [inventorySource, documentation, plan] = await Promise.all([
  readFile('docs/post-v1-canonical-taxonomy.json', 'utf8'),
  readFile('docs/post-v1-canonical-taxonomy.md', 'utf8'),
  readFile('POST_V1_MAP_ACTION_ITEMS.md', 'utf8'),
]);

const inventory = JSON.parse(inventorySource);
const areaIds = new Set(inventory.areas.map((area) => area.id));
const candidateById = new Map(
  inventory.candidates.map((candidate) => [candidate.id, candidate]),
);
const aliasOwnerByKey = new Map();

assert.equal(areaIds.size, inventory.areas.length, 'area IDs must be unique');
assert.equal(
  candidateById.size,
  inventory.candidates.length,
  'candidate IDs must be unique',
);

for (const area of inventory.areas) {
  assert.equal(
    TOPIC_CATEGORIES.includes(area.id),
    true,
    `unsupported area category ${area.id}`,
  );
  assert.equal(area.label.length > 0, true, `${area.id} needs a label`);
  assert.equal(
    area.mapLabel.length > 0 && area.mapLabel.length <= 48,
    true,
    `${area.id} needs a valid map label`,
  );
}

const requiredCandidateIds = [
  'delta-attention',
  'grouped-query-attention',
  'multi-head-latent-attention',
  'sft',
  'rlhf',
  'grpo',
  'gspo',
  'dapo',
  'flashattention',
  'speculative-decoding',
  'dflash',
  'multi-token-prediction',
  'multimodal-models',
  'omni-family-models',
  'limited-memory-language-models',
  'mem0',
  'sparse-autoencoders',
  'rome',
  'circuit-tracing',
];

for (const id of requiredCandidateIds) {
  assert.equal(candidateById.has(id), true, `missing candidate ${id}`);
  assert.match(documentation, new RegExp('`' + id + '`'));
}

for (const candidate of inventory.candidates) {
  assert.equal(slugSchema.safeParse(candidate.id).success, true);
  assert.equal(areaIds.has(candidate.category), true, `${candidate.id} area`);
  assert.equal(
    CONCEPT_TYPES.includes(candidate.type),
    true,
    `${candidate.id} concept type`,
  );
  assert.equal(
    MATURITY_STATUSES.includes(candidate.status),
    true,
    `${candidate.id} maturity`,
  );
  assert.equal(
    candidate.name.length >= 3 && candidate.name.length <= 120,
    true,
    `${candidate.id} name length`,
  );
  assert.equal(
    candidate.mapLabel.length > 0 && candidate.mapLabel.length <= 48,
    true,
    `${candidate.id} map-label length`,
  );
  assert.equal(
    candidate.summary.length >= 10 && candidate.summary.length <= 240,
    true,
    `${candidate.id} summary length`,
  );
  assert.equal(
    ['complete', 'editorial-review'].includes(candidate.sourceReview),
    true,
    `${candidate.id} source review`,
  );
  assert.equal(
    Array.isArray(candidate.sources) && candidate.sources.length > 0,
    true,
    `${candidate.id} needs a primary source`,
  );

  for (const term of [
    candidate.name,
    candidate.mapLabel,
    ...candidate.aliases,
  ]) {
    const key = term.toLowerCase().replaceAll(/[^a-z0-9]/g, '');
    const existingOwner = aliasOwnerByKey.get(key);
    assert.equal(
      existingOwner === undefined || existingOwner === candidate.id,
      true,
      `alias "${term}" collides between ${existingOwner} and ${candidate.id}`,
    );
    aliasOwnerByKey.set(key, candidate.id);
  }

  for (const field of [
    'aliases',
    'prerequisites',
    'cameBefore',
    'leadsTo',
    'related',
  ]) {
    const values = candidate[field];
    assert.equal(Array.isArray(values), true, `${candidate.id}.${field}`);
    assert.equal(
      new Set(values).size,
      values.length,
      `${candidate.id}.${field} has duplicates`,
    );
  }

  for (const source of candidate.sources) {
    assert.doesNotThrow(
      () => new URL(source.url),
      `${candidate.id} source URL`,
    );
    assert.equal(
      Number.isInteger(source.year) && source.year >= 1900,
      true,
      `${candidate.id} source year`,
    );
  }
}

const referenceErrors = findContentReferenceErrors(
  inventory.candidates.map((candidate) => ({
    id: candidate.id,
    data: {
      parent: candidate.parent,
      prerequisites: candidate.prerequisites,
      cameBefore: candidate.cameBefore,
      leadsTo: candidate.leadsTo,
      related: candidate.related,
    },
  })),
  [],
);
assert.deepEqual(referenceErrors, []);

for (const candidate of inventory.candidates) {
  for (const predecessorId of candidate.cameBefore) {
    const predecessor = candidateById.get(predecessorId);
    assert.equal(
      predecessor.leadsTo.includes(candidate.id),
      true,
      `${predecessorId} must lead to ${candidate.id}`,
    );
  }
}

const connectedIds = new Set();
for (const candidate of inventory.candidates) {
  for (const field of ['prerequisites', 'cameBefore', 'leadsTo', 'related']) {
    for (const target of candidate[field]) {
      connectedIds.add(candidate.id);
      connectedIds.add(target);
    }
  }
  if (candidate.parent) {
    connectedIds.add(candidate.id);
    connectedIds.add(candidate.parent);
  }
}
assert.deepEqual(
  inventory.candidates
    .filter((candidate) => !connectedIds.has(candidate.id))
    .map((candidate) => candidate.id),
  [],
  'canonical candidates cannot be relationship orphans',
);

for (const relationship of inventory.uncertainRelationships) {
  assert.equal(candidateById.has(relationship.source), true);
  assert.equal(candidateById.has(relationship.target), true);
  assert.equal(
    ['omit', 'remove-existing'].includes(relationship.decision),
    true,
  );
  assert.equal(relationship.reason.length >= 20, true);
}

assert.equal(
  inventory.candidates.filter(
    (candidate) => candidate.sourceReview === 'editorial-review',
  ).length > 0,
  true,
  'at least one unresolved source review should remain explicit',
);
assert.match(documentation, /## Maturity vocabulary/);
assert.match(documentation, /## Alias and boundary decisions/);
assert.match(documentation, /## Encoded relationships/);
assert.match(documentation, /## Omitted or uncertain relationships/);
assert.match(plan, /docs\/post-v1-canonical-taxonomy\.md/);
const action12 = plan.match(
  /### 1\.2 Draft the canonical taxonomy[\s\S]+?(?=### 1\.3)/,
)?.[0];
assert.ok(action12, 'Action Item 1.2 section is missing');
assert.doesNotMatch(action12, /^\s*- \[ \]/gm);

console.log(
  `Canonical taxonomy validates ${inventory.candidates.length} current candidates across ${inventory.areas.length} areas with reciprocal relationships and explicit editorial uncertainty.`,
);
