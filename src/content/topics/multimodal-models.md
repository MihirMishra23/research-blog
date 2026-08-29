---
name: 'Multimodal Models'
summary: 'Models that learn across text and one or more additional modalities such as images, audio, or video.'
category: multimodal
type: architecture
status: active
aliases:
  - 'Multimodal language models'
  - 'Vision-language models'
problem: 'Text-only interfaces cannot directly represent or reason over the perceptual signals present in images, audio, and video.'
prerequisites: []
cameBefore: []
leadsTo: []
related: []
frontierQuestions:
  - 'How can models ground language in perception without relying on shallow dataset correlations?'
  - 'Which representations and evaluations expose failures in temporal and spatial reasoning?'
papers:
  - title: 'Learning Transferable Visual Models From Natural Language Supervision'
    url: https://arxiv.org/abs/2103.00020
    year: 2021
  - title: 'Flamingo: a Visual Language Model for Few-Shot Learning'
    url: https://arxiv.org/abs/2204.14198
    year: 2022
---

> **Sample content:** This is a taxonomy seed, not a complete history of
> multimodal learning or a claim that all architectures follow one recipe.

## What is it?

Multimodal models connect language with signals such as images, audio, or video.
Architectures vary: some align separate encoders, some project perceptual tokens
into a language model, and others train more of the stack jointly.

## Core design problem

The model must preserve useful modality-specific structure while constructing a
shared space in which information can be compared, retrieved, or generated.

## Limitations

Benchmarks may reward language priors without measuring genuine grounding.
Training data also introduces difficult questions about provenance, temporal
coverage, representation, and evaluation across modalities.
