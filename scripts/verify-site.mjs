import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const [home, asyncRl, rootEntries] = await Promise.all([
  readFile('dist/index.html', 'utf8'),
  readFile('dist/posts/async-rl/index.html', 'utf8'),
  readdir('dist', { recursive: true }),
]);

assert.match(home, /The LLM Map/);
assert.match(home, /Static LLM concept map/);
assert.match(home, /Blog posts/);
assert.match(home, /href="\/research-blog\/posts\/async-rl\/"/);
assert.match(home, /Async RL/);
assert.match(home, /Coming soon/);
assert.doesNotMatch(home, /data-map-node|aria-expanded|data-map-model/);

const mapSection = home.match(
  /<section class="map-section"[\s\S]*?<\/section>/,
)?.[0];
assert.ok(mapSection, 'The homepage should contain the static map section.');
assert.doesNotMatch(mapSection, /<a\b/, 'Map nodes must not be links.');

assert.match(asyncRl, /<h1>Async RL<\/h1>/);
assert.match(asyncRl, /Draft — coming soon/);
const articleBody = asyncRl.match(
  /<div class="article-body">([\s\S]*?)<\/div>/,
)?.[1];
assert.equal(
  articleBody?.replace(/<!--[\s\S]*?-->/g, '').trim(),
  '',
  'The Async RL stub must not contain article prose.',
);

const htmlFiles = rootEntries.filter((entry) => entry.endsWith('.html')).sort();
assert.deepEqual(htmlFiles, ['index.html', 'posts/async-rl/index.html']);

const clientScripts = [...home.matchAll(/<script\b[^>]*src=/g)];
assert.equal(
  clientScripts.length,
  0,
  'The homepage should ship no client JavaScript.',
);

console.log(
  'Verified the static map homepage and empty Async RL article stub.',
);
