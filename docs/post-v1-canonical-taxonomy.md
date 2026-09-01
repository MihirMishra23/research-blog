# Post-V1 canonical taxonomy

Status: reviewed inventory for Post-V1 Map Action Item 1.2.

The whole-taxonomy balance, graph-health, maturity, and boundary review is recorded in the [Post-V1 taxonomy audit](./post-v1-taxonomy-audit.md).

The machine-readable companion file, [post-v1-canonical-taxonomy.json](./post-v1-canonical-taxonomy.json), is the source of truth for the candidate metadata in this document. It is a current backlog, not a fixed node target. Production topic files will remain the source of truth for which nodes actually appear on the public map.

This inventory defines topic structure and graph metadata only. It does not provide publishable article-body prose; Mihir remains the author of every article.

## Maturity vocabulary

Maturity describes the state of a technical concept, not how complete its topic page is.

| Status         | Meaning                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `foundational` | A historically important basis that remains structurally necessary for understanding later concepts.         |
| `established`  | The definition is stable and the concept has broad, durable use or implementation evidence.                  |
| `active`       | The concept is established enough to map, but its design, evaluation, or adoption is still changing quickly. |
| `frontier`     | The concept is recent, narrowly evidenced, or still has an unsettled boundary or generality.                 |

No current candidate needs `foundational`; the status remains available for later additions.

## Canonical inventory

Area membership is expressed through the schema `category`. `parent` is reserved for a real topic-to-topic hierarchy, so most area-level concepts correctly use `null`.

| ID                               | Display name                                      | Map label            | Area             | Type         | Maturity    |
| -------------------------------- | ------------------------------------------------- | -------------------- | ---------------- | ------------ | ----------- |
| `delta-attention`                | Delta Attention                                   | Delta Attention      | Models           | method       | frontier    |
| `grouped-query-attention`        | Grouped-Query Attention (GQA)                     | GQA                  | Models           | architecture | established |
| `multi-head-latent-attention`    | Multi-head Latent Attention (MLA)                 | MLA                  | Models           | architecture | active      |
| `sft`                            | Supervised Fine-Tuning (SFT)                      | SFT                  | Post-training    | method       | established |
| `rlhf`                           | Reinforcement Learning from Human Feedback (RLHF) | RLHF                 | Post-training    | method       | established |
| `grpo`                           | Group Relative Policy Optimization (GRPO)         | GRPO                 | Post-training    | method       | active      |
| `gspo`                           | Group Sequence Policy Optimization (GSPO)         | GSPO                 | Post-training    | method       | frontier    |
| `dapo`                           | DAPO                                              | DAPO                 | Post-training    | method       | frontier    |
| `flashattention`                 | FlashAttention                                    | FlashAttention       | Inference        | method       | established |
| `speculative-decoding`           | Speculative Decoding                              | Speculative Decoding | Inference        | method       | active      |
| `dflash`                         | DFlash                                            | DFlash               | Inference        | system       | frontier    |
| `multi-token-prediction`         | Multi-Token Prediction (MTP)                      | MTP                  | Inference        | method       | active      |
| `multimodal-models`              | Multimodal Models                                 | Multimodal Models    | Multimodal       | architecture | active      |
| `omni-family-models`             | Omni-family Models                                | Omni Models          | Multimodal       | architecture | active      |
| `limited-memory-language-models` | Limited Memory Language Models (LMLMs)            | LMLMs                | Memory           | architecture | frontier    |
| `mem0`                           | Mem0                                              | Mem0                 | Agents           | system       | frontier    |
| `sparse-autoencoders`            | Sparse Autoencoders (SAEs)                        | SAEs                 | Interpretability | method       | active      |
| `rome`                           | Rank-One Model Editing (ROME)                     | ROME                 | Interpretability | method       | established |
| `circuit-tracing`                | Circuit Tracing                                   | Circuit Tracing      | Interpretability | method       | frontier    |

The Interpretability area uses **Interp** only as its compact area label. Its schema category and full display name remain `interpretability` and **Interpretability**.

## Alias and boundary decisions

- Acronyms such as GQA, MLA, GSPO, MTP, SAE, and ROME are aliases or compact map labels, not separate nodes.
- DAPO remains the display name because the paper presents the acronym as the method's primary name; both the stylized and normally capitalized expansions are aliases.
- DFlash remains one system-level topic; “Block Diffusion for Flash Speculative Decoding” is an alias, not a second diffusion node.
- `omni-family-models` is an umbrella for end-to-end models that consume several modalities and emit more than text. It must not become a page devoted only to Qwen2.5-Omni.
- `limited-memory-language-models` means the pretraining paradigm that externalizes factual knowledge to an editable database. It is not an umbrella for every bounded-context or agent-memory system.
- Mem0 remains under Agents because its selected boundary is persistent conversational memory for agents, not the broader externalized-knowledge pretraining paradigm.
- “Attribution graphs” is an alias for the selected Circuit Tracing method, while generic mechanistic interpretability remains broader than this node.

## Encoded relationships

Every edge below has a named semantic reason. Area-membership edges are omitted from this table because they are derived directly from `category`.

| Kind        | Source                         | Target                      | Reason                                                                                          |
| ----------- | ------------------------------ | --------------------------- | ----------------------------------------------------------------------------------------------- |
| progression | SFT                            | RLHF                        | The selected RLHF pipeline starts from a supervised instruction-following policy.               |
| progression | SFT                            | GRPO                        | The selected GRPO training path assumes an instruction-tuned policy before reward optimization. |
| progression | GRPO                           | GSPO                        | GSPO explicitly changes GRPO-style token-level ratios to sequence-level ratios and clipping.    |
| progression | GRPO                           | DAPO                        | DAPO is presented as a large-scale reasoning-RL recipe developed from the GRPO family.          |
| progression | Speculative Decoding           | DFlash                      | DFlash replaces sequential autoregressive drafting with parallel block-diffusion drafting.      |
| progression | Sparse Autoencoders            | Circuit Tracing             | Circuit Tracing composes learned features into attribution graphs of model computation.         |
| hierarchy   | Multimodal Models              | Omni-family Models          | Omni-family models are a narrower end-to-end, multi-input and multi-output multimodal family.   |
| related     | RLHF                           | GRPO                        | Both optimize policies from reward signals but estimate and use those signals differently.      |
| related     | GSPO                           | DAPO                        | Both are GRPO-family reasoning-RL developments with different stability and sampling changes.   |
| related     | Grouped-Query Attention        | Multi-head Latent Attention | Both reduce KV-cache cost through different sharing or compression structures.                  |
| related     | Delta Attention                | FlashAttention              | Both accelerate attention computation, while one is sparse and corrective and the other exact.  |
| related     | Speculative Decoding           | Multi-Token Prediction      | Multi-token heads can provide multiple future-token proposals useful to accelerated decoding.   |
| related     | Limited Memory Language Models | Mem0                        | Both externalize memory, but one manages factual knowledge during training and one agent state. |
| related     | ROME                           | Circuit Tracing             | Both use causal interventions to study internal computation, with editing versus tracing goals. |

`related` and progression metadata are reciprocal in the machine-readable inventory. A hierarchy uses `parent` only on the child, and a prerequisite need not imply historical progression unless both are explicitly present.

## Omitted or uncertain relationships

These lines must not enter the production graph without a later editorial decision:

- **GQA → MLA as progression:** omitted. They share a KV-cache goal, but available evidence does not establish MLA as a direct successor to GQA. A reciprocal `related` edge is sufficient.
- **ROME ↔ LMLMs:** omitted. Both offer factual-knowledge control, but weight editing and pretraining-time knowledge externalization are distinct; the cross-area edge could mislead.
- **FlashAttention ↔ Multimodal Models:** removed from the existing production metadata. FlashAttention may be implemented inside a multimodal model, but that alone is not a durable conceptual relationship.
- **FlashAttention ↔ Speculative Decoding:** removed during the whole-taxonomy audit. Both improve inference performance, but their shared Inference area already expresses that broad similarity; a direct edge implied a stronger conceptual relationship than the evidence supports.

## Source-review disposition

All candidates have at least one primary paper or first-party technical source. `omni-family-models` remains marked `editorial-review` because its family boundary is broader than the representative Qwen2.5-Omni source. Before its topic file becomes production-ready, review at least one additional primary omni-model source and confirm that the page describes the cross-family architecture rather than a product catalog.

## Handoff to Action Item 1.3

1. Add new candidates as draft topic files in area-sized batches.
2. Copy canonical identity, aliases, summary, maturity, and relationship metadata from the JSON inventory.
3. Do not create article-body prose; topic scaffolding may contain concise structural explanations and source links only.
4. Keep `omni-family-models` in draft until its editorial source review closes.
5. Do not promote a batch until all referenced IDs exist and the dynamic layout can place the resulting production node set clearly.
