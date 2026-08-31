# Post-V1 taxonomy scope

Status: approved scope for Post-V1 Map Action Item 1.1.

This document defines the coverage boundary for the next map release. It selects the active areas, fixes a target concept count, and establishes inclusion and exclusion rules. Candidate names remain provisional until Action Item 1.2 assigns canonical IDs, labels, maturity, summaries, and relationships.

## Release objective

Expand the map from six demonstration concepts to a focused set of concepts selected by Mihir. The release should remain legible, give every edge a precise purpose, and create useful topic-page structure without generating publishable article-body prose.

## Vocabulary decision

- Rename the `inference-systems` category and its visible area from **Inference systems** to **Inference** (`inference`).
- Replace the `retrieval` category with **Memory** (`memory`).
- Remove `training` from the current taxonomy vocabulary and this release.
- Keep `evaluation` and `safety` as reserved schema categories outside this release.
- Use **target concept count** instead of **concept budget**. It means the planned number of nodes assigned to an area for this release, not a financial budget.

## Coverage decision

The release will target **19 production concepts across seven active areas**, including the six existing concepts and thirteen additions selected by Mihir.

| Area             | Schema category    | Target concept count | Existing concepts                    | New concepts                                                          |
| ---------------- | ------------------ | -------------------: | ------------------------------------ | --------------------------------------------------------------------- |
| Models           | `models`           |                    3 | —                                    | Delta Attention; Grouped-Query Attention; Multi-head Latent Attention |
| Post-training    | `post-training`    |                    5 | SFT, RLHF, GRPO                      | Group Sequence Policy Optimization; DAPO                              |
| Inference        | `inference`        |                    4 | FlashAttention, Speculative Decoding | DFlash; Multi-Token Prediction                                        |
| Multimodal       | `multimodal`       |                    2 | Multimodal Models                    | Omni-family models                                                    |
| Memory           | `memory`           |                    1 | —                                    | Limited Memory Language Models                                        |
| Agents           | `agents`           |                    1 | —                                    | Mem0                                                                  |
| Interpretability | `interpretability` |                    3 | —                                    | Sparse Autoencoders; ROME; Circuit Tracing                            |
| **Total**        |                    |               **19** | **6**                                | **13 additions**                                                      |

Training, Evaluation, and Safety are deferred from this release. They can return only through a later explicit scope decision rather than being added opportunistically during implementation.

## Candidate area-and-concept inventory

These names define coverage slots, not final topic IDs. Action Item 1.2 will settle capitalization, aliases, map labels, and precise topic boundaries.

### Models — 3 concepts

1. Delta Attention
2. Grouped-Query Attention (GQA)
3. Multi-head Latent Attention (MLA)

These are assigned to Models because Mihir selected that grouping, even where a mechanism also has inference-efficiency consequences.

### Post-training — 5 concepts

1. Supervised Fine-Tuning (SFT; existing)
2. Reinforcement Learning from Human Feedback (RLHF; existing)
3. Group Relative Policy Optimization (GRPO; existing)
4. Group Sequence Policy Optimization (GSPO)
5. DAPO (Decoupled Clip and Dynamic sAmpling Policy Optimization)

### Inference — 4 concepts

1. FlashAttention (existing)
2. Speculative Decoding (existing)
3. DFlash (Block Diffusion for Flash Speculative Decoding)
4. Multi-Token Prediction (MTP)

MTP remains in Inference because Mihir selected that grouping, although its primary work also defines a training objective.

### Multimodal — 2 concepts

1. Multimodal Models (existing umbrella topic)
2. Omni-family models

“Omni-family models” is a provisional family-level label. Action Item 1.2 must keep its boundary broader than any single branded release while using representative omni-model technical reports as evidence.

### Memory — 1 concept

1. Limited Memory Language Models (LMLMs)

Memory replaces Retrieval as the area name. Retrieval can still appear as a mechanism within a memory topic when it is necessary to explain how external knowledge or state is accessed.

### Agents — 1 concept

1. Mem0

Mem0 is an explicitly owner-selected exception to the default preference for mechanism-level concepts over named systems. Its topic must explain the durable agent-memory architecture rather than read as a product page.

### Interpretability — 3 concepts

Use **Interp** as the short map label for this area.

1. Sparse Autoencoders (SAEs)
2. Rank-One Model Editing (ROME)
3. Circuit Tracing

## Inclusion criteria

A candidate enters the canonical taxonomy only when all of the following are true:

1. **Owner selection:** it is one of the thirteen additions in this scope or one of the six existing concepts.
2. **Explanatory usefulness:** it can support a focused topic page with a clear problem, idea, consequences, and limitations.
3. **Durable identity:** it has a stable technical definition or a published architecture worth explaining.
4. **Distinct boundary:** it is not better represented as an alias, example, paper, or subsection of another selected topic.
5. **Intentional connectivity:** it has at least one precise hierarchy, prerequisite, progression, or related connection to another included concept.
6. **Sourceability:** its defining claims can be grounded in primary papers, specifications, or first-party technical documentation.
7. **Map legibility:** it can have a short recognizable map label.
8. **Editorial value:** Mihir expects it to help organize current or plausible future research notes.

## Exclusion criteria

Exclude or defer a candidate when any of the following applies:

- It is outside the approved 19-concept inventory.
- It is primarily a vendor feature, company, hosted product, or release label without a durable published architecture. An owner-selected named system such as Mem0 may be included when the topic explains its architecture rather than promoting the product.
- It is a short-lived buzzword without a stable technical distinction.
- It duplicates a selected topic and is better stored as an alias.
- It is an individual implementation that belongs under a broader selected concept.
- It is so broad that its edges would be vague or so narrow that it cannot justify a permanent page.
- Its only proposed edge is “also related to LLMs.”
- Its historical priority, definition, or claimed progression is disputed and cannot yet be represented with explicit uncertainty.
- It belongs to Training, Evaluation, Safety, or another deferred area.

## Balance and stopping rules

- **Hard target:** 19 production concepts. Another candidate must displace an approved slot or wait for a later release.
- **Existing-node rule:** the six current concepts remain in scope, but their canonical names and boundaries may be clarified.
- **Connectivity rule:** no production orphan nodes.
- **Hub rule:** a concept with more than six immediate non-hierarchical relationships requires review for overly broad scope or noisy edges.
- **Batch rule:** implementation adds one area-sized batch at a time.
- **Authorship rule:** this inventory authorizes taxonomy and topic-structure work only; Mihir remains the author of all publishable article-body prose.

## Primary evidence for Action Item 1.2

- [Delta Attention](https://arxiv.org/abs/2505.11254), [Grouped-Query Attention](https://arxiv.org/abs/2305.13245), and [DeepSeek-V2](https://arxiv.org/abs/2405.04434) provide primary definitions for the three Models candidates.
- [Group Sequence Policy Optimization](https://arxiv.org/abs/2507.18071) and [DAPO](https://arxiv.org/abs/2503.14476) provide the names and technical boundaries for the two Post-training additions.
- [DFlash](https://arxiv.org/abs/2602.06036) and [Multi-Token Prediction](https://arxiv.org/abs/2404.19737) anchor the two Inference additions.
- The [Qwen2.5-Omni Technical Report](https://arxiv.org/abs/2503.20215) is a representative primary source for the provisional Omni-family models boundary.
- [Continuous-Query Limited Memory Language Models](https://arxiv.org/abs/2607.07707) and [Mem0](https://arxiv.org/abs/2504.19413) anchor the Memory and Agents additions.
- Anthropic's [work applying sparse autoencoders to a production language model](https://www.anthropic.com/research/mapping-mind-language-model), the [ROME paper](https://arxiv.org/abs/2202.05262), and Anthropic's [open circuit-tracing method](https://www.anthropic.com/research/open-source-circuit-tracing) anchor the three Interpretability additions.

## Handoff to Action Item 1.2

Action Item 1.2 must now:

1. resolve the provisional names into exactly 19 canonical candidates;
2. assign IDs, display names, map labels, category, concept type, and maturity;
3. define the boundary of “Omni-family models” and the architecture-focused boundary of Mem0;
4. define reciprocal relationships without exceeding the hub rule;
5. record uncertain relationships instead of presenting them as settled facts;
6. identify which candidates need additional primary-source review before becoming topic files.
