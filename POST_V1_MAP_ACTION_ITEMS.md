# Post-V1 Map Action Items

Source: the first three items in the “Explicitly deferred until after V1” section of [IMPLEMENTATION_ACTION_ITEMS.md](./IMPLEMENTATION_ACTION_ITEMS.md).

This is the ordered plan for the post-V1 work Mihir currently cares about:

1. populate the taxonomy beyond the six demonstration concepts;
2. introduce automatic graph layout where it improves maintainability;
3. add animated traversal, zoomable subgraphs, and timeline or field-evolution views.

The three workstreams are intentionally sequential. A useful taxonomy is required before evaluating layout, and a stable layout/navigation model is required before adding advanced views.

## Definition of done

This post-V1 map milestone is complete when:

- the map represents a useful cross-section of the LLM field rather than six demonstration nodes;
- every visible concept is backed by a permanent topic page and canonical topic metadata;
- layout remains readable without lines crossing labels or unrelated bubbles;
- routine topic additions do not require manually repositioning most existing nodes;
- users can pan, zoom, isolate subgraphs, and follow conceptual progressions with a keyboard, pointer, or touch;
- timeline or field-evolution mode communicates authored historical relationships without pretending that disputed chronology is objective;
- animation respects reduced-motion preferences, and all map content remains available through ordinary links and the semantic text view;
- the production build, content validation, graph validation, accessibility checks, and live deployment tests pass.

## Working rules

- Topic Markdown or MDX remains the canonical source for names, summaries, maturity, relationships, and article connections.
- Each edge must express an intentional relationship. More nodes do not justify visual or semantic noise.
- Lines must terminate at bubble boundaries and must not pass through topic labels or unrelated nodes.
- Automatic layout may propose geometry, but stable authored overrides remain available for editorially important placements and routes.
- Do not add a heavy graph framework until a measured requirement exceeds the current SVG implementation.
- Every interactive feature must preserve a server-rendered, non-graph route to the same information.
- Mihir writes all publishable article-body prose. AI may assist with topic names, taxonomy, graph relationships, layout, code, schemas, and tooling.

## 1. Expand the taxonomy

### 1.1 Define the target coverage

- [x] Choose the field areas that should appear in the next map release.
- [x] Decide whether the existing category vocabulary is sufficient or needs carefully named additions.
- [x] Set a target concept count for the release so taxonomy work has a clear stopping point.
- [x] Define inclusion criteria: conceptual importance, explanatory usefulness, durable identity, and at least one meaningful connection.
- [x] Define exclusion criteria for vendor features, short-lived terminology, duplicate aliases, and concepts too broad to map usefully.

**Gate:** complete. The reviewed scope and provisional 36-concept inventory are recorded in [Post-V1 taxonomy scope](./docs/post-v1-taxonomy-scope.md); no new nodes enter production before Action Item 1.2 resolves canonical IDs and relationships.

### 1.2 Draft the canonical taxonomy

- [ ] Assign every candidate a stable lowercase kebab-case ID, display name, short map label, category, concept type, and maturity.
- [ ] Merge aliases and near-duplicates into a single canonical topic where appropriate.
- [ ] Give every concept a concise summary and identify its parent or area membership.
- [ ] Author only relationships that can be named precisely as hierarchy, prerequisite, progression, or related.
- [ ] Make `related` and progression relationships reciprocal according to the existing content rules.
- [ ] Flag uncertain or disputed relationships for editorial review instead of encoding them as settled facts.

**Gate:** the reviewed taxonomy inventory uses schema-compatible IDs and relationships; concepts are not promoted into topic files until their current-layout geometry is also ready.

### 1.3 Add the topic pages in controlled batches

- [ ] Add one area-sized batch at a time rather than importing the entire taxonomy at once.
- [ ] Keep new topics as drafts until their metadata, links, and map placement are reviewed.
- [ ] Give every topic file valid geometry in an existing mapped area so local development and map previews continue to build before automatic layout exists.
- [ ] Create permanent topic pages with questions, sources, and clearly labeled placeholder material where complete notes do not yet exist.
- [ ] Connect existing and new articles through topic IDs without generating article-body prose.
- [ ] Review aliases and search terms so each concept is discoverable through common terminology.
- [ ] Run content, topic, reference, search, and production checks after every batch.

**Gate:** every production node resolves to a useful topic page and every relationship target exists.

### 1.4 Validate the taxonomy as a whole

- [ ] Review category balance so one crowded area does not dominate the map unintentionally.
- [ ] Identify orphan nodes, redundant nodes, weak relationships, and overly connected hubs.
- [ ] Confirm maturity labels still describe the concepts rather than the completeness of their topic pages.
- [ ] Confirm the semantic text view exposes the complete taxonomy without JavaScript or SVG interaction.
- [ ] Record taxonomy decisions and disputed boundaries in a dedicated design note.

**Gate:** Mihir approves the taxonomy before automatic layout becomes the source of initial positions.

## 2. Introduce a scalable layout system

### 2.1 Measure the limits of the current layout

- [ ] Render the expanded taxonomy using the current 1536×994 authored canvas.
- [ ] Record collisions, label crossings, excessive edge length, dense areas, and mobile navigation problems.
- [ ] Set measurable layout constraints for node spacing, label clearance, edge crossings, area separation, and maximum initial canvas density.
- [ ] Separate problems caused by weak taxonomy from problems caused by geometry.

**Gate:** layout requirements are written from real expanded-map failures rather than assumptions.

### 2.2 Evaluate layout approaches

- [ ] Prototype at least a deterministic hierarchical or radial layout that preserves root → area → topic structure.
- [ ] Evaluate a lightweight layout library against a small custom layout pass; include bundle size, build-time use, determinism, edge routing, and maintenance cost.
- [ ] Prefer build-time layout that emits static SVG geometry over a client-side force simulation.
- [ ] Test whether the system can preserve stable positions when one topic is added or removed.
- [ ] Verify that topic label dimensions influence placement instead of treating nodes as points.
- [ ] Reject any approach that makes intentional edge routing or accessible static rendering impractical.

**Gate:** an architecture decision record selects a layout approach and explains why a heavier framework is or is not justified.

### 2.3 Implement hybrid geometry

- [ ] Extend the renderer-neutral map model with generated positions that remain serializable and testable.
- [ ] Keep optional per-topic coordinate overrides for editorially important placement.
- [ ] Keep authored edge waypoints for exceptional cross-category routes.
- [ ] Add collision detection for bubbles, labels, area boundaries, and routed edges.
- [ ] Make layout output deterministic for identical content so builds and visual reviews remain stable.
- [ ] Add a development-only layout diagnostic view showing bounds, collisions, edge types, and generated versus overridden geometry.

**Gate:** adding a normal topic produces a readable initial position without manually moving unrelated nodes.

### 2.4 Preserve visual intent and accessibility

- [ ] Keep bubble shapes, editorial typography, restrained red accents, and dotted-paper background consistent with the current map.
- [ ] Route every edge to a bubble boundary and prevent it from crossing labels or unrelated bubbles.
- [ ] Retain minimum pointer and touch target sizes after scaling.
- [ ] Verify the map at desktop, tablet, and mobile viewport sizes in light and dark themes.
- [ ] Confirm the semantic text view remains complete and ordered meaningfully.
- [ ] Add snapshot or invariant tests for stable geometry, collision absence, and valid edge endpoints.

**Gate:** the scalable layout is clearer than the V1 authored layout at the expanded concept count.

## 3. Add advanced map exploration

### 3.1 Add pan and zoom foundations

- [ ] Define minimum and maximum zoom levels and a predictable initial viewport.
- [ ] Add pointer, trackpad, touch, and keyboard pan/zoom controls.
- [ ] Add visible zoom in, zoom out, reset, and fit-to-view controls with accessible names.
- [ ] Keep browser page zoom and page scrolling usable; map gestures must not trap normal navigation.
- [ ] Preserve focused-node visibility when the viewport changes.
- [ ] Announce material viewport or selection changes to assistive technology only when useful.

**Gate:** users can reach and inspect every node without precision pointing or gesture-only controls.

### 3.2 Add zoomable subgraphs

- [ ] Define subgraph boundaries for areas, selected nodes, and immediate conceptual neighborhoods.
- [ ] Let users enter an area or selected-node subgraph and return through a visible breadcrumb or overview control.
- [ ] Keep the URL synchronized with meaningful subgraph state so views can be linked and restored.
- [ ] Decide which cross-boundary edges remain visible and how hidden external connections are summarized.
- [ ] Keep topic-page navigation distinct from “inspect this subgraph” interaction.
- [ ] Ensure browser Back and Forward restore prior map states.

**Gate:** subgraphs reduce visual complexity without hiding the existence of relevant external connections.

### 3.3 Add animated traversal

- [ ] Define authored traversal paths from existing prerequisite and progression relationships.
- [ ] Provide explicit start, next, previous, pause, and exit controls.
- [ ] Animate viewport and emphasis changes without moving stable node positions unnecessarily.
- [ ] Use short, interruptible transitions and respect `prefers-reduced-motion` with immediate state changes.
- [ ] Keep focus order and screen-reader context synchronized with the current traversal step.
- [ ] Avoid presenting every relationship as a recommended learning path.

**Gate:** traversal clarifies an authored conceptual sequence and remains fully usable with animation disabled.

### 3.4 Model timeline and field evolution

- [ ] Define the minimum historical metadata needed for a timeline, such as first publication year, date confidence, predecessor, and influence notes.
- [ ] Keep historical dates and claims sourced; represent ranges or uncertainty when a single date would be misleading.
- [ ] Separate chronological sequence from conceptual prerequisite and from current maturity.
- [ ] Extend the renderer-neutral model without making timeline fields mandatory for every topic.
- [ ] Add validation for impossible dates, missing sources, and invalid historical targets.
- [ ] Decide how simultaneous, convergent, or disputed developments appear.

**Gate:** timeline data has explicit semantics and sources before any timeline UI is built.

### 3.5 Build and verify the evolution view

- [ ] Add a clear control for switching between conceptual map and field-evolution views.
- [ ] Preserve topic identity, permanent links, and selection state across compatible view changes.
- [ ] Allow filtering by area or time range without removing the complete text alternative.
- [ ] Use motion to communicate state transitions only; do not animate for decoration.
- [ ] Test keyboard, screen reader, touch, reduced motion, contrast, responsive behavior, and browser history.
- [ ] Add generated-output and live smoke tests for deep-linked subgraphs and timeline states.

**Gate:** the advanced views add explanatory value while the default map remains understandable and fast.

## Release sequence

1. Ship expanded taxonomy and topic pages behind the current authored layout where space permits.
2. Ship deterministic hybrid layout after it passes visual and geometry gates.
3. Ship pan and zoom before subgraphs.
4. Ship subgraphs before animated traversal.
5. Ship timeline metadata before the field-evolution UI.
6. Perform a production accessibility and live deployment audit after each release rather than combining all advanced interactions into one launch.

## Explicitly outside this plan

This file does not schedule learning-path personalization, frontier mode, citation infrastructure, bookmarks or completion tracking, article-specific social images, analytics, or multi-author features. Those remain deferred unless Mihir deliberately brings them into scope later.
