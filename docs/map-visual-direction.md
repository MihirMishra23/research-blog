# Map visual direction

This document records the approved visual direction for the interactive LLM map. The attached reference supplied on 2026-08-28 is the visual source of truth.

## Core character

The map should feel like an editorial research diagram composed on dotted notebook paper. It is manually arranged, visibly exploratory, and refined enough to match the surrounding publication. It should not resemble a dashboard, flowchart library, network-analysis tool, or collection of UI cards.

The target impression is:

- editorial and manually composed;
- radial and associative;
- technically dense but approachable;
- monochrome ink with sparse red annotations;
- imperfect enough to feel authored, while remaining readable and interactive.

## Composition

Use a stable radial hierarchy:

1. Place `LLMs` in an irregular central oval.
2. Place major areas around it in their own irregular ovals.
3. Enclose every topic concept in a smaller irregular bubble so the map reads as a connected node diagram rather than annotated branches.
4. Connect each major area to the center with a short organic stroke.
5. Extend individual concepts outward as clean sans-serif bubbles connected by branch strokes.
6. Allow selected concepts to branch again where a method has important descendants, such as speculative decoding leading to Medusa and EAGLE.

The composition should be manually positioned in V1. Slight asymmetry, varied branch lengths, and uneven spacing are desirable when they strengthen the authored quality. Avoid automatic layouts that constantly move or optimize the drawing into a regular grid.

## Visual vocabulary

### Canvas

- Warm off-white paper in light mode.
- Near-black paper in dark mode, with softened light ink rather than pure white.
- A quiet, evenly spaced dot grid.
- No gradient, glow, shadow field, or animated background.

### Strokes

- Predominantly black/ink-colored outlines and connectors.
- Rounded caps and joins.
- Slightly irregular curves instead of mechanically perfect circles and straight lines.
- Root, category, and topic bubbles should be hand-shaped SVG paths, not pill components.
- Selected or related paths may become marginally heavier, but should not turn into neon or glowing edges.

### Typography

- Use the site's editorial display serif for the LLM root and category bubbles.
- Use the site's system sans-serif stack for topic bubbles.
- Vary label sizes by hierarchy: center, category, concept, then annotation.
- Do not rotate labels merely for decoration; readability takes priority.

### Red marks

Red is the only strong map accent.

Use it sparingly for:

- a short row of dots indicating progression;
- frontier or active-research markers;
- current selection;
- small annotation marks.

Do not fill entire nodes red or apply red to every connection.

## Interaction behavior

Interaction should preserve the appearance of a drawing:

- Make the visible lettering/oval the hit target, with a larger invisible SVG hit area where needed.
- On hover or keyboard focus, subtly strengthen the node outline and immediate connector strokes.
- On selection, use a small red mark or dot sequence plus the stronger ink state.
- Open metadata in the separate detail panel instead of placing card-like popovers over the drawing.
- Keep the unselected map visible so users retain spatial context.
- Use native buttons or equivalent accessible SVG controls with clear labels and focus treatment.

## Responsive behavior

The desktop composition is primary. On smaller screens:

- preserve the drawing's scale and allow deliberate horizontal panning/scrolling;
- avoid shrinking all labels until they become unreadable;
- place the detail panel in a bottom sheet;
- provide the hierarchical topic-list fallback immediately after the graph;
- ensure all tap targets are comfortably larger than the visible labels.

## Implementation guardrails

- Prefer lightweight SVG with manually authored paths and positions.
- Keep graph data separate from drawing geometry and interaction state.
- Consume the renderer-neutral model documented in [LLM map data model](./map-data-model.md); do not duplicate topic metadata or edges inside the SVG component.
- It is acceptable to use a small rough-stroke helper if it produces deterministic static output and does not materially increase the client bundle.
- Do not use default React Flow nodes, generic rounded rectangles, physics-based force layouts, glossy status badges, or card grids.
- Do not trace the reference image as a background. Recreate its visual grammar with semantic, interactive SVG.

## V1 visual acceptance criteria

The map is visually ready when:

- a side-by-side glance immediately recalls the approved reference;
- the center → category → concept hierarchy is obvious without instructions;
- the dotted-paper canvas, editorial labels, irregular ovals, and organic branch strokes remain visible in both themes;
- red marks are noticeable but rare;
- the map still looks hand-composed after selection and highlighting states are applied;
- desktop, keyboard, and mobile fallback behavior meet the functional map requirements.

The implemented V1 interaction and responsive behavior are documented in [Interactive map V1](./map-interaction.md).
