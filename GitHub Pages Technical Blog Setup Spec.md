# GitHub Pages Technical Blog Setup Spec

## Goal

Build a personal technical research blog hosted on **GitHub Pages**.

The site should function as both:

1. A traditional technical blog.
2. An interactive knowledge map for understanding the modern LLM/deep-learning landscape.

The primary themes are:

- Pre-training
- Post-training
- Inference
- Multimodal models
- Model architecture
- Evaluation
- Interpretability
- Safety
- Agents
- RAG
- Systems / optimization

The site should feel like an **evolving research notebook and public learning system**, rather than a generic corporate blog.

---

# 1. Technical preferences

Use a static-site stack that works cleanly with GitHub Pages.

Preferred options, in order:

1. **Astro**
2. Hugo
3. Quarto

Use Astro unless there is a strong reason not to.

Requirements:

- Static output suitable for GitHub Pages
- Markdown or MDX posts
- Math rendering
- Syntax-highlighted code blocks
- Responsive design
- Fast page loads
- Minimal JavaScript outside interactive components
- Easy local development
- Easy deployment through GitHub Actions
- Support for a custom domain later
- Good SEO metadata
- RSS feed
- Sitemap
- Dark mode
- GitHub-friendly project structure

Use TypeScript where appropriate.

---

# 2. Design philosophy

The visual style should feel like:

- research notebook
- technical but approachable
- minimal
- slightly hand-drawn / exploratory
- typography-focused
- not overly polished or corporate

The interactive LLM map is the primary visual identity of the site.

Avoid:

- startup-style landing pages
- excessive gradients
- animated backgrounds
- giant hero sections
- excessive cards
- generic SaaS aesthetics

Prioritize:

- readability
- equations
- diagrams
- clear information hierarchy
- fast navigation
- exploration

---

# 3. Site structure

Create the following high-level routes:

```text
/
├── map/
├── writing/
├── writing/[slug]/
├── topics/
├── topics/[topic]/
├── research/
├── about/
└── rss.xml
```

The homepage should prioritize the interactive map rather than a chronological list of blog posts.

---

# 4. Homepage

The homepage should introduce the site with something close to:

```text
The LLM Map

An evolving map of how modern language models are
trained, adapted, evaluated, and served.
```

Underneath, show the interactive map.

Then provide three exploration options:

```text
I'm learning the field

I know the basics

Show me the frontier
```

These can initially be simple controls or links.

Below the map, show:

```text
Recently explored
```

with the latest 3–5 posts.

Also include a short site description:

> This is my evolving map of modern deep learning. I use it to understand how ideas connect, how the field got here, and what problems remain unsolved.

---

# 5. Interactive LLM map

This is the most important custom component.

Build it as a reusable component.

Possible technologies:

- SVG + React
- D3.js
- React Flow

Prefer a relatively lightweight implementation.

The graph should support:

- clicking nodes
- hovering nodes
- zooming/panning if needed
- highlighting related nodes
- linking nodes to topic pages
- showing a small description on hover/click
- indicating conceptual progression
- showing parent/child relationships
- eventually showing cross-links between categories

Do not overengineer the first version.

The first implementation can use static graph data stored in a TypeScript or JSON file.

Example:

```ts
{
  id: "rlhf",
  name: "RLHF",
  category: "post-training",
  type: "method",
  description: "Reinforcement learning from human feedback.",
  prerequisites: ["sft", "reward-models"],
  leadsTo: ["dpo", "rlvr"],
  status: "established",
  slug: "/topics/rlhf"
}
```

---

# 6. Initial map taxonomy

Use the following top-level structure as a starting point.

It should be easy to modify later.

```text
LLMs

├── Training
│   ├── Pre-training
│   ├── Data
│   ├── Objectives
│   ├── Optimization
│   └── Distributed Training
│
├── Post-training
│   ├── SFT
│   ├── Preference Data
│   ├── Reward Models
│   ├── RLHF
│   ├── PPO
│   ├── DPO
│   ├── GRPO
│   └── RLVR
│
├── Inference & Systems
│   ├── KV Cache
│   ├── FlashAttention
│   ├── PagedAttention
│   ├── Quantization
│   ├── Batching
│   ├── Speculative Decoding
│   │   ├── Medusa
│   │   └── EAGLE
│   └── Serving
│
├── Models
│   ├── Transformers
│   ├── Mixture of Experts
│   ├── Diffusion
│   └── Alternative Architectures
│
├── Multimodal
│   ├── Vision-Language Models
│   ├── Image Encoders
│   ├── Projectors
│   ├── Cross Attention
│   └── Multimodal Post-training
│
├── Agents
│   ├── Tool Calling
│   ├── ReAct
│   ├── Memory
│   ├── Planning
│   └── Multi-agent Systems
│
├── Retrieval
│   ├── RAG
│   ├── Graph RAG
│   ├── Dynamic RAG
│   └── Agentic RAG
│
├── Evaluation
│   ├── Benchmarks
│   ├── LLM-as-Judge
│   ├── Human Evaluation
│   ├── Reasoning Evaluation
│   └── Multimodal Evaluation
│
├── Interpretability
│   ├── Probing
│   ├── Circuit Tracing
│   ├── Sparse Autoencoders
│   └── Mechanistic Interpretability
│
└── Safety
    ├── Red Teaming
    ├── Safety Tuning
    ├── Robustness
    └── Alignment
```

This taxonomy is not final.

Make the data representation easy to edit.

---

# 7. Node metadata

Every concept in the map should eventually support metadata such as:

```yaml
name: RLHF
slug: rlhf
category: post-training
type: method
status: established

summary:
  Reinforcement learning from human feedback.

problem:
  How can a pretrained model be optimized toward human preferences?

prerequisites:
  - supervised-fine-tuning
  - reward-modeling
  - policy-gradient-methods

came_before:
  - supervised-fine-tuning

leads_to:
  - dpo
  - rlvr

related:
  - ppo
  - preference-learning

frontier_questions:
  - How much capability comes from reward optimization versus better sampling?
  - How robust are learned reward models outside their training distribution?

papers: []

posts: []
```

Do not require every field initially.

---

# 8. Topic pages

Each concept should have a route like:

```text
/topics/rlhf/
```

A topic page should eventually show:

```text
RLHF

What is it?

What problem does it solve?

What came before it?

How does it work?

What are its limitations?

What came next?

Where is the frontier?

Prerequisites

Related concepts

Articles

Important papers
```

The goal is not to make every topic page into Wikipedia.

Topic pages should primarily serve as navigation and conceptual orientation.

---

# 9. Blog posts

Posts should live in Markdown or MDX.

Suggested frontmatter:

```yaml
---
title: "Why does speculative decoding actually make inference faster?"
description: "A conceptual and technical walkthrough of speculative decoding."
date: 2026-08-20

topics:
  - inference
  - speculative-decoding

level: intermediate

type: explainer

status: published

github: null

papers:
  - null
---
```

Supported article types:

```text
explainer
deep-dive
experiment
paper-notes
research-note
survey
opinion
```

Supported difficulty levels:

```text
introductory
intermediate
advanced
```

---

# 10. Article navigation

At the top of each article, show the conceptual path.

For example:

```text
LLMs → Inference → Decoding → Speculative Decoding
```

Each element should link back to its topic page.

At the bottom of the article, show something like:

```text
Continue exploring

Previous:
Why autoregressive decoding is slow

Next:
Medusa and multi-token prediction

Related:
KV caching
PagedAttention
EAGLE
```

This navigation should be derived from metadata where possible.

---

# 11. Standard conceptual framework

Where appropriate, topic pages and explanatory posts should emphasize:

```text
Problem
↓
Idea
↓
How it works
↓
Consequence
↓
Limitations
↓
What came next
```

This is an important part of the site's teaching philosophy.

The goal is to explain **why methods appeared**, not just what they are.

---

# 12. Frontier indicators

The map should eventually distinguish concepts by maturity.

Possible states:

```text
foundational
established
active
frontier
```

Do not make these visually distracting.

A subtle dot, border, label, or icon is sufficient.

Also support a future:

```text
Show me the frontier
```

mode where established nodes fade and active/frontier topics become prominent.

---

# 13. Learning paths

Design the architecture so curated learning paths can be added later.

Example:

```text
Understanding Post-training

1. Pre-training
2. Instruction Tuning
3. SFT
4. Preference Data
5. Reward Models
6. PPO
7. RLHF
8. DPO
9. RLVR
10. Current research questions
```

Possible future learning paths:

```text
Understanding LLM inference

Understanding reasoning models

Understanding multimodal models

Understanding RL for language models

Understanding LLM agents
```

Do not necessarily build the full UI now, but structure the data so this is easy later.

---

# 14. Search

Add site-wide search if reasonably simple.

It should search:

- post titles
- topic names
- descriptions
- tags

A lightweight static search solution is preferred.

Possible options:

- Pagefind
- Fuse.js

Prefer Pagefind if compatible.

---

# 15. Math support

Support LaTeX-style equations.

Example Markdown:

```latex
$$
L(\theta) =
-\mathbb{E}_{(x,y)\sim D}
\log \pi_\theta(y|x)
$$
```

Use KaTeX or another static-friendly renderer.

---

# 16. Code support

Code blocks should have:

- syntax highlighting
- language labels
- copy button
- readable dark/light themes

Example:

```python
logits = model(input_ids).logits
```

Use Shiki if convenient within Astro.

---

# 17. Citations and papers

Build a simple paper-linking system.

Initially, articles can contain manual links.

Eventually it should be possible to define papers centrally:

```yaml
id: flashattention
title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness"
authors:
  - Tri Dao
year: 2022
arxiv: https://arxiv.org/abs/2205.14135
```

Then reference the paper from multiple topic pages/posts.

Do not overbuild this initially.

---

# 18. GitHub integration

Many posts will have associated experiments or repositories.

Support optional metadata:

```yaml
github: https://github.com/USERNAME/project
```

When present, display something like:

```text
Code for this article →
```

near the article title or conclusion.

---

# 19. About page

Create a minimal About page.

Placeholder content is fine.

Structure:

```text
About

I am a researcher interested in how large models are
trained, adapted, evaluated, and served.

My primary interests include:

- post-training
- reinforcement learning for LLMs
- inference
- multimodal models
- evaluation

This site is my public research notebook and an evolving
map of the modern deep-learning landscape.

Links:

GitHub
Google Scholar
X
LinkedIn
Email
CV
```

Use placeholders for personal URLs.

---

# 20. Research page

Create:

```text
/research/
```

with placeholder sections for:

```text
Publications

Selected Projects

Experiments

Research Interests
```

This page should eventually function as the research-portfolio portion of the site.

---

# 21. Writing index

Create:

```text
/writing/
```

Unlike the homepage, this page can look like a conventional blog archive.

Allow filtering by:

- topic
- article type
- difficulty

Each entry should display:

```text
Title

Short description

Date

Topics

Article type

Difficulty
```

---

# 22. SEO / sharing

Each article should generate appropriate:

- `<title>`
- meta description
- canonical URL
- Open Graph metadata
- Twitter/X card metadata

Build support for an article-specific social preview image later.

Use a default preview image for now.

---

# 23. RSS

Generate an RSS feed for all published writing.

Expected route:

```text
/rss.xml
```

---

# 24. Sitemap

Generate a sitemap automatically.

---

# 25. Analytics

Do not add invasive analytics.

If analytics are added, prefer a lightweight privacy-conscious solution.

For the initial version, analytics are optional.

---

# 26. Deployment

Set the project up to deploy automatically to GitHub Pages.

Desired workflow:

```text
push to main
↓
GitHub Action
↓
build site
↓
deploy to GitHub Pages
```

Include the appropriate GitHub Actions workflow.

Document any GitHub repository settings required.

---

# 27. Custom domain

Prepare the site to support a future custom domain such as:

```text
firstname-lastname.com
```

Do not assume the final domain yet.

Document how to configure:

- DNS
- GitHub Pages custom domain
- HTTPS
- Astro site/base configuration

---

# 28. Repository structure

Use a clean repository structure similar to:

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── LLMMap.astro
│   │   ├── MapNode.tsx
│   │   ├── ArticleCard.astro
│   │   ├── Breadcrumbs.astro
│   │   └── TopicPanel.astro
│   │
│   ├── content/
│   │   ├── writing/
│   │   └── topics/
│   │
│   ├── data/
│   │   ├── llm-map.ts
│   │   ├── learning-paths.ts
│   │   └── papers.ts
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ArticleLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── map.astro
│   │   ├── writing/
│   │   ├── topics/
│   │   ├── research.astro
│   │   └── about.astro
│   │
│   └── styles/
│       └── global.css
│
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

Adjust this structure if Astro conventions suggest something better.

---

# 29. Content collections

Use Astro content collections for writing and topic pages.

Validate frontmatter with schemas where practical.

Example conceptual schema:

```ts
title: string
description: string
date: Date
topics: string[]
type: string
level: string
draft: boolean
github?: string
```

Draft posts should not appear in production.

---

# 30. Initial sample content

Create enough placeholder/sample content to demonstrate the system.

Suggested sample topics:

```text
SFT
RLHF
GRPO
FlashAttention
Speculative Decoding
Multimodal Models
```

Create 2–3 placeholder posts, for example:

```text
Why does post-training exist?

Why is LLM inference memory-bound?

A map of modern LLM research
```

These can contain short placeholder text and should primarily demonstrate styling/navigation.

---

# 31. Map interaction v1

For the first working version, prioritize functionality over sophisticated visualization.

V1 should support:

1. Display major topic nodes.
2. Click a node.
3. Highlight its immediate connections.
4. Open a side panel with:
   - name
   - short description
   - maturity/status
   - prerequisites
   - related concepts
   - link to topic page
5. Allow return to full-map view.

The graph does not need perfect automatic layout initially.

A manually specified layout is acceptable.

---

# 32. Future map features

Architect the implementation so these can be added later without rewriting everything:

- animated traversal
- prerequisite mode
- learning paths
- frontier mode
- search-to-node
- zoomable subgraphs
- paper overlays
- timeline view
- field evolution view
- personalized "what should I learn next?"
- completion/bookmarking
- article-read indicators

Do not implement all of these in V1.

---

# 33. Important UX principle

The map should answer three different questions:

### Question 1

> What are the major areas of modern LLM research?

Use the overview graph.

### Question 2

> What should I learn next?

Use prerequisites and learning paths.

### Question 3

> What are researchers working on now?

Use frontier indicators and frontier questions.

Keep these three purposes in mind when designing the data model.

---

# 34. Mobile behavior

The site should remain usable on mobile.

For the graph:

- avoid requiring precise hover interactions
- tapping a node should work
- side panel can become a bottom sheet
- allow scrolling/panning
- provide a non-graph topic list as fallback

Do not sacrifice the desktop graph experience purely to make the graph fit into a tiny viewport.

---

# 35. Accessibility

Use:

- semantic HTML
- keyboard navigation
- sensible focus states
- adequate contrast
- descriptive links
- accessible labels for interactive graph nodes

The map should have a fallback hierarchical list so its content remains navigable without interacting with the visualization.

---

# 36. README

Create a useful README explaining:

```text
What this project is

Tech stack

How to install

How to run locally

How to create a post

How to create a topic

How to add a node to the map

How to deploy

How GitHub Pages is configured

How to configure a custom domain
```

Include exact commands.

For example:

```bash
npm install
npm run dev
npm run build
```

---

# 37. Developer experience

Optimize for easy content creation.

Adding a new post should ideally require only:

```text
1. Create Markdown/MDX file.
2. Add frontmatter.
3. Write article.
4. Push to GitHub.
```

Adding a map concept should ideally require editing one data file or creating one topic content file.

Avoid requiring changes in multiple unrelated files.

---

# 38. First implementation milestone

The first milestone should be small enough to finish quickly.

Deliver:

- Astro project
- GitHub Pages deployment
- homepage
- responsive layout
- dark mode
- Markdown/MDX writing
- math support
- code syntax highlighting
- writing archive
- topic pages
- basic interactive LLM map
- six sample map nodes
- two sample posts
- About page
- Research page
- RSS
- sitemap
- README

Do **not** spend significant time on advanced graph visualization before the basic site is deployed.

The priority is:

```text
Get something live
↓
Publish writing
↓
Improve the knowledge map incrementally
```

---

# 39. Suggested implementation order

Work in this order:

```text
1. Initialize Astro project.

2. Configure GitHub Pages.

3. Add global typography/layout.

4. Add content collections.

5. Implement article pages.

6. Implement writing archive.

7. Implement topic pages.

8. Create initial LLM taxonomy data.

9. Build simple interactive graph.

10. Embed graph prominently on homepage.

11. Add About and Research pages.

12. Add RSS / sitemap / metadata.

13. Test mobile responsiveness.

14. Test production build.

15. Deploy.

16. Document workflow in README.
```

---

# 40. Success criteria

The first version is successful if:

- I can open the deployed site from a GitHub Pages URL.
- I can write a Markdown post and publish it by pushing to GitHub.
- Math and code render correctly.
- I can click around the LLM map.
- Concepts link to topic pages.
- Posts link back into the conceptual map.
- The site looks good on desktop and is functional on mobile.
- It feels like a personal research notebook rather than a generic blog template.
- The codebase is simple enough that I can keep extending it without fighting the framework.

Prioritize simplicity, readability, and maintainability over feature completeness.
