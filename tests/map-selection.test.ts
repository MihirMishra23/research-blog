import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveMapSelection } from '../src/content/map-selection.ts';

const model = {
  nodes: [{ id: 'root' }, { id: 'area' }, { id: 'first' }, { id: 'second' }],
  edges: [
    {
      id: 'root-area',
      source: 'root',
      target: 'area',
      kind: 'contains',
      directed: false,
    },
    {
      id: 'area-first',
      source: 'area',
      target: 'first',
      kind: 'contains',
      directed: false,
    },
    {
      id: 'first-second',
      source: 'first',
      target: 'second',
      kind: 'related',
      directed: false,
    },
  ],
};

test('map selection returns only the selected node and immediate neighbors', () => {
  const selection = resolveMapSelection(model as never, 'first');

  assert.ok(selection);
  assert.deepEqual(
    new Set(selection.connectedNodeIds),
    new Set(['first', 'area', 'second']),
  );
  assert.deepEqual(
    new Set(selection.connectedEdgeIds),
    new Set(['area-first', 'first-second']),
  );
  assert.equal(selection.connectedNodeIds.includes('root'), false);
});

test('map selection rejects unknown node IDs', () => {
  assert.equal(resolveMapSelection(model as never, 'missing'), null);
});
