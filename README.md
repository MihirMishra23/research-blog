# The LLM Map

Mihir Mishra’s intentionally small research blog: one LLM concept map with a
scrollable, zoomable viewport and a list of blog posts.

- Live site: <https://mihirmishra23.github.io/research-blog/>
- Full pre-simplification site: branch `archive/full-site-v1`
- Production branch: `main`

## Editorial rule

Mihir writes all article-body prose. AI may help with titles, topic names, the map, code, layout, metadata, and tooling, but must leave article contents for Mihir.

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:4321/research-blog/>.

## Add or write a post

Posts live in `src/content/posts/`. A stub looks like this:

```md
---
title: Async RL
status: stub
---

<!-- Mihir writes the article body. -->
```

Change `status` to `published` when the article is ready. The homepage lists both stubs and published posts; stubs are marked “Coming soon.”

## Validate and deploy

```bash
npm run format:check
npm run check
npm run build
npm run verify
```

Pushing `main` deploys the generated static site through GitHub Actions and GitHub Pages.
