# Post-V1 taxonomy audit

Status: **awaiting Mihir's approval** for Post-V1 Map Action 1.4.

This design note audits the current canonical inventory as a graph and as an editorial taxonomy. It does not assess topic-page prose completeness. The machine-readable source remains [post-v1-canonical-taxonomy.json](./post-v1-canonical-taxonomy.json).

## Decision summary

- Keep all seven areas. Their uneven sizes reflect the current concepts rather than a quota; do not add filler topics to equalize the map.
- Keep all 20 current concepts. Alias review found no duplicate nodes, and the close pairs below have distinct boundaries.
- Keep GRPO as the most connected topic. Its four neighbors are justified by two progressions and two method-family comparisons; it is not an accidental catch-all hub.
- Remove the FlashAttention ↔ Speculative Decoding related edge. Their shared Inference area already represents the broad performance connection, so a direct edge overstated the relationship.
- Retain the narrower cross-area comparisons Delta Attention ↔ FlashAttention and Limited Memory Language Models ↔ Mem0.
- Keep Omni-family Models in editorial review. One representative source is not yet sufficient to settle a cross-family umbrella boundary.
- Treat maturity and page readiness as independent fields. A draft topic can be established, active, or frontier.

## Complete semantic taxonomy

This is the complete, non-interactive text view of the current taxonomy. It requires no JavaScript or SVG. Each topic includes its stable ID, concept type, maturity, and direct topic relationships; area membership is expressed by the heading.

### Models — 3

- **Delta Attention** (`delta-attention`) — method · frontier. Related: FlashAttention.
- **Grouped-Query Attention (GQA)** (`grouped-query-attention`) — architecture · established. Related: Multi-head Latent Attention.
- **Multi-head Latent Attention (MLA)** (`multi-head-latent-attention`) — architecture · active. Related: Grouped-Query Attention.

### Post-training — 5

- **Supervised Fine-Tuning (SFT)** (`sft`) — method · established. Leads to: RLHF and GRPO.
- **Reinforcement Learning from Human Feedback (RLHF)** (`rlhf`) — method · established. Prerequisite and came before: SFT. Related: GRPO.
- **Group Relative Policy Optimization (GRPO)** (`grpo`) — method · active. Prerequisite and came before: SFT. Leads to: GSPO and DAPO. Related: RLHF.
- **Group Sequence Policy Optimization (GSPO)** (`gspo`) — method · frontier. Prerequisite and came before: GRPO. Related: DAPO.
- **DAPO** (`dapo`) — method · frontier. Prerequisite and came before: GRPO. Related: GSPO.

### Inference — 4

- **FlashAttention** (`flashattention`) — method · established. Related: Delta Attention.
- **Speculative Decoding** (`speculative-decoding`) — method · active. Leads to: DFlash. Related: Multi-Token Prediction.
- **DFlash** (`dflash`) — system · frontier. Prerequisite and came before: Speculative Decoding.
- **Multi-Token Prediction (MTP)** (`multi-token-prediction`) — method · active. Related: Speculative Decoding.

### Multimodal — 3

- **Contrastive Language-Image Pre-training (CLIP)** (`clip`) — architecture · established. Parent: Multimodal Models.
- **Multimodal Models** (`multimodal-models`) — architecture · active. Parent of: CLIP and Omni-family Models.
- **Omni-family Models** (`omni-family-models`) — architecture · active. Parent: Multimodal Models. Boundary remains under editorial review.

### Memory — 1

- **Limited Memory Language Models (LMLMs)** (`limited-memory-language-models`) — architecture · frontier. Related: Mem0.

### Agents — 1

- **Mem0** (`mem0`) — system · frontier. Related: Limited Memory Language Models.

### Interpretability — 3

- **Sparse Autoencoders (SAEs)** (`sparse-autoencoders`) — method · active. Leads to: Circuit Tracing.
- **Rank-One Model Editing (ROME)** (`rome`) — method · established. Related: Circuit Tracing.
- **Circuit Tracing** (`circuit-tracing`) — method · frontier. Prerequisite and came before: Sparse Autoencoders. Related: ROME.

## Category-balance audit

| Area             | Topics | Share | Decision                                                                   |
| ---------------- | -----: | ----: | -------------------------------------------------------------------------- |
| Post-training    |      5 |   25% | Largest area, but every node reflects Mihir's requested post-training set. |
| Inference        |      4 |   20% | Coherent set spanning kernels, decoding, and multi-token proposals.        |
| Models           |      3 |   15% | Three distinct attention architectures or methods.                         |
| Interpretability |      3 |   15% | Three distinct feature, editing, and tracing methods.                      |
| Multimodal       |      3 |   15% | Broad parent with distinct CLIP and omni-family children.                  |
| Memory           |      1 |    5% | Intentionally narrow LMLM pretraining paradigm.                            |
| Agents           |      1 |    5% | Intentionally narrow persistent agent-memory system.                       |

The largest-to-smallest ratio is 5:1. That is a layout constraint, not evidence that the taxonomy needs filler. Automatic layout must allocate space from actual node counts and keep singleton areas legible.

## Graph-health audit

The inventory contains 20 topics and 15 unique topic-to-topic edges after adding CLIP under Multimodal Models.

- **Orphans:** none when hierarchy, prerequisite, progression, and related edges are considered. Area membership also guarantees every topic a semantic home.
- **Redundant nodes:** none. Acronyms remain aliases, and the potentially close pairs GQA/MLA, GSPO/DAPO, LMLMs/Mem0, and ROME/Circuit Tracing have different mechanisms and boundaries.
- **Largest hub:** GRPO has four unique neighbors: SFT, RLHF, GSPO, and DAPO. Each edge has a named historical or comparative reason. No other topic exceeds three neighbors.
- **Weak edge removed:** FlashAttention ↔ Speculative Decoding expressed only broad inference optimization and duplicated area membership.
- **Edges retained after review:** Delta Attention ↔ FlashAttention is a direct sparse-versus-exact attention comparison; LMLMs ↔ Mem0 intentionally contrasts two forms of external memory across different system boundaries; ROME ↔ Circuit Tracing connects causal intervention methods with editing versus tracing goals.
- **Previously omitted edges:** GQA → MLA progression, ROME ↔ LMLMs, and FlashAttention ↔ Multimodal Models remain omitted for the reasons in the canonical taxonomy note.

## Maturity audit

Maturity describes the technical concept, never the completeness of Mihir's page.

| Maturity       | Count | Current concepts                                                                    |
| -------------- | ----: | ----------------------------------------------------------------------------------- |
| `established`  |     6 | GQA, SFT, RLHF, FlashAttention, CLIP, ROME                                          |
| `active`       |     7 | MLA, GRPO, Speculative Decoding, MTP, Multimodal Models, Omni-family Models, SAEs   |
| `frontier`     |     7 | Delta Attention, GSPO, DAPO, DFlash, LMLMs, Mem0, Circuit Tracing                   |
| `foundational` |     0 | Reserved for later concepts that are structurally necessary historical foundations. |

The strongest evidence that page readiness is independent is that GQA, CLIP, and ROME are `established` while their pages remain drafts. Conversely, the published GRPO and Multimodal Models pages are `active`, not automatically `established` because they have visible content.

## Boundaries requiring continued attention

1. **Omni-family Models:** still awaiting broader primary-source review before production promotion.
2. **CLIP versus the Multimodal Models parent:** CLIP remains a specific dual-encoder image-language architecture, not an alias for the broader multimodal area.
3. **Memory versus Agents:** LMLMs remains a pretraining architecture under Memory; Mem0 remains a conversational-memory system under Agents. Their related edge is comparative, not hierarchical.
4. **Models versus Inference:** Delta Attention remains under Models because the requested grouping treats it as an attention method; its FlashAttention edge crosses into Inference intentionally. Revisit only if area definitions become architecture-stage rather than editorial groupings.
5. **Progression semantics:** `cameBefore` and `leadsTo` encode a defensible conceptual development, not merely publication chronology.

## Approval gate

Before Section 2 makes automatic layout the source of initial positions, Mihir should approve:

- the seven-area balance without filler nodes;
- CLIP as an established child of Multimodal Models;
- the removal of FlashAttention ↔ Speculative Decoding;
- GRPO's four retained relationships;
- the retained cross-area Delta Attention ↔ FlashAttention and LMLMs ↔ Mem0 comparisons;
- the continued draft/editorial-review status of Omni-family Models.
