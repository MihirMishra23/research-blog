import assert from 'node:assert/strict';

import { evaluateLayoutApproaches } from './evaluate-map-layout-approaches.mjs';

const evaluation = await evaluateLayoutApproaches();
const custom = evaluation.approaches.customRadial;
const dagre = evaluation.approaches.dagreHierarchical;

assert.equal(evaluation.inventory.topics, 20);
assert.equal(evaluation.inventory.areas, 7);

for (const approach of [custom, dagre]) {
  assert.equal(approach.layoutRunsAtBuildTime, true);
  assert.equal(approach.staticSerializableGeometry, true);
  assert.equal(approach.labelDimensionsProvidedToLayout, true);
  assert.equal(approach.deterministic, true);
  assert.equal(approach.currentTaxonomy.topics, 20);
  assert.equal(approach.currentTaxonomy.areas, 7);
  assert.equal(approach.currentTaxonomy.nodeCollisions.length, 0);
  assert.ok(approach.currentTaxonomy.bubbleAreaDensityPercent <= 18);
}

assert.ok(custom.removeClip.movedNodes < dagre.removeClip.movedNodes);
assert.ok(
  custom.addMultimodalProbe.movedNodes < dagre.addMultimodalProbe.movedNodes,
);
assert.ok(
  custom.currentTaxonomy.fixedCanvas.height <
    dagre.currentTaxonomy.fixedCanvas.height,
);
assert.ok(
  dagre.currentTaxonomy.minimumNodeClearance >= 40,
  'The library prototype should demonstrate dimension-aware node separation.',
);
assert.ok(
  custom.currentTaxonomy.edgeNodeIntrusions.length > 0 &&
    dagre.currentTaxonomy.edgeNodeIntrusions.length > 0,
  'Action 2.2 must continue to expose unresolved routing work for Action 2.3.',
);

console.log(
  'Map layout approach verification passed: both prototypes are deterministic, label-aware, static, and measured against add/remove scenarios.',
);
