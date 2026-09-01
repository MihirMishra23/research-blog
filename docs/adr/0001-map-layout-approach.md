# ADR 0001: Use a custom deterministic hybrid map layout

- Status: accepted
- Date: 2026-08-31
- Applies to: Post-V1 Map Actions 2.2–2.4

## Context

The approved map contains 20 topics in seven uneven areas. The V1 renderer requires hand-authored coordinates, has a fixed canvas, and cannot place 14 approved additions. The replacement must preserve the root → area → topic reading order, bubble labels, intentional relationships, static SVG output, and stable visual geography.

Action 2.2 compared two build-time prototypes using the same canonical inventory, label-aware node boxes, 40 graph edges, and the constraints in [the layout baseline](../map-layout-baseline.md):

1. a small custom radial pass with fixed area sectors and count-derived topic fans;
2. `@dagrejs/dagre` 3.1.1 using a left-to-right hierarchical layout over the structural root/area/topic edges.

Both prototypes serialize ordinary node coordinates and edge routes. Neither uses a client-side force simulation or changes the production map in this action.

## Measured comparison

Run `npm run evaluate:map-layout-approaches` to reproduce the full result.

| Measure                                                | Custom radial | Dagre hierarchical |
| ------------------------------------------------------ | ------------: | -----------------: |
| Canvas for 20 topics                                   |   1755 × 1705 |         924 × 2428 |
| Bubble density                                         |          8.9% |              11.9% |
| Minimum bubble clearance                               |          10.7 |                 56 |
| Bubble collisions                                      |             0 |                  0 |
| Unrelated edge/label intrusions                        |             7 |                 11 |
| Unrelated edge crossings                               |             8 |                  1 |
| Existing nodes moved after removing CLIP               |       2 of 27 |           25 of 27 |
| Existing nodes moved after adding one multimodal probe |       1 of 28 |           26 of 28 |
| Deterministic across identical runs                    |           yes |                yes |

The custom prototype is not the finished geometry. Its clearance and relationship routing failures prove that Action 2.3 needs an explicit collision/clearance pass and an edge router. Dagre's stronger basic node separation does not solve intentional semantic routing: the cross-topic edges still pass through unrelated labels when laid over the hierarchy.

## Dependency and delivery cost

- Dagre and its Graphlib dependency occupy about 2.2 MiB unpacked in the local development install.
- Dagre's minified distribution is about 49 KiB, or about 17 KiB compressed, but this project would execute it only while building. The browser cost is therefore zero for either approach.
- Dagre offers a maintained general-purpose rank layout and reduces the amount of basic hierarchy code maintained here.
- A custom pass is narrower: seven stable area sectors, label-aware topic placement, a deterministic clearance pass, and explicit route/override handling. It keeps the radial visual language and makes editorial geometry a first-class concern.

The library comparison remains a development-only dependency through the layout implementation so the benchmark is reproducible. It must not be imported by page or component code and can be removed after the hybrid implementation has replaced the comparison fixture.

## Decision

Use a small custom deterministic build-time layout as the foundation for Action 2.3, then combine it with:

- label-aware generated bubble dimensions;
- stable area sectors and stable sibling ordering;
- local collision and clearance correction rather than whole-graph reflow;
- a canvas fitted to current content plus required padding;
- intentional relationship routing and optional authored waypoints;
- optional coordinate overrides for editorially important cases.

Emit the result as renderer-neutral static geometry consumed by the existing server-rendered SVG and semantic text view. Do not add a client-side layout runtime or force simulation.

## Why Dagre is not the primary engine

Dagre accepts real node width and height and produces deterministic static coordinates, so it is a valid general hierarchy option. For this map, however, its ranked result replaces the approved radial visual with a tall column, creates broad position churn after a local taxonomy edit, and cannot by itself preserve the intended routes for non-hierarchical topic relationships. Correcting those properties would require a substantial custom layer around the library, erasing its maintenance advantage.

## Consequences

- Action 2.3 owns the missing collision/clearance and relationship-routing passes; the raw radial prototype cannot be promoted to production.
- Stable geography is measured relative to the root so a fitted canvas translation does not count as graph reflow.
- Ordinary additions may reposition siblings in the same area, but must not reposition unrelated areas.
- Bubble dimensions influence placement. Topics are never treated as dimensionless points.
- Edge waypoints and coordinate overrides remain serializable and testable.
- The existing accessible static rendering path is preserved.
