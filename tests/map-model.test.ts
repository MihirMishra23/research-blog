import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createLlmMapModel,
  findMapModelErrors,
  type MapTopicRecord,
} from '../src/content/map-model.ts';
import { topicSchema } from '../src/content/schemas.ts';

function topic(
  id: string,
  overrides: Record<string, unknown> = {},
): MapTopicRecord {
  return {
    id,
    data: topicSchema.parse({
      name: id === 'first' ? 'First concept' : 'Second concept',
      summary: 'A sufficiently detailed concept summary for map model tests.',
      category: 'post-training',
      type: 'method',
      status: 'active',
      map: { x: id === 'first' ? 300 : 500, y: 300 },
      ...overrides,
    }),
  };
}

test('map model composes topic metadata, geometry, and stable edges', () => {
  const model = createLlmMapModel([
    topic('first', {
      mapLabel: 'First',
      leadsTo: ['second'],
      related: ['second'],
    }),
    topic('second', {
      prerequisites: ['first'],
      cameBefore: ['first'],
      related: ['first'],
    }),
  ]);
  const first = model.nodes.find((node) => node.id === 'first');

  assert.equal(model.version, 'v1');
  assert.equal(first?.kind, 'topic');
  if (first?.kind !== 'topic') return;
  assert.equal(first.slug, 'first');
  assert.equal(first.href, '/topics/first/');
  assert.equal(first.label, 'First');
  assert.equal(first.position.x, 300);
  assert.equal(
    model.edges.some((edge) => edge.id === 'progression:first:second'),
    true,
  );
  assert.equal(
    model.edges.some((edge) => edge.id === 'related:first:second'),
    true,
  );
  assert.equal(
    model.edges.some((edge) => edge.id === 'prerequisite:first:second'),
    false,
    'a progression edge should subsume the matching prerequisite edge',
  );
});

test('map validation reports duplicate IDs, missing positions, areas, and targets', () => {
  const errors = findMapModelErrors([
    topic('first', { leadsTo: ['missing'] }),
    topic('first', { map: undefined, category: 'agents' }),
  ]);

  assert.equal(
    errors.some((error) => error.includes('Duplicate')),
    true,
  );
  assert.equal(
    errors.some((error) => error.includes('missing a V1 position')),
    true,
  );
  assert.equal(
    errors.some((error) => error.includes('no area layout')),
    true,
  );
  assert.equal(
    errors.some((error) => error.includes('missing topic target')),
    true,
  );
});

test('map model applies an authored outside route to the long cross-category edge', () => {
  const model = createLlmMapModel([
    topic('flashattention', {
      category: 'inference-systems',
      related: ['multimodal-models'],
    }),
    topic('multimodal-models', {
      category: 'multimodal',
      related: ['flashattention'],
    }),
  ]);
  const edge = model.edges.find(
    (candidate) => candidate.id === 'related:flashattention:multimodal-models',
  );

  assert.deepEqual(edge?.route, [
    { x: 1510, y: 170 },
    { x: 1510, y: 720 },
  ]);
});
