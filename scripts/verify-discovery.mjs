import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const baseUrl = 'https://mihirmishra23.github.io/research-blog';
const basePath = '/research-blog';
const publishedSlugs = [
  'why-post-training-exists',
  'why-inference-memory-bound',
];

const [
  homepage,
  searchPage,
  topicPage,
  articlePage,
  rss,
  sitemapIndex,
  sitemap,
  pagefindEntry,
  manifest,
  socialImage,
] = await Promise.all([
  readFile('dist/index.html', 'utf8'),
  readFile('dist/search/index.html', 'utf8'),
  readFile('dist/topics/sft/index.html', 'utf8'),
  readFile('dist/writing/why-post-training-exists/index.html', 'utf8'),
  readFile('dist/rss.xml', 'utf8'),
  readFile('dist/sitemap-index.xml', 'utf8'),
  readFile('dist/sitemap-0.xml', 'utf8'),
  readFile('dist/pagefind/pagefind-entry.json', 'utf8'),
  readFile('dist/site.webmanifest', 'utf8'),
  readFile('dist/social-preview.png'),
]);

for (const [name, html, canonical] of [
  ['homepage', homepage, `${baseUrl}/`],
  ['search', searchPage, `${baseUrl}/search/`],
  ['topic', topicPage, `${baseUrl}/topics/sft/`],
  ['article', articlePage, `${baseUrl}/writing/why-post-training-exists/`],
]) {
  assert.match(
    html,
    new RegExp(`<link rel="canonical" href="${canonical}"`),
    `${name} canonical URL is missing or incorrect`,
  );
  assert.match(html, /<meta property="og:title" content="[^"]+"/);
  assert.match(html, /<meta property="og:description" content="[^"]+"/);
  assert.match(
    html,
    new RegExp(`<meta property="og:url" content="${canonical}"`),
  );
  assert.match(
    html,
    new RegExp(
      `<meta property="og:image" content="${baseUrl}/social-preview.png"`,
    ),
  );
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  assert.match(
    html,
    new RegExp(
      `<link rel="alternate" type="application/rss\\+xml"[^>]+href="${baseUrl}/rss.xml"`,
    ),
  );
}

assert.match(articlePage, /<meta property="og:type" content="article"/);
assert.match(articlePage, /<meta property="article:published_time"/);
assert.match(articlePage, /data-pagefind-body/);
assert.match(articlePage, /data-pagefind-meta="tags">alignment/);
assert.match(topicPage, /data-pagefind-body/);
assert.doesNotMatch(searchPage, /data-pagefind-body/);
assert.match(searchPage, /data-pagefind-ignore/);
assert.match(
  searchPage,
  new RegExp(`src="${basePath}/pagefind/pagefind-ui.js"`),
);
assert.match(
  searchPage,
  new RegExp(`href="${basePath}/pagefind/pagefind-ui.css"`),
);
assert.match(searchPage, new RegExp(`bundlePath = "${basePath}/pagefind/"`));

const rssItems = rss.match(/<item>/g) ?? [];
assert.equal(
  rssItems.length,
  publishedSlugs.length,
  'RSS must contain only the two published writing entries',
);
assert.match(rss, new RegExp(`<link>${baseUrl}/</link>`));
for (const slug of publishedSlugs) {
  assert.match(rss, new RegExp(`${baseUrl}/writing/${slug}/`));
}
assert.doesNotMatch(rss, /rendering-test|content-preview|map-preview/);

assert.match(
  sitemapIndex,
  new RegExp(`${baseUrl}/sitemap-0.xml`),
  'sitemap index must retain the repository base path',
);
for (const path of [
  '/',
  '/search/',
  '/topics/sft/',
  '/writing/why-post-training-exists/',
]) {
  assert.match(sitemap, new RegExp(`<loc>${baseUrl}${path}</loc>`));
}
assert.doesNotMatch(sitemap, /content-preview|map-preview|rendering-test/);

const pagefind = JSON.parse(pagefindEntry);
assert.equal(
  pagefind.languages.en.page_count,
  8,
  'Pagefind should index six topics and two published articles only',
);

const webManifest = JSON.parse(manifest);
assert.equal(webManifest.start_url, `${basePath}/`);
assert.equal(webManifest.scope, `${basePath}/`);
assert.equal(webManifest.icons.length, 2);

assert.equal(socialImage.readUInt32BE(16), 1200);
assert.equal(socialImage.readUInt32BE(20), 630);

for (const asset of [
  'dist/favicon.svg',
  'dist/favicon-32.png',
  'dist/apple-touch-icon.png',
  'dist/icon-192.png',
  'dist/icon-512.png',
  'dist/social-preview.png',
  'dist/pagefind/pagefind.js',
  'dist/pagefind/pagefind-ui.js',
  'dist/pagefind/pagefind-ui.css',
]) {
  await readFile(asset);
}

console.log(
  'Search, RSS, sitemap, canonical/social metadata, and base-path assets are valid.',
);
