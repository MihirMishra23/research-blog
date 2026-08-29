# LLM map data model

The V1 knowledge map is renderer-neutral static data. Topic Markdown remains the canonical source for concept meaning; `src/content/map-model.ts` composes those entries into typed nodes and edges for the SVG component planned in action item 11.

## Data flow

```text
topic Markdown / MDX
  ├─ canonical name, summary, category, maturity, relationships
  └─ editable map label and V1 position
                 ↓
       createLlmMapModel()
                 ↓
 root + areas + topic nodes + derived edges
                 ↓
       /map-data.json (build artifact)
```

Rendering and interaction code must consume the composed model rather than repeat node metadata or relationship lists.

## Node layers

The model has three node kinds:

- `root`: the central `LLMs` oval;
- `area`: manually positioned major-area ovals such as Post-training and Inference systems;
- `topic`: the six initial concepts, linked to their permanent topic routes.

Every topic node includes a stable content ID, URL slug and href, short map label, category, description, maturity, prerequisites, relationship groups, and manually authored position. The `mapLabel` and `map` fields live beside the canonical topic metadata because they are properties of that concept, not properties of an SVG implementation.

Example topic geometry:

```yaml
mapLabel: 'Speculative Decoding'
map:
  x: 1235
  y: 355
  width: 245
  height: 50
  labelOffsetX: 0
  labelOffsetY: 2
```

Coordinates use the stable 1536 × 994 V1 canvas. They intentionally preserve a hand-composed radial layout instead of feeding a force-layout engine.

## Edge derivation

`createLlmMapModel()` derives stable edge IDs from canonical data:

- `contains`: root → area and area → topic hierarchy;
- `progression`: directed `leadsTo` relationships;
- `prerequisite`: directed prerequisite relationships not already represented by the same progression;
- `related`: normalized, undirected topic relationships.

The initial model includes SFT → RLHF and SFT → GRPO progression, the RLHF ↔ GRPO relationship, the FlashAttention ↔ Speculative Decoding systems relationship, and a FlashAttention ↔ Multimodal Models cross-category exploration link.

## Validation

`findMapModelErrors()` rejects duplicate topic IDs, missing V1 positions, positions outside the canvas, categories without area geometry, and relationships whose target is absent from the map. `createLlmMapModel()` refuses to produce data when any error exists.

The build emits `/map-data.json`. `npm run verify:map-model` confirms that every topic node points to a generated `/topics/[slug]/` page, all edge endpoints exist, IDs are unique, geometry is finite, and the required demonstration edges are present.

## Extension boundary

The model contains an empty, renderer-agnostic `extensions` record reserved for later learning paths, frontier mode, paper overlays, and taxonomy layers. Those features deliberately have no UI, behavior, or frozen schema in V1. Adding more taxonomy requires adding topic entries and the corresponding editable area geometry; it does not require changing the renderer's node contract.
