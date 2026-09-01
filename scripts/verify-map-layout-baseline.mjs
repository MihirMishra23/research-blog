import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { createLayoutBaseline } from './measure-map-layout.mjs';

const [baseline, documentation, plan] = await Promise.all([
  createLayoutBaseline(),
  readFile('docs/map-layout-baseline.md', 'utf8'),
  readFile('POST_V1_MAP_ACTION_ITEMS.md', 'utf8'),
]);

assert.deepEqual(baseline.production.fixedCanvas, {
  width: 1536,
  height: 994,
});
assert.deepEqual(baseline.production.requiredCanvasWithPadding, {
  width: 1448,
  height: 875,
  padding: 64,
});
assert.equal(baseline.production.bubbleAreaDensityPercent, 11.1);
assert.equal(baseline.production.minimumNodeClearance, 34.5);
assert.deepEqual(baseline.production.nodeCollisions, []);
assert.deepEqual(baseline.production.edgeCrossings, []);
assert.deepEqual(baseline.production.edgeNodeIntrusions, [
  {
    edge: 'contains:area-post-training:sft',
    node: 'rlhf',
  },
]);
assert.deepEqual(baseline.production.longestEdges[0], {
  id: 'progression:sft:grpo',
  length: 303.2,
});

assert.deepEqual(baseline.removalScenarios.sft, {
  width: 1286,
  height: 875,
  padding: 64,
});
assert.deepEqual(baseline.removalScenarios['speculative-decoding'], {
  width: 1208,
  height: 875,
  padding: 64,
});
assert.equal(baseline.approvedExpansion.approvedTopics, 20);
assert.equal(baseline.approvedExpansion.additions, 14);
assert.equal(baseline.approvedExpansion.additionsMissingPosition, 14);
assert.equal(baseline.approvedExpansion.additionsMissingAreaLayout, 8);
assert.deepEqual(baseline.approvedExpansion.missingAreaCategories, [
  'agents',
  'interpretability',
  'memory',
  'models',
]);
assert.equal(
  baseline.approvedExpansion.currentArchitectureCanCalculateExpandedCanvas,
  false,
);
assert.equal(baseline.mobile.minimumCanvasCssWidth, 992);
assert.equal(baseline.mobile.horizontalOverflowByViewport[390], 602);
assert.equal(baseline.mobile.semanticFallback, true);

for (const heading of [
  '## Current production baseline',
  '## Removal sensitivity',
  '## Approved expansion failure',
  '## Desktop and mobile observations',
  '## Geometry versus taxonomy',
  '## Measurable layout constraints',
]) {
  assert.match(documentation, new RegExp(heading));
}
for (const constraint of [
  'Outer padding',
  'Bubble clearance',
  'Label clearance',
  'Edge crossings',
  'Area separation',
  'Edge length',
  'Initial density',
  'Label fit',
  'Hit targets',
  'Dynamic canvas',
  'Readable responsive behavior',
]) {
  assert.match(documentation, new RegExp(`\\*\\*${constraint}:\\*\\*`));
}

const action21 = plan.match(
  /### 2\.1 Measure the limits of the current layout[\s\S]+?(?=### 2\.2)/,
)?.[0];
assert.ok(action21, 'Action Item 2.1 section is missing');
assert.doesNotMatch(action21, /^\s*- \[ \]/gm);
assert.match(action21, /map-layout-baseline\.md/);

console.log(
  'Map layout baseline reproduces current geometry, removal sensitivity, expansion blockers, mobile overflow, and measurable Section 2 constraints.',
);
