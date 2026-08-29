---
name: 'FlashAttention'
summary: 'An exact, IO-aware attention algorithm that reduces expensive traffic through the GPU memory hierarchy.'
category: inference-systems
type: method
status: established
aliases:
  - 'Flash Attention'
problem: 'Materializing the full attention matrix creates costly reads and writes between high-bandwidth memory and on-chip memory.'
prerequisites: []
cameBefore: []
leadsTo: []
related:
  - speculative-decoding
frontierQuestions:
  - 'How should exact attention kernels evolve for new accelerators, precisions, and sparse patterns?'
  - 'Where do end-to-end bottlenecks move after attention IO is reduced?'
papers:
  - title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness'
    url: https://arxiv.org/abs/2205.14135
    year: 2022
  - title: 'FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning'
    url: https://arxiv.org/abs/2307.08691
    year: 2023
---

> **Sample content:** This compact explanation is a rendering fixture, not a
> kernel implementation guide or performance benchmark.

## What is it?

FlashAttention computes exact attention in tiles chosen around the GPU memory
hierarchy. It avoids repeatedly writing a large intermediate score matrix to
high-bandwidth memory, while maintaining the statistics needed for a stable
softmax.

## The systems insight

The usual complexity summary does not predict wall-clock behavior by itself.
Two exact algorithms can perform similar arithmetic while moving very different
amounts of data. FlashAttention makes that IO cost part of the algorithm design.

## Limitations

Speedups depend on sequence shape, hardware, precision, kernel availability,
and the rest of the model. Removing one attention bottleneck can expose another
cost elsewhere in the inference or training pipeline.
