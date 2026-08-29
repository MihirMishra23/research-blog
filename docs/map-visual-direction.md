# Map visual direction

This document records the approved visual direction for the interactive LLM map. The attached reference supplied on 2026-08-28 is the visual source of truth.

## Core character

The map should feel like a working research sketch made on dotted notebook paper. It is intentionally informal, manually composed, and visibly exploratory. It should not resemble a dashboard, flowchart library, network-analysis tool, or collection of UI cards.

The target impression is:

- hand-drawn;
- radial and associative;
- technically dense but approachable;
- monochrome ink with sparse red annotations;
- imperfect enough to feel authored, while remaining readable and interactive.

## Composition

Use a stable radial hierarchy:

1. Place `LLMs` in an irregular central oval.
2. Place major areas around it in their own irregular ovals.
3. Connect each major area to the center with a short organic stroke.
4. Extend individual concepts outward as handwritten labels connected by branch strokes.
5. Allow selected concepts to branch again where a method has important descendants, such as speculative decoding leading to Medusa and EAGLE.

The composition should be manually positioned in V1. Slight asymmetry, varied branch lengths, and uneven spacing are desirable when they improve the sketched quality. Avoid automatic layouts that constantly move or optimize the drawing into a regular grid.

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
- Major-category ovals should be hand-shaped SVG paths, not pill components.
- Selected or related paths may become marginally heavier, but should not turn into neon or glowing edges.

### Lettering

- Use a locally served, open-source handwritten face with an Excalidraw-like character for map labels.
- Keep the editorial serif and monospace system for the surrounding site UI.
- Vary map label sizes by hierarchy: center, category, concept, then annotation.
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
- ensure all tap targets are comfortably larger than the visible handwriting.

## Implementation guardrails

- Prefer lightweight SVG with manually authored paths and positions.
- Keep graph data separate from drawing geometry and interaction state.
- It is acceptable to use a small rough-stroke helper if it produces deterministic static output and does not materially increase the client bundle.
- Do not use default React Flow nodes, generic rounded rectangles, physics-based force layouts, glossy status badges, or card grids.
- Do not trace the reference image as a background. Recreate its visual grammar with semantic, interactive SVG.

## V1 visual acceptance criteria

The map is visually ready when:

- a side-by-side glance immediately recalls the approved reference;
- the center → category → concept hierarchy is obvious without instructions;
- the dotted-paper canvas, handwritten labels, irregular ovals, and organic branch strokes remain visible in both themes;
- red marks are noticeable but rare;
- the map still looks hand-composed after selection and highlighting states are applied;
- desktop, keyboard, and mobile fallback behavior meet the functional map requirements.
