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

Change `status` to `published` when the article is ready. The homepage lists both stubs and published posts; stubs are marked “Coming soon.” `status: draft` excludes a post from both the homepage and generated article routes.

## Browser editor

Run `npm run dev` and, in a second terminal, `npm run editor`. Open <http://localhost:4321/research-blog/admin/> (use the port printed by Astro if 4321 is busy).

The Decap editor reads and saves Markdown files on your computer. It requires no GitHub login. Its local file server binds only to `127.0.0.1`; stop it with Ctrl+C when finished. Do not expose this unauthenticated server to a network. The editor loads its pinned interface from a CDN, so initial loading needs internet access.

1. Create or open a blog post, write Markdown, and use its article preview. Upload images through the Markdown editor; they are stored in `public/uploads/`.
2. Set visibility to **Hidden draft** while writing. Decap's Save/Publish action only writes local files in this mode; it never commits, pushes, or deploys.
3. When ready, select **Public article**, save, inspect the local article, then commit and push the finished post and its images to deploy it.

The public `/admin/` page does not load the editor or connect to your computer. It directs you to the local development site.

Uncommitted writing stays on your computer. The repository remains public: anything you commit and push is publicly readable on GitHub, even with `status: draft`. Review the files you stage before publishing. Uploaded media on `main` is also public, including media from hidden posts.

## Validate and deploy

```bash
npm run format:check
npm run check
npm run build
npm run verify
```

Pushing `main` deploys the generated static site through GitHub Actions and GitHub Pages.
