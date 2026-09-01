---
name: 'Grouped-Query Attention (GQA)'
summary: 'An attention design that shares key-value heads across groups of query heads to balance quality with decoding efficiency.'
category: models
type: architecture
status: established
draft: true
aliases:
  - 'GQA'
  - 'Grouped Query Attention'
mapLabel: 'GQA'
prerequisites: []
cameBefore: []
leadsTo: []
related:
  - multi-head-latent-attention
frontierQuestions:
  - 'How should query heads be grouped for different model sizes and serving constraints?'
  - 'When does GQA offer a better quality-efficiency tradeoff than other key-value cache designs?'
papers:
  - title: 'GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints'
    url: https://arxiv.org/abs/2305.13245
    year: 2023
---

> **Author placeholder:** Mihir will write this topic explanation. This draft
> currently contains taxonomy metadata, research questions, and primary sources
> only.
