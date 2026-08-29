---
name: 'FlashAttention'
summary: 'An exact, IO-aware attention algorithm that reduces expensive traffic through the GPU memory hierarchy.'
category: inference-systems
type: method
status: established
aliases:
  - 'Flash Attention'
mapLabel: 'FlashAttention'
problem: 'Materializing the full attention matrix creates costly reads and writes between high-bandwidth memory and on-chip memory.'
idea: 'Tile exact attention around the memory hierarchy and maintain online softmax statistics so the full score matrix never needs to be materialized in high-bandwidth memory.'
consequence: 'Attention performs the same mathematical operation with substantially less memory traffic, improving speed and memory use on supported hardware.'
limitations: 'Gains depend on shapes, hardware, precision, kernel support, and whether attention is the actual end-to-end bottleneck.'
whatCameNext: 'Later kernels improve work partitioning and adapt IO-aware attention to new architectures, accelerators, precisions, and sparsity patterns.'
prerequisites: []
cameBefore: []
leadsTo: []
related:
  - speculative-decoding
  - multimodal-models
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
map:
  x: 1110
  y: 120
  width: 225
  height: 66
  labelOffsetX: -4
  labelOffsetY: 0
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
