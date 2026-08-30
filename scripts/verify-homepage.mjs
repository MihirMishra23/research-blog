import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const homepage = await readFile('dist/index.html', 'utf8');
const mapPage = await readFile('dist/map/index.html', 'utf8');

assert.match(
  homepage,
  /<h1 id="page-title">The LLM Map<\/h1>/,
  'homepage title is missing',
);
assert.match(
  homepage,
  /An evolving map of how modern language models are trained, adapted, evaluated, and served\./,
  'homepage introduction does not match the product specification',
);

const introIndex = homepage.indexOf('class="home-intro"');
const mapIndex = homepage.indexOf('data-llm-map');
const pathsIndex = homepage.indexOf('class="home-paths"');
const recentIndex = homepage.indexOf('class="home-recent"');
const notebookIndex = homepage.indexOf('class="home-notebook"');

assert.ok(introIndex >= 0, 'homepage intro is missing');
assert.ok(
  mapIndex > introIndex,
  'interactive map should follow the introduction',
);
assert.ok(pathsIndex > mapIndex, 'exploration controls should follow the map');
assert.ok(recentIndex > pathsIndex, 'recent writing should follow exploration');
assert.ok(
  notebookIndex > recentIndex,
  'public-notebook description should follow recent writing',
);

for (const label of [
  "I'm learning the field",
  'I know the basics',
  'Show me the frontier',
]) {
  assert.match(
    homepage,
    new RegExp(label),
    `missing exploration control: ${label}`,
  );
}
assert.equal(
  (homepage.match(/Initial route ·/g) ?? []).length,
  3,
  'every exploration control should disclose its initial simple behavior',
);
const frontierHref = homepage.match(
  /href="\/research-blog\/topics\/([^/]+)\/#resources-title"/,
);
assert.ok(frontierHref, 'frontier route should link to real open questions');
const frontierPage = await readFile(
  `dist/topics/${frontierHref[1]}/index.html`,
  'utf8',
);
assert.match(
  frontierPage,
  /id="resources-title"/,
  'frontier route target does not contain its promised question section',
);
assert.match(
  homepage,
  /href="\/research-blog\/map\/"/,
  'homepage does not link to the focused map route',
);
assert.match(
  homepage,
  /Recently explored/,
  'recent-writing heading is missing',
);

const recentWritingCount = (homepage.match(/data-writing-entry/g) ?? []).length;
assert.ok(recentWritingCount > 0, 'homepage should show published writing');
assert.ok(
  recentWritingCount <= 5,
  'homepage should show no more than five posts',
);
assert.match(
  homepage,
  /This is my evolving map of modern deep learning\. I use it to understand how ideas connect, how the field got here, and what problems remain unsolved\./,
  'public-research-notebook statement is missing',
);

assert.match(mapPage, /Focused view · interactive concept map/);
assert.match(mapPage, /data-llm-map/, 'focused route does not reuse the map');
assert.equal(
  (mapPage.match(/data-map-node="[^"]+"/g) ?? []).length,
  10,
  'focused map route should render all ten nodes',
);
assert.equal(
  (mapPage.match(/data-map-edge="[^"]+"/g) ?? []).length,
  14,
  'focused map route should render every V1 edge',
);
assert.match(
  mapPage,
  /Semantic map \/ text view/,
  'focused route should retain the non-graph representation',
);

console.log(
  `Homepage prioritizes the map, exposes three honest paths, and lists ${recentWritingCount} recent posts; the focused map route is complete.`,
);
