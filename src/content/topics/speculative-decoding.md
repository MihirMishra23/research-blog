---
name: 'Speculative Decoding'
summary: 'Exact accelerated decoding that drafts tokens cheaply and verifies several candidates with a larger target model.'
category: inference-systems
type: method
status: active
aliases:
  - 'Speculative sampling'
problem: 'Autoregressive generation normally requires one serial target-model pass for each emitted token.'
prerequisites: []
cameBefore: []
leadsTo: []
related:
  - flashattention
frontierQuestions:
  - 'Which draft mechanisms maximize accepted tokens without adding excessive draft cost?'
  - 'How should serving systems schedule verification across heterogeneous requests and hardware?'
papers:
  - title: 'Fast Inference from Transformers via Speculative Decoding'
    url: https://arxiv.org/abs/2211.17192
    year: 2022
---

> **Sample content:** This note sketches the idea and omits many sampling and
> systems details that a finished treatment must cover.

## What is it?

A smaller or otherwise cheaper draft process proposes several future tokens.
The target model evaluates that block in parallel and an acceptance rule keeps
the output distribution aligned with ordinary target-model decoding.

## Why can it help?

The target model still performs substantial work, but it can verify multiple
positions in one pass. Speedup depends on how often draft tokens are accepted
and how much cheaper drafting is than target-model execution.

## Limitations

Poor acceptance rates, expensive draft models, small batches, or scheduling
overhead can erase the benefit. The algorithm and the serving system therefore
have to be evaluated together.
