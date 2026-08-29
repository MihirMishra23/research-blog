# Technical Research Blog: Implementation Action Items

Source: [GitHub Pages Technical Blog Setup Spec](./GitHub%20Pages%20Technical%20Blog%20Setup%20Spec.md)

This checklist turns the product spec into the ordered work required for the first deployable version. Complete items in order unless a dependency is explicitly independent. Record completed work, verification results, and design decisions in the current session worklog.

## Definition of done for the first milestone

The milestone is complete when the site is deployed on GitHub Pages and all of the following are true:

- Markdown or MDX posts publish through an Astro content collection.
- Math and syntax-highlighted code render correctly.
- The homepage centers a usable interactive LLM map.
- The initial six concepts link to topic pages.
- Writing pages link back into the topic structure.
- The writing archive, About page, Research page, RSS feed, and sitemap work.
- The site is responsive, keyboard-accessible, and usable without the graph UI.
- A production build passes, and the README documents the content and deployment workflows.

## Ordered action items

### 1. Establish the project baseline

- [x] Initialize a minimal Astro project with TypeScript in the repository root.
- [x] Select Astro's static output mode and record the supported Node.js version.
- [x] Add the core scripts: `dev`, `build`, `preview`, and any content/type checks.
- [x] Add `.gitignore`, formatting defaults, and a minimal public-assets directory.
- [x] Verify the untouched starter builds locally.

**Gate:** dependency installation and the production build both succeed.

### 2. Configure the site and GitHub Pages path model

- [x] Add one central site configuration for the title, description, author placeholders, repository name, and future canonical domain.
- [x] Configure Astro's `site` and `base` values so a project Pages URL works without hard-coded paths in components.
- [x] Ensure internal links and public asset URLs work both locally and below a GitHub repository subpath.
- [x] Add a GitHub Actions workflow that builds and deploys the static output on pushes to `main`.
- [x] Document the required GitHub Pages source setting and workflow permissions for later activation.

**Gate:** the workflow file and Astro configuration agree on the build output and base path.

### 3. Define the visual foundation

- [x] Create design tokens for color, typography, spacing, borders, and content widths.
- [x] Implement a responsive base layout with semantic header, navigation, main content, and footer.
- [x] Implement light and dark themes, honoring the system preference and supporting a persistent manual toggle.
- [x] Establish notebook-like visual details without gradients, large hero treatments, or card-heavy layouts.
- [x] Add visible keyboard focus states, adequate contrast, and reduced-motion behavior.

**Gate:** the empty site shell is readable and navigable at desktop and narrow mobile widths in both themes.

### 4. Model content and validate frontmatter

- [x] Create Astro content collections for `writing` and `topics`.
- [x] Define the shared topic vocabulary and enums for article type, difficulty, publication status, and concept maturity.
- [x] Validate writing frontmatter: title, description, date, topics, level, type, status/draft, optional GitHub URL, and optional paper links.
- [x] Validate topic metadata while allowing optional fields during the initial rollout.
- [x] Exclude drafts and non-published posts from production indexes and feeds.
- [x] Choose a single-source-of-truth rule so adding a concept does not require unrelated edits in multiple files.

**Gate:** valid sample content passes checks, and deliberately invalid frontmatter fails with a useful message.

### 5. Add Markdown/MDX, math, and code capabilities

- [x] Configure Markdown and MDX content rendering.
- [x] Add static KaTeX-compatible math rendering and its required styles.
- [x] Configure Shiki syntax highlighting with readable light and dark themes.
- [x] Add language labels and a progressively enhanced copy button to code blocks.
- [x] Confirm content remains readable when client-side JavaScript is unavailable.

**Gate:** one test page correctly renders inline math, display math, and a labeled code block in both themes.

### 6. Implement shared content UI

- [x] Build reusable breadcrumbs for conceptual paths.
- [x] Build an article summary component showing description, date, topics, type, and difficulty.
- [x] Build topic/status labels with restrained maturity indicators.
- [x] Build an article layout with metadata, optional “Code for this article” link, and content typography.
- [x] Add previous, next, and related-content navigation derived from metadata where practical.

**Gate:** shared components do not embed assumptions about a particular sample article or topic.

### 7. Create the initial content set

- [x] Add topic entries for SFT, RLHF, GRPO, FlashAttention, Speculative Decoding, and Multimodal Models.
- [x] Give each topic a summary, category, maturity, prerequisites, relationships, and frontier questions where relevant.
- [x] Add the sample post “Why does post-training exist?”
- [x] Add the sample post “Why is LLM inference memory-bound?”
- [x] Include enough math, code, topic links, and metadata across the samples to exercise the content system.
- [x] Keep placeholder prose clearly marked so it cannot be mistaken for finished research writing.

**Gate:** all six topic entries and both posts pass schema validation and render without broken links.

### 8. Implement article routes and the writing archive

- [x] Generate `/writing/[slug]/` pages from published writing content.
- [x] Display the conceptual breadcrumb path at the top of each article.
- [x] Connect article topics to their topic pages.
- [x] Create `/writing/` as a reverse-chronological archive.
- [x] Add client-light filtering by topic, article type, and difficulty.
- [x] Provide useful empty states and preserve a complete list when JavaScript is unavailable.

**Gate:** every published post is reachable from the archive and every displayed filter produces correct results.

### 9. Implement topic routes and indexes

- [x] Create `/topics/` with a navigable, grouped topic index.
- [x] Generate `/topics/[topic]/` pages from topic content.
- [x] Present the conceptual framework: problem, idea/how it works, consequences, limitations, and what came next.
- [x] Show prerequisites, related concepts, frontier questions, associated articles, and important paper links when present.
- [x] Handle missing optional metadata gracefully.

**Gate:** all initial concepts have working pages, reciprocal concept links, and correct associated-post lists.

### 10. Define the editable LLM map data model

- [x] Represent nodes and edges as typed static data, separate from rendering code.
- [x] Include stable IDs, slugs, labels, categories, descriptions, maturity, prerequisites, relationships, and manually assigned V1 positions.
- [x] Encode enough relationships to demonstrate progression and cross-category exploration among the six initial nodes.
- [x] Leave extension points for learning paths, frontier mode, paper overlays, and a larger taxonomy without implementing those interfaces.
- [x] Validate that every map topic slug resolves to an existing topic page.

**Gate:** invalid edges, duplicate IDs, and missing topic targets are caught by checks or tests.

### 11. Build the interactive map V1

- [x] Implement the map as a reusable, lightweight SVG-based interactive component.
- [x] Match the approved visual reference: a radial hand-drawn knowledge sketch on a quiet dotted-paper canvas, not a conventional graph or card layout.
- [x] Arrange “LLMs” as the central oval, major areas as irregular surrounding ovals, and individual concepts as handwritten branch labels.
- [x] Use slightly imperfect ink-like connectors and outlines, with manually composed positions that preserve the reference's organic spacing.
- [x] Use restrained red dots and marks for conceptual progression, selection, and frontier status while keeping the map predominantly monochrome.
- [x] Keep labels and hierarchy legible in both themes without losing the paper-and-ink character.
- [x] Display the six initial concept nodes and their immediate connections.
- [x] Support pointer click/tap and keyboard activation for every node.
- [x] Highlight the selected node and its immediate relationships.
- [x] Open a detail panel with name, summary, maturity, prerequisites, related concepts, and a topic-page link.
- [x] Add a clear return-to-overview action.
- [x] Use a bottom-sheet treatment for the detail panel on small screens.
- [x] Provide a semantic hierarchical topic list as the non-graph fallback.

**Gate:** the map is recognizably faithful to the approved hand-drawn radial reference and the core flow works with a mouse, touch-sized viewport, keyboard only, and assistive labels.

### 12. Assemble the homepage and map route

- [ ] Create the homepage title and introduction from the spec.
- [ ] Place the interactive map above the secondary homepage content.
- [ ] Add the three exploration controls: “I'm learning the field,” “I know the basics,” and “Show me the frontier.”
- [ ] Keep non-implemented exploration modes honest by linking or labeling them as initial/simple behaviors.
- [ ] Add “Recently explored” with the latest 3–5 published posts.
- [ ] Add the short public-research-notebook description from the spec.
- [ ] Create `/map/` as a focused map view using the same reusable component.

**Gate:** the homepage has no giant hero, remains fast, and clearly prioritizes exploration over chronology.

### 13. Add supporting pages

- [ ] Create `/about/` using the specified placeholder structure and clearly marked personal-link placeholders.
- [ ] Create `/research/` with Publications, Selected Projects, Experiments, and Research Interests sections.
- [ ] Add useful page titles and descriptions for both routes.

**Gate:** both pages are linked in site navigation and contain no accidental fake personal data.

### 14. Add discovery, feeds, and metadata

- [ ] Add site-wide search for post titles, topic names, descriptions, and tags, using Pagefind if it works cleanly with the final static build.
- [ ] Generate `/rss.xml` from published writing only.
- [ ] Generate a sitemap automatically.
- [ ] Add per-page title, description, canonical URL, Open Graph, and Twitter/X card metadata.
- [ ] Add a default social preview image and appropriate favicon/site icons.
- [ ] Verify that base-path deployment does not break search assets, feed links, sitemap links, or preview-image URLs.

**Gate:** generated production artifacts contain valid canonical URLs and exclude drafts.

### 15. Verify quality and production behavior

- [ ] Run formatting, type/content checks, tests, and the production build.
- [ ] Preview the production output at the configured GitHub Pages base path.
- [ ] Check all internal links and referenced static assets.
- [ ] Test representative desktop and mobile viewport sizes.
- [ ] Test keyboard navigation, focus order, color contrast, reduced motion, and the non-graph fallback.
- [ ] Confirm the generated site works without unnecessary client-side JavaScript.
- [ ] Record known limitations that are intentionally deferred.

**Gate:** all blocking issues are fixed or explicitly documented before deployment.

### 16. Document contributor and publishing workflows

- [ ] Write a README explaining the project, stack, prerequisites, exact install/run/build commands, and repository structure.
- [ ] Document how to create and publish a post.
- [ ] Document how to create a topic and add or connect a map node.
- [ ] Document draft behavior and content validation errors.
- [ ] Document GitHub Pages settings, deployment troubleshooting, and the repository-subpath configuration.
- [ ] Document future custom-domain DNS, Pages, HTTPS, and Astro configuration changes without assuming a final domain.

**Gate:** a new contributor can add a post and a map concept by following only the README.

### 17. Deploy and perform a live smoke test

- [ ] Push the completed milestone to `main` when the repository and remote are ready.
- [ ] Confirm the GitHub Pages workflow succeeds.
- [ ] Open the deployed URL and test the homepage, map interaction, article, topic, About, Research, RSS, sitemap, and search.
- [ ] Confirm canonical and social metadata use the live URL.
- [ ] Record the deployment URL, workflow result, smoke-test findings, and any follow-up items in the worklog.

**Gate:** the live site meets the milestone definition of done.

## Explicitly deferred until after V1

- Full taxonomy population beyond the initial six demonstrated concepts.
- Automatic graph layout or a heavy graph framework.
- Animated traversal, zoomable subgraphs, and timeline/field-evolution views.
- Full learning-path UI and personalized “what should I learn next?” behavior.
- Dedicated frontier-mode behavior beyond data-model support and simple controls.
- Centralized citation management beyond a minimal paper-linking structure.
- Bookmarks, completion tracking, and read indicators.
- Article-specific generated social preview images.
- Analytics unless a concrete, privacy-conscious need emerges.

## Working rules

- Keep this file as the canonical ordered backlog for the first milestone.
- Check an item only after its acceptance condition is verified.
- Add newly discovered work under the step that owns it; avoid a disconnected catch-all list.
- Record implementation facts and outcomes in the worklog, not in this checklist.
- Record changes to scope in both this file and the worklog, with a short reason.
