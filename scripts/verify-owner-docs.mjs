import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readme = await readFile('README.md', 'utf8');

const requiredSections = [
  '## Editorial ownership',
  '## Prerequisites',
  '## Install and run locally',
  '## Commands',
  '## Repository structure',
  '## Publish an article',
  '## Create a topic and add it to the map',
  '## Drafts and validation errors',
  '## GitHub Pages deployment',
  '## Future custom domain',
];

for (const section of requiredSections) {
  assert.match(readme, new RegExp(`^${section}$`, 'm'), `missing ${section}`);
}

assert.match(
  readme,
  /Mihir writes all publishable article-body prose\./,
  'owner-authorship policy must remain explicit',
);
assert.match(
  readme,
  /Contributor accounts, public submissions, collaborator roles, shared editing, and a browser-based CMS or content editor are intentionally out of scope\./,
  'single-owner scope must remain explicit',
);
assert.match(readme, /status: draft/);
assert.match(readme, /status: published/);
assert.match(readme, /draft: true/);
assert.match(readme, /npm run verify:production/);
assert.match(readme, /https:\/\/mihirmishra23\.github\.io\/research-blog\//);
assert.match(readme, /Settings → Pages/);
assert.match(readme, /public\/CNAME/);
assert.match(readme, /Enforce HTTPS/);

console.log(
  'Owner README covers authorship, local development, publishing, topics, map updates, drafts, validation, Pages, and custom domains.',
);
