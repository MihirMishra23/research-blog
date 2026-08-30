# Interactive map V1

The reusable `LlmMap.astro` component renders the typed model from `src/content/map-model.ts` as a progressively enhanced SVG knowledge map. The temporary `/map-preview/` route is its integration surface until action item 12 places the same component on the homepage and focused `/map/` route.

## Visual construction

- A stable 1536 × 994 viewBox preserves the hand-composed positions from topic frontmatter.
- The central LLM node and three major areas use deterministic, slightly asymmetric SVG paths rather than perfect ellipses or UI pills.
- Topic concepts use clean system sans-serif labels enclosed by irregular bubbles with transparent minimum 72-unit hit regions.
- Curved hierarchy and progression connectors are derived from typed edges, stop at the true label or oval boundary, and receive deterministic small bends.
- A quiet SVG pattern creates the dotted-paper canvas in both themes.
- Red is limited to progression dots, active/frontier markers, and the selected-node mark.
- The LLM root and major areas reuse the site's editorial display serif; topic concepts use the site's system sans-serif stack. No map-specific webfont is loaded.

No graph library, force layout, hydrated framework component, traced background image, gradient, or animated canvas is involved.

## Interaction contract

Every root, area, and topic node is a normal SVG link. Without JavaScript, activating it navigates to the topic index, category anchor, or permanent topic page.

With JavaScript:

1. Pointer click, Enter, or Space selects a node.
2. The selected node, its one-edge neighbors, and their edges remain strong while unrelated marks recede.
3. The detail panel updates with the node description and link.
4. Topic selections additionally show maturity, prerequisites when present, and immediate concept relationships.
5. “Return to overview” or Escape clears the selection and restores focus to the triggering node.

Modified clicks keep ordinary link behavior so users can open topic pages in another tab.

The overview deliberately omits non-hierarchical `related` edges. When either endpoint is selected, the relevant relationship appears as a thin solid red connection and is named in the detail panel. This keeps the overview readable without discarding cross-category exploration. Long selected relationships use authored outside waypoints so they never pass through topic labels.

## Responsive behavior

The desktop canvas and detail panel form a two-column workspace. At small viewports, the SVG keeps a readable minimum width inside a labeled horizontal scroll region, which is initially centered near the map root. Selecting a node promotes the detail panel to a fixed bottom sheet; clearing the selection returns it to normal document flow.

The SVG's minimum 72-unit hit areas render at approximately 46 CSS pixels at the mobile canvas scale.

## Semantic fallback

A visible hierarchical list follows the graph. It groups all six concepts under the same three area nodes, uses permanent topic links, and exposes maturity text. The list is server-rendered and does not depend on JavaScript or SVG interpretation.

## Verification

```bash
npm test
npm run check
npm run build
npm run verify:map-model
npm run verify:map
```

The generated-output check asserts the node and edge counts, permanent topic links, SVG title and description, one irregular bubble per node, red marks, editorial typography, detail fields, semantic fallback, and homepage preview link. Browser checks cover selection neighborhoods, reset and Escape behavior, keyboard Space activation, light/dark themes, horizontal panning, mobile bottom-sheet behavior, and document overflow.
