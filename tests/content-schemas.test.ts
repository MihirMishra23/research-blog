import assert from 'node:assert/strict';
import test from 'node:test';
import {
  shouldIncludeTopic,
  shouldIncludeWriting,
  topicsForCurrentMap,
} from '../src/content/visibility.ts';
import { topicSchema, writingSchema } from '../src/content/schemas.ts';

const validWriting = {
  title: 'Why does speculative decoding work?',
  description:
    'A conceptual and technical walkthrough of speculative decoding.',
  date: '2026-08-28',
  topics: ['flashattention', 'speculative-decoding'],
  level: 'intermediate',
  type: 'explainer',
  status: 'published',
  github: null,
  papers: [
    {
      title: 'Fast Inference from Transformers via Speculative Decoding',
      url: 'https://arxiv.org/abs/2211.17192',
      year: 2022,
    },
  ],
};

const validTopic = {
  name: 'Speculative Decoding',
  summary:
    'A family of methods that verify multiple proposed tokens in parallel.',
  category: 'inference',
  type: 'method',
  status: 'active',
  prerequisites: ['autoregressive-decoding'],
  leadsTo: ['medusa', 'eagle'],
  map: { x: 1120, y: 370 },
};

test('writing schema accepts and normalizes valid metadata', () => {
  const result = writingSchema.safeParse(validWriting);

  assert.equal(result.success, true);
  if (!result.success) return;

  assert.equal(result.data.date instanceof Date, true);
  assert.equal(result.data.draft, false);
  assert.deepEqual(result.data.tags, []);
  assert.deepEqual(result.data.related, []);
});

test('writing schema rejects contradictory draft metadata with a useful message', () => {
  const result = writingSchema.safeParse({ ...validWriting, draft: true });

  assert.equal(result.success, false);
  if (result.success) return;

  assert.match(result.error.issues[0]?.message ?? '', /draft.*status/i);
});

test('writing schema rejects unsupported article types and malformed topic IDs', () => {
  const result = writingSchema.safeParse({
    ...validWriting,
    type: 'tutorial',
    topics: ['Inference Systems'],
  });

  assert.equal(result.success, false);
  if (result.success) return;

  assert.equal(
    result.error.issues.some((issue) => issue.path[0] === 'type'),
    true,
  );
  assert.equal(
    result.error.issues.some((issue) => issue.path[0] === 'topics'),
    true,
  );
});

test('topic schema accepts core metadata and fills optional relationship lists', () => {
  const result = topicSchema.safeParse(validTopic);

  assert.equal(result.success, true);
  if (!result.success) return;

  assert.equal(result.data.draft, false);
  assert.deepEqual(result.data.related, []);
  assert.deepEqual(result.data.frontierQuestions, []);
  assert.deepEqual(result.data.map, {
    x: 1120,
    y: 370,
    labelOffsetX: 0,
    labelOffsetY: 0,
  });
});

test('topic schema rejects malformed relationship IDs', () => {
  const result = topicSchema.safeParse({
    ...validTopic,
    related: ['RLHF'],
  });

  assert.equal(result.success, false);
  if (result.success) return;

  assert.equal(
    result.error.issues.some((issue) => issue.path[0] === 'related'),
    true,
  );
  assert.match(result.error.issues[0]?.message ?? '', /lowercase kebab-case/i);
});

test('production visibility excludes draft, archived, and non-published writing', () => {
  const published = writingSchema.parse(validWriting);
  const draft = writingSchema.parse({ ...validWriting, status: 'draft' });
  const archived = writingSchema.parse({ ...validWriting, status: 'archived' });

  assert.equal(shouldIncludeWriting(published, true), true);
  assert.equal(shouldIncludeWriting(draft, true), false);
  assert.equal(shouldIncludeWriting(archived, true), false);
  assert.equal(shouldIncludeWriting(draft, false), true);
});

test('production visibility excludes draft topics', () => {
  const published = topicSchema.parse(validTopic);
  const draft = topicSchema.parse({ ...validTopic, draft: true });

  assert.equal(shouldIncludeTopic(published, true), true);
  assert.equal(shouldIncludeTopic(draft, true), false);
  assert.equal(shouldIncludeTopic(draft, false), true);
});

test('current map projection excludes drafts and relationships to hidden topics', () => {
  const visible = topicSchema.parse({
    ...validTopic,
    prerequisites: [],
    leadsTo: ['draft-method'],
    related: ['draft-method'],
  });
  const draft = topicSchema.parse({
    ...validTopic,
    name: 'Draft method',
    draft: true,
    prerequisites: ['speculative-decoding'],
    leadsTo: [],
    related: ['speculative-decoding'],
  });

  const projected = topicsForCurrentMap([
    { id: 'speculative-decoding', data: visible },
    { id: 'draft-method', data: draft },
  ]);

  assert.equal(projected.length, 1);
  assert.equal(projected[0]?.id, 'speculative-decoding');
  assert.deepEqual(projected[0]?.data.leadsTo, []);
  assert.deepEqual(projected[0]?.data.related, []);
});
