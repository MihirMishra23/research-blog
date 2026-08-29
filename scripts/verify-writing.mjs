import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const articleIds = ['why-post-training-exists', 'why-inference-memory-bound'];
const archive = await readFile('dist/writing/index.html', 'utf8');

for (const id of articleIds) {
  assert.match(
    archive,
    new RegExp(`href="/research-blog/writing/${id}/"`),
    `archive does not link to article "${id}"`,
  );
}

assert.equal(
  (archive.match(/<article[^>]*data-writing-entry/g) ?? []).length,
  2,
  'archive should contain both published articles in static HTML',
);
assert.doesNotMatch(
  archive,
  /data-writing-entry[^>]*hidden/,
  'server-rendered archive entries must remain visible without JavaScript',
);
assert.match(archive, /data-writing-filter/, 'archive filters did not render');
assert.match(
  archive,
  /No articles match all three filters/,
  'filtered empty state did not render',
);

const postTraining = await readFile(
  'dist/writing/why-post-training-exists/index.html',
  'utf8',
);
const inference = await readFile(
  'dist/writing/why-inference-memory-bound/index.html',
  'utf8',
);

for (const [name, html] of [
  ['post-training', postTraining],
  ['inference', inference],
]) {
  assert.match(html, /class="breadcrumbs"/, `${name} breadcrumbs are missing`);
  assert.match(html, /class="article-summary"/, `${name} summary is missing`);
  assert.match(html, /class="katex"/, `${name} math did not render`);
  assert.match(
    html,
    /data-language="python"/,
    `${name} code block did not render`,
  );
  assert.match(
    html,
    /href="\/research-blog\/topics\//,
    `${name} topic links are missing`,
  );
  assert.match(
    html,
    /href="\/research-blog\/writing\//,
    `${name} article navigation is missing`,
  );
  assert.match(
    html,
    /href="\/research-blog\/writing\/" aria-current="page"/,
    `${name} does not mark Writing as the current primary section`,
  );
}

assert.match(
  postTraining,
  /href="\/research-blog\/writing\/why-inference-memory-bound\/"/,
  'post-training article does not link to the next article',
);
assert.match(
  inference,
  /href="\/research-blog\/writing\/why-post-training-exists\/"/,
  'inference article does not link to the previous article',
);

console.log('Writing archive and both permanent article routes are valid.');
