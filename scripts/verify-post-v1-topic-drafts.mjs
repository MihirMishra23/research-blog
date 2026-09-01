import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const inventory = JSON.parse(
  await readFile('docs/post-v1-canonical-taxonomy.json', 'utf8'),
);
const productionIds = new Set([
  'sft',
  'rlhf',
  'grpo',
  'flashattention',
  'speculative-decoding',
  'multimodal-models',
]);
const draftCandidates = inventory.candidates.filter(
  (candidate) => !productionIds.has(candidate.id),
);

function frontmatterFor(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, 'topic file must start with YAML frontmatter');
  return match[1];
}

function scalar(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}: (.+)$`, 'm'));
  assert.ok(match, `missing ${field}`);
  return match[1].replace(/^['"]|['"]$/g, '');
}

function list(frontmatter, field) {
  const lines = frontmatter.split('\n');
  const start = lines.findIndex((line) => line.startsWith(`${field}:`));
  assert.notEqual(start, -1, `missing ${field}`);
  if (lines[start].trim().endsWith('[]')) return [];

  const values = [];
  for (const line of lines.slice(start + 1)) {
    if (/^[a-zA-Z]/.test(line)) break;
    const match = line.match(/^  - (.+)$/);
    if (!match) continue;
    values.push(match[1].replace(/^['"]|['"]$/g, ''));
  }
  return values;
}

for (const candidate of draftCandidates) {
  const source = await readFile(
    path.join('src/content/topics', `${candidate.id}.md`),
    'utf8',
  );
  const frontmatter = frontmatterFor(source);

  assert.equal(scalar(frontmatter, 'name'), candidate.name, candidate.id);
  assert.equal(scalar(frontmatter, 'summary'), candidate.summary, candidate.id);
  assert.equal(
    scalar(frontmatter, 'category'),
    candidate.category,
    candidate.id,
  );
  assert.equal(scalar(frontmatter, 'type'), candidate.type, candidate.id);
  assert.equal(scalar(frontmatter, 'status'), candidate.status, candidate.id);
  assert.equal(
    scalar(frontmatter, 'mapLabel'),
    candidate.mapLabel,
    candidate.id,
  );
  assert.equal(scalar(frontmatter, 'draft'), 'true', candidate.id);
  assert.deepEqual(
    list(frontmatter, 'aliases'),
    candidate.aliases,
    candidate.id,
  );

  for (const field of ['prerequisites', 'cameBefore', 'leadsTo', 'related']) {
    assert.deepEqual(list(frontmatter, field), candidate[field], candidate.id);
  }

  if (candidate.parent) {
    assert.equal(scalar(frontmatter, 'parent'), candidate.parent, candidate.id);
  }
  for (const sourceLink of candidate.sources) {
    assert.ok(
      frontmatter.includes(`url: ${sourceLink.url}`),
      `${candidate.id} is missing source ${sourceLink.url}`,
    );
  }

  assert.doesNotMatch(
    frontmatter,
    /^map:/m,
    `${candidate.id} must wait for generated map layout`,
  );
  assert.match(source, /> \*\*Author placeholder:\*\*/);
}

const topicFiles = (await readdir('src/content/topics')).filter((file) =>
  file.endsWith('.md'),
);
assert.ok(
  topicFiles.length >= inventory.candidates.length,
  'the canonical inventory is a floor, not a target-count cap',
);

try {
  await access('dist');
  for (const candidate of draftCandidates) {
    await assert.rejects(
      access(path.join('dist/topics', candidate.id, 'index.html')),
      undefined,
      `${candidate.id} leaked into the production build`,
    );
  }
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

console.log(
  `${draftCandidates.length} canonical topic drafts retain reviewed metadata, sources, author placeholders, and no hand-authored map positions.`,
);
