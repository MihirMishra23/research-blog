import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveArticleNavigation } from '../src/content/article-navigation.ts';

const articles = [
  {
    id: 'previous-post',
    title: 'The previous post',
    href: '/writing/previous-post/',
  },
  {
    id: 'next-post',
    title: 'The next post',
    href: '/writing/next-post/',
    description: 'The next conceptual step.',
  },
  {
    id: 'related-post',
    title: 'A related post',
    href: '/writing/related-post/',
  },
];

test('article navigation resolves previous, next, and related metadata IDs', () => {
  const navigation = resolveArticleNavigation(
    {
      previous: 'previous-post',
      next: 'next-post',
      related: ['related-post'],
    },
    articles,
  );

  assert.deepEqual(navigation, {
    previous: {
      title: 'The previous post',
      href: '/writing/previous-post/',
      description: undefined,
    },
    next: {
      title: 'The next post',
      href: '/writing/next-post/',
      description: 'The next conceptual step.',
    },
    related: [
      {
        title: 'A related post',
        href: '/writing/related-post/',
        description: undefined,
      },
    ],
  });
});

test('article navigation omits missing and empty metadata targets', () => {
  const navigation = resolveArticleNavigation(
    {
      previous: null,
      next: 'missing-post',
      related: ['related-post', 'also-missing'],
    },
    articles,
  );

  assert.equal(navigation.previous, undefined);
  assert.equal(navigation.next, undefined);
  assert.deepEqual(navigation.related, [
    {
      title: 'A related post',
      href: '/writing/related-post/',
      description: undefined,
    },
  ]);
});
