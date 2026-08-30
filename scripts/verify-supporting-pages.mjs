import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const about = await readFile('dist/about/index.html', 'utf8');
const research = await readFile('dist/research/index.html', 'utf8');

assert.match(about, /<title>About · The LLM Map<\/title>/);
assert.match(research, /<title>Research · The LLM Map<\/title>/);

for (const html of [about, research]) {
  assert.match(html, /href="\/research-blog\/about\/"/);
  assert.match(html, /href="\/research-blog\/research\/"/);
}

assert.match(
  about,
  /href="\/research-blog\/about\/" aria-current="page"/,
  'About should be the current primary section',
);
assert.match(about, /Profile copy pending/);
assert.match(about, /https:\/\/github\.com\/MihirMishra23/);
assert.equal(
  (about.match(/Not added yet/g) ?? []).length,
  5,
  'Every unavailable personal link should be an explicit placeholder',
);

assert.match(
  research,
  /href="\/research-blog\/research\/" aria-current="page"/,
  'Research should be the current primary section',
);
for (const heading of [
  'Publications',
  'Selected Projects',
  'Experiments',
  'Research Interests',
]) {
  assert.match(research, new RegExp(`>${heading}<`));
}
assert.equal(
  (research.match(/\/ Placeholder/g) ?? []).length,
  4,
  'Every research section should be visibly marked as a placeholder',
);

console.log(
  'About and Research routes expose complete placeholder-safe structures and navigation metadata.',
);
