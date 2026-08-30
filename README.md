# The LLM Map

The LLM Map is Mihir Mishra's single-author research blog: an editorial knowledge map connected to permanent topic pages and long-form technical writing.

- Live site: <https://mihirmishra23.github.io/research-blog/>
- Repository: <https://github.com/MihirMishra23/research-blog>
- Production branch: `main`

This README is the owner manual. It covers local development, publishing an article, adding a topic to the map, validation, deployment, and a future custom-domain migration.

## Editorial ownership

Mihir writes all publishable article-body prose. AI must not generate, ghostwrite, or rewrite prose that will be presented as Mihir's article writing.

AI may assist with:

- article titles and topic names;
- graph, taxonomy, and relationship suggestions;
- layouts and visual design;
- code, schemas, tests, build tooling, and deployment;
- mechanical checks such as broken links, metadata validation, and formatting.

Mihir makes the final editorial and design decisions. If AI supplies a title or taxonomy suggestion, that does not authorize it to fill in the article body.

This is not a multi-author publishing platform. Contributor accounts, public submissions, collaborator roles, shared editing, and a browser-based CMS or content editor are intentionally out of scope. Content is edited as Markdown or MDX in this repository and published by Mihir through Git.

## Stack

- Astro 7 static-site generation
- TypeScript and Astro content collections with Zod validation
- Markdown and MDX for writing and topics
- Shiki for code highlighting
- KaTeX for math
- Pagefind for static search
- GitHub Actions and GitHub Pages for deployment
- Plain SVG, CSS, and small progressive-enhancement scripts for the map and controls

There is no database, application server, authentication system, analytics service, or hosted CMS.

## Prerequisites

- Git
- Node.js `>=22.12.0 <23`
- npm, included with Node.js
- access to the `MihirMishra23/research-blog` repository when publishing

Check the local versions:

```bash
git --version
node --version
npm --version
```

The GitHub CLI is optional. Browser-based GitHub Actions controls work without it.

## Install and run locally

For a new checkout:

```bash
git clone https://github.com/MihirMishra23/research-blog.git
cd research-blog
npm install
npm run dev
```

Open <http://localhost:4321/research-blog/>. The `/research-blog/` prefix is intentional: local development uses the same repository-subpath configuration as GitHub Pages.

For an existing checkout:

```bash
git switch main
git pull --ff-only
npm install
npm run dev
```

Stop the development server with `Ctrl+C`.

## Commands

| Command                     | Purpose                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `npm run dev`               | Start the local Astro development server. Draft content is visible.                |
| `npm run check`             | Validate Astro, TypeScript, and content collection entries.                        |
| `npm test`                  | Run schema, reference, navigation, and map-model tests.                            |
| `npm run build`             | Generate the production site in `dist/` and build the Pagefind index.              |
| `npm run preview`           | Serve the existing `dist/` production build locally.                               |
| `npm run format`            | Format repository files with Prettier.                                             |
| `npm run format:check`      | Check formatting without changing files.                                           |
| `npm run verify:content`    | Verify the rendered content fixture.                                               |
| `npm run verify:writing`    | Verify the writing archive and permanent article routes.                           |
| `npm run verify:topics`     | Verify the topic index and permanent topic routes.                                 |
| `npm run verify:map-model`  | Verify map nodes, edges, geometry, and topic links.                                |
| `npm run verify:map`        | Verify the rendered interactive map and semantic fallback.                         |
| `npm run verify:discovery`  | Verify search, RSS, sitemap, and social metadata.                                  |
| `npm run verify:production` | Audit generated internal links, assets, fallbacks, contrast, and JavaScript scope. |
| `npm run verify:docs`       | Verify that this owner workflow retains its required policies and instructions.    |

Before publishing, run the complete quality gate:

```bash
npm run format:check
npm run check
npm test
npm run build
npm run verify:content
npm run verify:writing
npm run verify:topics
npm run verify:map-model
npm run verify:map
npm run verify:homepage
npm run verify:supporting-pages
npm run verify:discovery
npm run verify:production
npm run verify:docs
```

Run `npm run build` before any command that inspects `dist/`.

## Repository structure

```text
.
├── .github/workflows/deploy.yml     GitHub Pages deployment
├── public/                          static icons and social image
├── scripts/                         generated-output verification
├── src/
│   ├── components/                  reusable Astro UI
│   ├── config/site.ts               identity, owner links, URL and base path
│   ├── content/
│   │   ├── writing/                 article Markdown and MDX
│   │   ├── topics/                  canonical topic Markdown and MDX
│   │   ├── schemas.ts               allowed frontmatter and values
│   │   ├── references.ts            cross-entry relationship validation
│   │   └── map-model.ts             area layout and derived map edges
│   ├── layouts/                     shared page and article shells
│   ├── pages/                       Astro routes, RSS, manifest, and map data
│   └── styles/global.css            site-wide visual system
├── tests/                           Node test suite
├── astro.config.mjs                 Astro, Markdown, MDX, math, and sitemap
├── docs/                            deeper technical design notes
└── IMPLEMENTATION_ACTION_ITEMS.md   ordered project checklist
```

## Publish an article

### 1. Choose the permanent ID

Create a lowercase kebab-case filename in `src/content/writing/`. The filename becomes the permanent URL.

```text
src/content/writing/how-kv-caching-works.md
                        ↓
/research-blog/writing/how-kv-caching-works/
```

Renaming the file later changes the URL, so choose the ID before publishing. Use `.mdx` instead of `.md` only when the article needs MDX features.

### 2. Start with valid frontmatter

Create the file with this template:

```yaml
---
title: 'How does KV caching work?'
description: 'A concise description between 10 and 240 characters.'
date: 2026-08-30
topics:
  - inference-systems
tags:
  - kv-cache
level: intermediate
type: explainer
status: draft
github: null
papers: []
previous: null
next: null
related: []
---
<!-- Mihir writes the article body below this line. -->
```

Replace the example title and metadata as needed. The `topics` values must match filenames in `src/content/topics/`; at least one topic is required.

Allowed values:

- `level`: `introductory`, `intermediate`, or `advanced`
- `type`: `explainer`, `deep-dive`, `experiment`, `paper-notes`, `research-note`, `survey`, or `opinion`
- `status`: `draft`, `published`, or `archived`

Optional `updated` uses the same date format. Each paper has a `title`, absolute `url`, and optional numeric `year`. `previous`, `next`, and `related` use article file IDs, not titles or URLs.

### 3. Write and preview locally

Mihir writes the article body beneath the frontmatter. Markdown headings, fenced code blocks, inline math `$...$`, and display math `$$...$$` are supported.

Keep `status: draft` while writing, then run:

```bash
npm run dev
```

Draft articles receive local routes and appear in development views. They are excluded from the production writing archive, permanent production routes, RSS, sitemap, and search index.

### 4. Validate references and presentation

```bash
npm run format
npm run check
npm test
npm run build
npm run verify:writing
npm run verify:discovery
npm run verify:production
```

Open the local article and check headings, code overflow, equations, links, citations, mobile layout, previous/next navigation, and related-topic labels.

If `next` points to another article, that article's `previous` must point back. Article IDs cannot reference themselves, and every referenced article and topic must exist.

### 5. Publish

When the article is ready and the body is entirely Mihir's writing:

1. change `status: draft` to `status: published`;
2. omit the legacy `draft` field; if it is present, it must be `false`;
3. rerun the complete quality gate;
4. review `git diff`;
5. commit and push to `main`.

```bash
git add src/content/writing/how-kv-caching-works.md
git commit -m "Publish article on KV caching"
git push origin main
```

The push triggers GitHub Pages. Confirm the workflow succeeds under the repository's **Actions** tab and then open the permanent article URL.

To remove an article from production without deleting its source, set `status: archived`. To resume editing privately from production, set `status: draft`.

## Create a topic and add it to the map

Topic Markdown is the single source of truth for the topic page, topic index, article labels, search metadata, and visual map.

### 1. Choose a topic ID and category

Create a lowercase kebab-case file in `src/content/topics/`, for example:

```text
src/content/topics/kv-caching.md
```

The V1 visual map currently has authored area geometry for these categories only:

- `post-training`
- `inference-systems`
- `multimodal`

The schema also accepts `training`, `models`, `agents`, `retrieval`, `evaluation`, `interpretability`, and `safety`, but a topic in one of those categories cannot enter the V1 map until a matching area is added to `MAP_AREAS` in `src/content/map-model.ts`.

### 2. Create the topic file

```yaml
---
name: 'KV Caching'
summary: 'A short explanation between 10 and 240 characters.'
category: inference-systems
type: system
status: established
draft: true
aliases:
  - 'KV cache'
mapLabel: 'KV Caching'
problem: 'Describe the problem this concept addresses.'
idea: 'Describe the core idea without writing an article for Mihir.'
consequence: 'Describe the most important result or tradeoff.'
limitations: 'Describe important constraints or failure cases.'
whatCameNext: 'Describe the next conceptual development when useful.'
prerequisites: []
cameBefore: []
leadsTo: []
related: []
frontierQuestions: []
papers: []
map:
  x: 1200
  y: 500
  width: 170
  height: 62
  labelOffsetX: 0
  labelOffsetY: 0
---
<!-- Optional longer topic-page notes go here. -->
```

Allowed concept `type` values are `area`, `concept`, `method`, `architecture`, `system`, `benchmark`, `practice`, and `tool`.

Maturity `status` is separate from publication state:

- `foundational`: a durable prerequisite or framing idea;
- `established`: broadly adopted with stable core methods or evidence;
- `active`: substantially used or developed while important questions still move;
- `frontier`: early and rapidly changing.

For topics, `draft: true` controls production visibility. Set it to `false` or remove it to publish.

### 3. Position the bubble

Map coordinates use a 1536×994 canvas. `x` and `y` are the bubble center. Optional `width` and `height` default to 160×48; use enough width for the label. Small `labelOffsetX` and `labelOffsetY` values visually center unusual labels.

Use the existing topic files and `/research-blog/map-preview/` as references. Keep bubbles separated and route relationships so no line passes through a topic name. If a long relationship needs authored bends, add its stable edge ID and waypoints to `MAP_EDGE_ROUTES` in `src/content/map-model.ts`.

### 4. Connect the topic intentionally

Relationships use topic IDs:

- `prerequisites`: knowledge that should be understood first;
- `cameBefore`: earlier concepts in a directed progression;
- `leadsTo`: concepts that follow from this one;
- `related`: undirected conceptual connections;
- `parent`: an optional broader topic ID.

Reciprocal rules are enforced:

- if `a` lists `b` in `related`, `b` must list `a` in `related`;
- if `a` lists `b` in `leadsTo`, `b` must list `a` in `cameBefore`.

The model derives area membership and graph edges from this metadata. Do not hand-code duplicate labels or edges in the SVG component.

### 5. Validate, publish, and inspect

```bash
npm run format
npm run check
npm test
npm run build
npm run verify:topics
npm run verify:map-model
npm run verify:map
npm run verify:production
```

While `draft: true`, inspect the topic and map locally. When the topic page and position are ready, set `draft: false`, rerun the complete quality gate, review the diff, commit, and push to `main`.

## Drafts and validation errors

Astro validates frontmatter during development, `npm run check`, and `npm run build`. A failure blocks deployment rather than publishing inconsistent content.

Common failures and fixes:

| Error                                         | Fix                                                                         |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| “Use a lowercase kebab-case content ID”       | Rename the file or relationship ID to lowercase words separated by hyphens. |
| “Unrecognized key”                            | Remove the misspelled or unsupported frontmatter field; schemas are strict. |
| “A post must reference at least one topic ID” | Add an existing topic ID to `topics`.                                       |
| “references missing topic”                    | Correct the ID or create the topic before referencing it.                   |
| “Related topics must be reciprocal”           | Add the reverse `related` reference to the target topic.                    |
| “Progression must be reciprocal”              | Add the source ID to the target's `cameBefore`.                             |
| “does not point back”                         | Make an article's `next` and the following article's `previous` agree.      |
| “missing a V1 position”                       | Add a `map` block to every non-draft topic entering the production map.     |
| “has no area layout”                          | Use a currently mapped category or add a matching area in `MAP_AREAS`.      |
| “outside the V1 canvas”                       | Keep `x` within 0–1536 and `y` within 0–994.                                |
| Contradictory `draft` and `status`            | For articles, remove `draft` and use `status` as the canonical control.     |

Draft behavior summary:

- article draft: `status: draft`;
- published article: `status: published` with no `draft` field;
- archived article: `status: archived`;
- topic draft: `draft: true`;
- published topic: `draft: false` or omit the field.

Development includes drafts. Production routes, writing/topic indexes, search, feeds, and the map exclude them according to the visibility rules in `src/content/visibility.ts`.

## GitHub Pages deployment

The current production URL is:

```text
https://mihirmishra23.github.io/research-blog/
```

The repository settings must be:

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions.
2. **Settings → Actions → General:** GitHub Actions enabled.
3. The repository must be public, or the account plan must support Pages for private repositories.

`.github/workflows/deploy.yml` runs on every push to `main` and can be rerun manually:

1. open the repository's **Actions** tab;
2. select **Deploy to GitHub Pages**;
3. select a run and choose **Re-run all jobs**, or choose **Run workflow** to start a new run from `main`.

With the optional GitHub CLI:

```bash
gh auth status
gh workflow run deploy.yml --ref main
gh run list --workflow deploy.yml --limit 5
gh run watch RUN_ID --exit-status
```

### Repository-subpath configuration

`src/config/site.ts` is the source of truth:

```ts
const customDomain: string | null = null;
const githubPagesOrigin = 'https://mihirmishra23.github.io';
const githubPagesBase = '/research-blog';
```

Astro receives this origin and base in `astro.config.mjs`. Internal links and public assets must use `sitePath()` or `siteHref()` instead of hard-coding the base. The generated site should contain `/research-blog/` in internal production URLs.

### Troubleshooting deployment

1. Open the failed workflow and expand the failed step.
2. Reproduce build failures locally with `npm install`, `npm run check`, and `npm run build` using Node 22.
3. If dependency versions differ, confirm `package-lock.json` is committed and use `npm install` without manually editing the lockfile.
4. If Pages reports no publishing source, set Pages **Source** to **GitHub Actions**.
5. If the workflow cannot deploy, confirm Actions are enabled and the workflow still grants `contents: read`, `pages: write`, and `id-token: write`.
6. If CSS, search, icons, or links return 404, confirm `customDomain` is `null`, `githubPagesBase` is `/research-blog`, and URLs use the shared helpers.
7. If a content entry fails, fix the first schema or reference error; later errors may be consequences of it.
8. Rerun the workflow only after the underlying source or repository setting is corrected.

## Future custom domain

Do not configure these steps until a final domain and DNS provider have been chosen.

When ready:

1. Set `customDomain` in `src/config/site.ts` to the complete HTTPS origin, for example `https://example.com`.
2. Create `public/CNAME` containing only the hostname, for example `example.com`.
3. In **Settings → Pages → Custom domain**, enter the hostname.
4. Add the exact DNS records GitHub requests at the chosen DNS provider. The required records differ for an apex domain and a subdomain, so follow the then-current GitHub Pages instructions rather than copying placeholder records.
5. Wait for GitHub's DNS check and certificate provisioning.
6. Enable **Enforce HTTPS** in Pages settings.
7. Run the complete quality gate and deploy.
8. Verify that canonical URLs, Open Graph metadata, RSS, sitemap, search assets, icons, and internal links use the custom domain and `/` rather than `/research-blog/`.
9. Decide whether the old GitHub Pages repository URL should redirect or remain only an implementation URL.

Setting `customDomain` automatically changes Astro's deployment base to `/`; do not manually scatter domain or base-path changes through components.

## Further technical references

- [`docs/content-model.md`](docs/content-model.md)
- [`docs/map-data-model.md`](docs/map-data-model.md)
- [`docs/map-interaction.md`](docs/map-interaction.md)
- [`docs/github-pages.md`](docs/github-pages.md)
- [`GitHub Pages Technical Blog Setup Spec.md`](GitHub%20Pages%20Technical%20Blog%20Setup%20Spec.md)
