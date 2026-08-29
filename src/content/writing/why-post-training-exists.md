---
title: 'Why does post-training exist?'
description: 'A compact tour from next-token pretraining to demonstrations, preferences, and reward-driven behavior shaping.'
date: 2026-08-28
topics:
  - sft
  - rlhf
  - grpo
tags:
  - alignment
  - preference-optimization
level: introductory
type: explainer
status: published
github: null
papers:
  - title: 'Training language models to follow instructions with human feedback'
    url: https://arxiv.org/abs/2203.02155
    year: 2022
  - title: 'DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models'
    url: https://arxiv.org/abs/2402.03300
    year: 2024
previous: null
next: why-inference-memory-bound
related: []
---

> **Sample article:** This short draft exists to exercise the publishing system.
> It is not yet a complete literature review or practical training guide.

Pretraining gives a language model a broad statistical model of text. It does
not uniquely determine how the model should behave when someone asks a question.
Many continuations can be probable while differing in usefulness, format,
honesty, or safety.

## Demonstrations narrow the target

Supervised fine-tuning supplies examples of prompts paired with desired
responses. The objective looks familiar:

$$
L_{\mathrm{SFT}}(\theta)
= -\mathbb{E}_{(x,y)\sim D}\sum_t
\log \pi_\theta(y_t\mid x,y_{<t}).
$$

What changed is the dataset. Instead of asking the model to imitate arbitrary
web continuations, we ask it to imitate a curated response distribution.

```python
loss = model(
    input_ids=prompt_and_response,
    labels=response_only_labels,
).loss
loss.backward()
```

## Preferences add comparison

A demonstration shows one response. Preference data can say that response A is
better than response B for a given prompt. RLHF commonly learns a reward model
from comparisons and optimizes the policy against that signal while constraining
movement away from a reference model.

## Rewards can be programmatic

When correctness can be checked automatically, outcome rewards can replace or
supplement human rankings. GRPO is one approach that compares rewards within a
group of sampled responses rather than fitting a separate value model.

The unifying point is that post-training does not inject a single property called
“alignment.” It changes the training distribution and objective so that certain
behaviors become more likely—and introduces new failure modes tied to the data,
reward, and optimization process.
