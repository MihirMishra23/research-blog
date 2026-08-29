# Content model

The site uses Astro build-time content collections for writing and topics. Both collections are defined in `src/content.config.ts` and validated by schemas in `src/content/schemas.ts`.

## Single source of truth

A topic Markdown or MDX file is the canonical record for a concept. It owns:

- display name and summary;
- category, concept type, and maturity;
- parent and concept relationships;
- prerequisites and conceptual progression;
- optional problem, idea, consequence, limitation, and next-step orientation;
- frontier questions and paper links;
- optional hand-composed map geometry;
- explanatory topic-page prose in the document body.

Posts reference topics by their content IDs. Topic pages, article breadcrumbs, archive filters, and the interactive map should query those topic entries rather than repeat concept metadata in another file.

For example, `src/content/topics/speculative-decoding.md` has the content ID `speculative-decoding`. A post references it with:

```yaml
topics:
  - speculative-decoding
```

Adding a concept should normally require one new topic file. A separate data file may eventually define global map presentation settings or learning-path sequences, but it must not duplicate a topic's name, summary, maturity, or relationships.

## Writing collection

Writing lives in `src/content/writing/` as Markdown or MDX.

```yaml
---
title: 'Why does speculative decoding work?'
description: 'A conceptual and technical walkthrough of speculative decoding.'
date: 2026-08-28
topics:
  - inference-systems
  - speculative-decoding
tags:
  - decoding
level: intermediate
type: explainer
status: published
github: null
papers:
  - title: 'Fast Inference from Transformers via Speculative Decoding'
    url: https://arxiv.org/abs/2211.17192
    year: 2022
---
```

Supported article types:

- `explainer`
- `deep-dive`
- `experiment`
- `paper-notes`
- `research-note`
- `survey`
- `opinion`

Supported difficulty levels:

- `introductory`
- `intermediate`
- `advanced`

Supported publication statuses:

- `draft`
- `published`
- `archived`

`status` is the canonical publication control and defaults to `draft`. The optional legacy-compatible `draft` field may be omitted. When supplied, it must agree with `status`; contradictory metadata fails validation.

Production indexes, routes, feeds, and search must apply `shouldIncludeWriting()`. It admits only `published` entries that are not drafts. Development views may include every status.

## Topic collection

Topics live in `src/content/topics/` as Markdown or MDX.

```yaml
---
name: 'Speculative Decoding'
summary: 'A family of methods that verify multiple proposed tokens in parallel.'
category: inference-systems
type: method
status: active
problem: 'Autoregressive generation normally needs one target-model pass per token.'
idea: 'Draft several tokens cheaply, then verify the proposed block in parallel.'
consequence: 'One target-model pass can advance generation by several tokens.'
limitations: 'Low acceptance or expensive drafting can erase the latency gain.'
whatCameNext: 'New work explores self-drafting and serving-aware proposal strategies.'
prerequisites:
  - autoregressive-decoding
leadsTo:
  - medusa
  - eagle
frontierQuestions:
  - 'Which proposal architectures produce the best latency-quality tradeoff?'
map:
  x: 1120
  y: 370
---
```

Required core fields are `name`, `summary`, `category`, `type`, and maturity `status`. Relationship lists and richer orientation fields default to empty or remain optional so topics can be introduced incrementally.

The optional `problem`, `idea`, `consequence`, `limitations`, and `whatCameNext` fields populate the topic page's standard conceptual framework. Missing steps are omitted, so an early topic stub never renders empty headings. Longer explanations remain in the Markdown/MDX body.

The optional `mapLabel` provides the compact label used in the knowledge sketch. The `map` object stores the topic's manually authored V1 coordinates, hit-area dimensions, and small label offsets. Published topics included in the V1 map must provide this geometry. The typed composition and validation rules are documented in [LLM map data model](./map-data-model.md).

Supported maturity states:

- `foundational`: a durable prerequisite or framing idea that later concepts build on;
- `established`: well understood and broadly adopted, with stable core methods or evidence;
- `active`: in substantial current use or development, with important implementation or research questions still moving;
- `frontier`: early, rapidly changing work whose dominant approaches and evidence are not yet settled.

Maturity describes the state of the concept, not article quality or publication status. It is intentionally approximate and should be revised as the field changes.

Topic drafts remain visible in development but production routes and indexes must apply `shouldIncludeTopic()`.

## Content IDs

File-derived content IDs and all relationships use lowercase kebab case, such as:

```text
reward-models
speculative-decoding
vision-language-models
```

Schema validation rejects spaces, uppercase letters, underscores, duplicate IDs in the same relationship list, unsupported enum values, unknown frontmatter fields, invalid URLs, and contradictory draft metadata.

## Validation commands

```bash
npm test
npm run check
npm run build
npm run verify:map-model
```

The schema tests exercise valid metadata, deliberately invalid metadata, default values, and production visibility behavior. Astro validates actual collection entries during content synchronization and production builds.

## Current paper-linking scope

Paper links are structured manually with a title, URL, and optional year. This is intentionally small. A central paper registry can replace repeated links later without changing the topic or writing collection boundaries.
