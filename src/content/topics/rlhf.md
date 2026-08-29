---
name: 'Reinforcement Learning from Human Feedback (RLHF)'
summary: 'Post-training that uses human preference data to optimize model behavior through a learned reward signal.'
category: post-training
type: method
status: established
aliases:
  - 'RLHF'
mapLabel: 'RLHF'
problem: 'Demonstrations alone cannot efficiently specify which of several plausible model responses people prefer.'
idea: 'Learn a reward signal from human comparisons, then optimize the model toward responses that score well while constraining movement from a reference policy.'
consequence: 'Developers can shape behavior using comparative judgments rather than writing one ideal demonstration for every prompt.'
limitations: 'Preference data and learned rewards can encode bias, generalize poorly, and become exploitable under too much optimization pressure.'
whatCameNext: 'Direct preference objectives and outcome-verifiable reinforcement learning explore simpler or more task-specific feedback pipelines.'
prerequisites:
  - sft
cameBefore:
  - sft
leadsTo: []
related:
  - grpo
frontierQuestions:
  - 'How well do learned rewards generalize beyond the preference-data distribution?'
  - 'How much optimization pressure can be applied before reward-model errors dominate behavior?'
papers:
  - title: 'Training language models to follow instructions with human feedback'
    url: https://arxiv.org/abs/2203.02155
    year: 2022
map:
  x: 400
  y: 230
  width: 120
  height: 62
  labelOffsetX: 0
  labelOffsetY: 2
---

> **Sample content:** This is a deliberately compact topic placeholder, not a
> comprehensive account of modern preference optimization.

## What is it?

RLHF turns comparisons between model responses into a training signal. A common
pipeline begins with an SFT model, fits a reward model to human rankings, and
then updates the policy to produce responses with higher predicted reward.

## Core objective

A simplified objective trades off reward against movement away from a reference
policy:

$$
\max_\theta\;
\mathbb{E}_{y\sim\pi_\theta(\cdot\mid x)}[r_\phi(x,y)]
- \beta D_{\mathrm{KL}}(\pi_\theta\|\pi_{\mathrm{ref}}).
$$

The KL term is not just a mathematical decoration: it limits how aggressively
the policy exploits imperfections in the learned reward.

## Limitations

RLHF inherits ambiguity and bias from preference collection, reward-model
generalization, and the optimization algorithm. A higher learned reward is not
the same thing as a universally better answer.
