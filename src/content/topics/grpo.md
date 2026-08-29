---
name: 'Group Relative Policy Optimization (GRPO)'
summary: 'A policy-optimization method that estimates relative advantages from groups of sampled responses.'
category: post-training
type: method
status: active
aliases:
  - 'GRPO'
mapLabel: 'GRPO'
problem: 'Policy optimization for verifiable tasks can be expensive when it requires a separately trained value model.'
idea: 'Sample a group of responses for each prompt and estimate each response advantage relative to rewards within that group.'
consequence: 'Policy optimization can avoid a separate value model and work naturally with automatically checkable outcome rewards.'
limitations: 'Training behavior remains sensitive to group composition, sparse rewards, normalization, clipping, regularization, and data generation choices.'
whatCameNext: 'Current work tests how group-relative objectives scale across reasoning domains and how much observed progress comes from the optimizer versus the surrounding recipe.'
prerequisites:
  - sft
cameBefore:
  - sft
leadsTo: []
related:
  - rlhf
frontierQuestions:
  - 'When do group-relative baselines remain stable as reward distributions become sparse or skewed?'
  - 'Which gains come from the optimizer itself versus data generation and reward design?'
papers:
  - title: 'DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models'
    url: https://arxiv.org/abs/2402.03300
    year: 2024
map:
  x: 650
  y: 135
  width: 105
  height: 44
  labelOffsetX: 3
  labelOffsetY: -2
---

> **Sample content:** This page is an orientation stub. It intentionally avoids
> presenting implementation defaults as settled best practice.

## What is it?

GRPO samples a group of responses for the same prompt and measures each reward
relative to the group. That relative signal acts as an advantage estimate while
avoiding a separate learned value model.

For rewards (r_1,\ldots,r_G), a schematic standardized advantage is

$$
A_i = \frac{r_i - \operatorname{mean}(r_1,\ldots,r_G)}
{\operatorname{std}(r_1,\ldots,r_G) + \epsilon}.
$$

## Why it matters

The method is especially visible in reasoning settings with automatically
checkable rewards. Its practical behavior still depends heavily on sampling,
reward construction, clipping, regularization, and the underlying policy.
