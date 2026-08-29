---
name: 'Speculative Decoding'
summary: 'Exact accelerated decoding that drafts tokens cheaply and verifies several candidates with a larger target model.'
category: inference-systems
type: method
status: active
aliases:
  - 'Speculative sampling'
mapLabel: 'Speculative Decoding'
problem: 'Autoregressive generation normally requires one serial target-model pass for each emitted token.'
idea: 'Use a cheaper process to draft several tokens, then have the target model verify the proposed block in parallel with an exact acceptance rule.'
consequence: 'A target-model pass can advance generation by multiple accepted tokens without changing the target output distribution.'
limitations: 'Low acceptance, costly drafting, small batches, or serving overhead can erase the latency benefit.'
whatCameNext: 'Research now explores self-speculation, learned draft heads, tree-shaped proposals, and serving-aware scheduling strategies.'
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
map:
  x: 1350
  y: 360
  width: 245
  height: 50
  labelOffsetX: 0
  labelOffsetY: 2
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
