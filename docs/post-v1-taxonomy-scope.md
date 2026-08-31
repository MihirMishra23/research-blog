# Post-V1 taxonomy scope

Status: approved scope for Post-V1 Map Action Item 1.1.

This document defines the coverage boundary for the next map release. It selects areas, fixes a concept-count budget, and establishes inclusion and exclusion rules. Candidate names remain provisional until Action Item 1.2 assigns canonical IDs, labels, maturity, summaries, and relationships.

## Release objective

Expand the map from six demonstration concepts to a useful, systems-oriented cross-section of the LLM field without turning it into an indiscriminate encyclopedia.

The release should let a reader move from model foundations through training and post-training, then into inference, multimodality, retrieval, agents, evaluation, and safety. It should emphasize concepts that explain how modern systems work and how their tradeoffs connect.

## Coverage decision

The release will target **36 production concepts across nine areas**, including the six existing concepts.

| Area              | Schema category     | Concept budget | Existing concepts                    | Coverage intent                                                                                |
| ----------------- | ------------------- | -------------: | ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Training          | `training`          |              4 | —                                    | Core objectives, data/compute choices, and foundations needed to understand model development. |
| Models            | `models`            |              4 | —                                    | Major architectural families and scaling choices, not individual branded models.               |
| Post-training     | `post-training`     |              6 | SFT, RLHF, GRPO                      | Demonstrations, reward modeling, preference optimization, and feedback sources.                |
| Inference systems | `inference-systems` |              6 | FlashAttention, Speculative Decoding | Memory, batching, precision, attention kernels, and decoding efficiency.                       |
| Multimodal        | `multimodal`        |              4 | Multimodal Models                    | How non-text inputs become model context and how multimodal behavior is trained.               |
| Retrieval         | `retrieval`         |              3 | —                                    | External knowledge retrieval, indexing, and structured retrieval patterns.                     |
| Agents            | `agents`            |              3 | —                                    | Reasoning-action loops, tool interfaces, and stateful task execution.                          |
| Evaluation        | `evaluation`        |              3 | —                                    | Benchmark design, model-based evaluation, and validity threats.                                |
| Safety            | `safety`            |              3 | —                                    | Adversarial testing, runtime controls, and safety-oriented training or evaluation.             |
| **Total**         |                     |         **36** | **6**                                | **30 additions**                                                                               |

The existing schema vocabulary is sufficient for this release. No category additions or renames are required in `TOPIC_CATEGORIES`.

`interpretability` remains a valid reserved schema category but is outside this 36-concept release. Interpretability deserves its own coherent area—with representation analysis, attribution, probes, circuits, causal interventions, and model organisms—rather than one or two disconnected nodes added only for apparent completeness.

## Candidate area-and-concept inventory

These names define coverage slots, not final topic IDs. Action Item 1.2 may merge or rename a candidate when primary-source review shows that another boundary is clearer.

### Training — 4 concepts

1. Transformer and self-attention foundations
2. Tokenization and vocabulary construction
3. Autoregressive pretraining objectives
4. Data/compute scaling and training-data curation

The fourth slot deliberately joins closely coupled planning questions for the scope pass. Action Item 1.2 must decide whether it is one coherent topic or whether another training candidate should be removed to split it.

### Models — 4 concepts

1. Decoder-only language models
2. Mixture-of-Experts models
3. Long-context architectures and context extension
4. State-space and recurrent alternatives to attention-only models

Individual model families may appear as examples or paper links, not as top-level nodes merely because they are prominent products.

### Post-training — 6 concepts

1. Supervised fine-tuning (existing)
2. Reward models and preference data
3. Reinforcement learning from human feedback (existing)
4. Direct preference optimization
5. Group Relative Policy Optimization (existing)
6. AI feedback and constitutional training

This area distinguishes the feedback source, learned signal, and optimization method instead of using “alignment” as one undifferentiated node.

### Inference systems — 6 concepts

1. KV caching
2. FlashAttention (existing)
3. Quantization
4. PagedAttention and KV-cache memory management
5. Continuous batching and request scheduling
6. Speculative Decoding (existing)

This area covers the path from a single model forward pass to an actual multi-request serving system.

### Multimodal — 4 concepts

1. Multimodal Models (existing umbrella topic)
2. Contrastive vision-language pretraining
3. Modality projectors, visual tokenization, and representation alignment
4. Multimodal instruction tuning

Audio and video should appear as examples within the umbrella and representation topics for this release. They become separate nodes only when the taxonomy can express modality-specific architectural differences clearly.

### Retrieval — 3 concepts

1. Embeddings and dense retrieval
2. Retrieval-Augmented Generation
3. Structured retrieval, including graph-based retrieval

“Agentic RAG” is treated initially as an intersection of retrieval and agents, not a standalone node, unless Action Item 1.2 identifies relationships and a topic boundary that are not redundant with those areas.

### Agents — 3 concepts

1. ReAct and reasoning-action loops
2. Tool calling and tool interoperability, including MCP as an example
3. Planning, memory, and stateful execution

Multi-agent systems remain examples within planning or tool use unless there is room to explain their distinct coordination problems without promoting framework-specific terminology.

### Evaluation — 3 concepts

1. Benchmark and evaluation-suite design
2. LLM-as-judge and model-based evaluation
3. Contamination, robustness, and evaluation validity

Individual benchmarks belong as sources or examples unless they introduce a durable evaluation concept.

### Safety — 3 concepts

1. Red teaming and adversarial evaluation
2. Safety-oriented feedback and constitutional constraints
3. Runtime guardrails, policy enforcement, and prompt-injection defenses

The overlap between post-training and safety is intentional: post-training explains the mechanism, while safety explains the risk-control objective and its limitations. Action Item 1.2 must avoid duplicate pages by using cross-area relationships where one canonical topic is enough.

## Inclusion criteria

A candidate enters the canonical taxonomy only when all of the following are true:

1. **Conceptual importance:** it explains a durable mechanism, architecture, workflow, measurement problem, or system tradeoff used to understand modern LLMs.
2. **Explanatory usefulness:** it can support a focused topic page with a clear problem, idea, consequences, and limitations.
3. **Durable identity:** the concept is not merely a current product name, release label, or thin rebranding of an older idea.
4. **Distinct boundary:** it is not better represented as an alias, example, paper, or subsection of another topic.
5. **Intentional connectivity:** it has at least one precise hierarchy, prerequisite, progression, or related connection to another included concept.
6. **Sourceability:** its defining claims can be grounded in primary papers, specifications, or first-party technical documentation.
7. **Map legibility:** it can have a short recognizable map label and does not require an essay-length name to distinguish it.
8. **Editorial value:** Mihir expects the concept to help organize current or plausible future research notes.

Passing these criteria makes a concept eligible; the 36-concept budget still requires choosing the strongest candidates within each area.

## Exclusion criteria

Exclude or demote a candidate when any of the following applies:

- It is primarily a vendor, company, hosted product, model release, or framework name.
- It is a short-lived buzzword without a stable technical distinction.
- It duplicates an existing topic and is better stored as an alias.
- It is an individual paper, benchmark, dataset, or implementation that belongs under a broader concept.
- It is so broad—such as “AI,” “reasoning,” or “alignment”—that its edges would be vague and its page would absorb multiple areas.
- It is so narrow that it cannot justify a permanent page or meaningful connection at this release scale.
- Its only proposed edge is “also related to LLMs.”
- Its historical priority, definition, or claimed progression is disputed and cannot yet be represented with explicit uncertainty.
- It would force the release over the area budget without displacing a less useful candidate.
- It belongs to interpretability or another intentionally deferred area.

## Balance and stopping rules

- **Hard target:** 36 production concepts. A 37th candidate must displace an existing slot or wait for the next release.
- **Area tolerance:** an area may move by one slot during Action Item 1.2 if the total remains 36 and the reason is recorded.
- **Existing-node rule:** the six current concepts remain in scope, but their canonical names and boundaries may be clarified.
- **Connectivity rule:** no production orphan nodes.
- **Hub rule:** a concept with more than six immediate non-hierarchical relationships requires review for overly broad scope or noisy edges.
- **Batch rule:** later implementation adds one area-sized batch at a time.
- **Authorship rule:** this inventory authorizes taxonomy and topic-structure work only; Mihir remains the author of all publishable article-body prose.

## Evidence used to set the boundary

The scope is anchored in representative primary work rather than intended as a complete bibliography:

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) establishes the Transformer foundation.
- [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556) motivates data/compute scaling as a distinct training concern.
- [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) supports separating direct preference methods from reward-model-based RLHF.
- [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180) ties KV-cache management and serving throughput together.
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) defines the core parametric/non-parametric retrieval pattern.
- [ReAct](https://arxiv.org/abs/2210.03629) motivates reasoning-action loops as a durable agent concept.
- The [Model Context Protocol specification](https://modelcontextprotocol.io/specification/2025-06-18/index) supports tool interoperability as broader than any one agent framework.
- [Learning Transferable Visual Models From Natural Language Supervision](https://arxiv.org/abs/2103.00020) and [Visual Instruction Tuning](https://arxiv.org/abs/2304.08485) distinguish multimodal pretraining from instruction tuning.
- [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110) motivates multi-metric evaluation and validity as their own area.
- [Constitutional AI](https://arxiv.org/abs/2212.08073) demonstrates the overlap—and necessary distinction—between feedback mechanisms and safety objectives.

## Handoff to Action Item 1.2

Action Item 1.2 must now:

1. resolve the provisional names into exactly 36 canonical candidates;
2. assign IDs, display names, map labels, category, concept type, and maturity;
3. decide the two explicitly flagged merge/split questions in Training and Safety;
4. define reciprocal relationships without exceeding the hub rule;
5. record uncertain relationships instead of presenting them as settled;
6. identify which candidates need a new primary-source review before becoming topic files.
