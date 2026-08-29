---
name: 'Supervised Fine-Tuning (SFT)'
summary: 'Continued language-model training on curated prompt-and-response demonstrations.'
category: post-training
type: method
status: established
aliases:
  - 'Supervised fine-tuning'
  - 'Instruction tuning'
mapLabel: 'SFT'
problem: 'A pretrained next-token predictor does not automatically follow instructions or adopt a useful response format.'
idea: 'Continue next-token training on curated prompt-and-response demonstrations that exemplify the behavior the model should produce.'
consequence: 'The model becomes easier to direct and gains a behavioral starting point for later preference or reward-based optimization.'
limitations: 'A demonstration presents one acceptable response but does not rank alternatives, and the learned behavior remains bounded by the coverage and quality of the dataset.'
whatCameNext: 'Preference and reward-driven methods such as RLHF and GRPO add comparative feedback after the supervised stage.'
prerequisites: []
cameBefore: []
leadsTo:
  - rlhf
  - grpo
related: []
frontierQuestions:
  - 'How should demonstration quality, diversity, and difficulty be balanced as base models improve?'
  - 'Which behaviors can be taught reliably from small, carefully selected datasets?'
papers:
  - title: 'Training language models to follow instructions with human feedback'
    url: https://arxiv.org/abs/2203.02155
    year: 2022
map:
  x: 330
  y: 195
  width: 90
  height: 44
  labelOffsetX: -2
  labelOffsetY: 0
---

> **Sample content:** This short orientation note exists to exercise the initial
> topic model. It is not yet a finished research survey.

## What is it?

Supervised fine-tuning continues training a pretrained model on examples of the
behavior we want: an instruction or conversation followed by a preferred
response. The learning rule is still next-token prediction, but the data now
describes a narrower behavioral target.

## What problem does it solve?

Pretraining rewards accurate continuation of broad internet text. It does not
directly say that a model should answer a question, respect an output schema, or
decline an unsupported request. SFT supplies demonstrations of those behaviors.

## How does it work?

Given a prompt (x) and demonstrated response (y), training minimizes the
negative log-likelihood of the response tokens:

$$
L_{\mathrm{SFT}}(\theta)
= -\sum_t \log \pi_\theta(y_t \mid x, y_{<t}).
$$

## Limitations and what came next

Demonstrations show one acceptable answer, but they do not express fine-grained
preferences among many plausible answers. Preference-based methods such as RLHF
and outcome-driven methods such as GRPO add a comparative or reward signal after
the supervised stage.
