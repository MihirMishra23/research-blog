# Map layout baseline

Status: complete for Post-V1 Map Action 2.1.

This note measures the limits of the current hand-authored V1 geometry before a scalable layout approach is selected. It uses the built production model in `dist/map-data.json`, the approved 20-topic canonical inventory, and browser checks at desktop and mobile viewports.

## Measurement method

- Bubble bounds use the renderer-neutral node width and height as conservative axis-aligned rectangles.
- Required canvas dimensions use the visible content bounds plus 64 units of outer padding on every side.
- Edge paths reproduce the renderer's deterministic quadratic curve and sample it at 24 intervals.
- An edge-to-node intrusion means a sampled edge enters an unrelated bubble's bounds plus 16 units of label clearance.
- Edge crossings exclude pairs that intentionally share an endpoint.
- Removal scenarios delete one production topic and its incident edges while preserving the root and area nodes.
- Addition analysis uses the approved canonical topics without inventing coordinates. A dimension is reported as unresolved when the V1 model cannot produce geometry.

Run `npm run measure:map-layout` after a production build to reproduce the structured measurements.

## Current production baseline

| Measure                              | Result      |
| ------------------------------------ | ----------- |
| Production topics                    | 6           |
| Root + area + topic nodes            | 10          |
| Edges                                | 12          |
| Fixed V1 canvas                      | 1536 × 994  |
| Content bounds                       | 1320 × 747  |
| Required canvas with 64-unit padding | 1448 × 875  |
| Bubble-area density                  | 11.1%       |
| Minimum bubble clearance             | 34.5 units  |
| Bubble collisions                    | 0           |
| Unrelated edge crossings             | 0           |
| Edge-to-node clearance violations    | 1           |
| Longest sampled edge                 | 303.2 units |

The one edge-clearance failure is `contains:area-post-training:sft` entering RLHF's 16-unit clearance zone. This is a geometry defect, not a taxonomy defect: the SFT and RLHF relationship is valid, but that particular area branch is routed too close to the RLHF label.

## Removal sensitivity

The V1 canvas remains fixed at 1536 × 994 in every case. The table shows what the content would require if the canvas were fitted to the remaining nodes with 64-unit padding.

| Removed topic        | Required width | Required height |
| -------------------- | -------------: | --------------: |
| None                 |           1448 |             875 |
| FlashAttention       |           1448 |             858 |
| GRPO                 |           1448 |             875 |
| Multimodal Models    |           1448 |             751 |
| RLHF                 |           1448 |             875 |
| SFT                  |           1286 |             875 |
| Speculative Decoding |           1208 |             875 |

Removing an extremal topic changes the required content dimensions substantially, but the implementation never recomputes its canvas. Removing an interior topic changes neither fixed canvas dimension. The current system therefore cannot fit the viewport to its actual content.

## Approved expansion failure

The approved taxonomy has 20 topics, so the current production map must eventually add 14.

- All 14 additions lack required V1 hand-authored positions.
- Eight additions belong to Models, Memory, Agents, or Interpretability, which have no V1 area geometry.
- `findMapModelErrors()` correctly refuses to render those additions.
- Because canvas size is a constant rather than layout output, the V1 system cannot calculate a required expanded canvas.

This is the decisive scaling failure: adding an ordinary reviewed topic requires editing both topic coordinates and, for a new area, source-code area geometry. The failure occurs before crowding can even be measured in the renderer.

## Desktop and mobile observations

The local rendered map was checked at 1440 × 1000 and 390 × 844.

- At 1440 px, the drawing rendered at approximately 878 × 568 with no horizontal overflow or document-level overflow.
- At 390 px, the map correctly avoided document-level overflow by placing a 992 × 642 drawing in its scroll region.
- The 390 px viewport has 602 px of possible horizontal travel. Initial load centers the map at scroll position 301 and keeps the LLM root visible.
- The visual map provides scroll/pan through the native overflow region but no explicit pan, zoom, reset, or fit controls.
- The fixed bottom detail panel can occupy up to 72% of viewport height after selection.
- The complete semantic fallback remains usable without SVG interaction.

The current mobile behavior is functional for six topics but navigation cost will rise with a larger canvas. Section 2 must preserve readable labels and deterministic geometry; explicit pan and zoom remain scoped to Section 3.

## Geometry versus taxonomy

### Taxonomy findings

- The uneven 5:1 largest-to-smallest area count is approved and must not be “fixed” with filler topics.
- All 20 concepts have a semantic area and at least one intentional hierarchy or topic relationship.
- GRPO's four-neighbor hub and the retained cross-area comparisons were already editorially approved.

### Geometry findings

- Canvas dimensions are fixed instead of derived from current content.
- Four approved areas have no geometry.
- Normal additions cannot render without manual coordinates.
- One current connector violates unrelated-label clearance.
- Minimum bubble clearance is only 34.5 units.
- Mobile navigation depends on a wide scroll surface whose travel grows with the canvas.

The taxonomy determines what must be placed; it does not cause the placement failures above.

## Measurable layout constraints

The approaches evaluated in Action 2.2 and implemented in 2.3 must satisfy these constraints for the complete current taxonomy and for single-node add/remove scenarios:

1. **Outer padding:** at least 64 layout units between visible node bounds and every canvas edge.
2. **Bubble clearance:** at least 40 units between unrelated visible bubble bounds.
3. **Label clearance:** an edge must remain at least 16 units outside every unrelated node/label envelope.
4. **Edge crossings:** zero crossings between edges that do not share an endpoint in the initial overview.
5. **Area separation:** at least 64 units between unrelated area-cluster envelopes.
6. **Edge length:** prefer at most 360 units; any edge over 480 units requires a routed waypoint or a documented layout exception.
7. **Initial density:** total visible bubble area must remain at or below 18% of canvas area. This is a ceiling, not a target.
8. **Label fit:** generated bubble dimensions must include measured label width plus at least 20 horizontal and 12 vertical units of internal space.
9. **Hit targets:** interactive bounds remain at least 72 × 72 CSS-equivalent units even when the visible bubble is smaller.
10. **Dynamic canvas:** width and height derive from placed content plus padding; no expected topic count or fixed inventory dimensions may participate in the calculation.
11. **Readable responsive behavior:** layout must not shrink labels to make the entire expanded graph fit a phone. Native horizontal navigation and the semantic fallback remain available until Section 3 adds explicit viewport controls.

These values are intentionally stricter than the measured V1 baseline where the baseline already exhibits a defect. They provide testable acceptance criteria without selecting an algorithm in advance.
