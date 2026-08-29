import assert from 'node:assert/strict';
import test from 'node:test';
import { findContentReferenceErrors } from '../src/content/references.ts';

const topics = [
  {
    id: 'earlier',
    data: {
      prerequisites: [],
      cameBefore: [],
      leadsTo: ['later'],
      related: [],
    },
  },
  {
    id: 'later',
    data: {
      prerequisites: ['earlier'],
      cameBefore: ['earlier'],
      leadsTo: [],
      related: [],
    },
  },
];

const writing = [
  {
    id: 'first',
    data: {
      topics: ['earlier'],
      previous: null,
      next: 'second',
      related: [],
    },
  },
  {
    id: 'second',
    data: {
      topics: ['later'],
      previous: 'first',
      next: null,
      related: [],
    },
  },
];

test('content references accept complete reciprocal relationships', () => {
  assert.deepEqual(findContentReferenceErrors(topics, writing), []);
});

test('content references report missing, self, and non-reciprocal targets', () => {
  const errors = findContentReferenceErrors(
    [
      ...topics,
      {
        id: 'broken',
        data: {
          prerequisites: ['missing-topic'],
          cameBefore: [],
          leadsTo: [],
          related: ['broken', 'earlier'],
        },
      },
    ],
    [
      ...writing,
      {
        id: 'broken-article',
        data: {
          topics: ['missing-topic'],
          previous: 'missing-article',
          next: 'broken-article',
          related: [],
        },
      },
    ],
  );

  assert.equal(
    errors.some((error) => error.includes('missing topic "missing-topic"')),
    true,
  );
  assert.equal(
    errors.some((error) => error.includes('cannot reference itself')),
    true,
  );
  assert.equal(
    errors.some((error) => error.includes('Related topics must be reciprocal')),
    true,
  );
  assert.equal(
    errors.some((error) => error.includes('missing article "missing-article"')),
    true,
  );
});
