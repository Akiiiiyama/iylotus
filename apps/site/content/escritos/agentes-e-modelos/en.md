## Summary

- An **agent** is the same language model running in a loop: it decides a step, uses a tool, reads the result and decides again.
- In an agent, a vague prompt doesn't just produce a generic answer. It produces a **sequence of actions in the wrong direction**.
- Claude models differ in **capability, speed and cost**. More capable means slower and more expensive.
- Before switching models, try adjusting **effort**: how much the model thinks before answering.
- Each model follows instructions a little differently. **A prompt that works on one model may need tuning on another.**

---

## 1. Chat, workflow and agent

They all use an LLM. The difference is **who decides the path**.

| Type | Who decides the steps | How it acts | When to use |
|---|---|---|---|
| **Chat** | You, at each message | Takes a prompt and returns an answer | Questions, drafts, ideas, reviews |
| **Workflow** | The code, along a path defined beforehand | Several model calls in a fixed order | Predictable, repeated tasks |
| **Agent** | The model itself, while it works | Plans, uses tools, observes and adjusts | Open-ended tasks with no predictable number of steps |

## 2. How an agent works

The building block is an **augmented LLM**: the model with access to tools (reading files, searching the web, running code, using a screen), retrieval and memory.

1. **It gets the goal:** your prompt, the system instructions and the list of tools.
2. **It decides the next step:** the model still predicts the next token, as always. The difference is that some of those tokens become an **action request**.
3. **The system runs it:** the program around the model is what actually acts.
4. **The result comes back as text:** it enters the context, and the model now takes into account what happened.
5. **It repeats or stops:** until the task is done, a step limit is reached, or it needs a person's approval.

> An agent isn't a different model. It's the same LLM with a loop and tools around it.

### Patterns between chat and agent

Before using an agent, check whether a fixed path does the job:

- **Prompt chaining:** the output of one step becomes the input of the next.
- **Routing:** classify the request and send it to the right flow.
- **Parallelization:** split into independent parts, or run several times and compare.
- **Orchestrator:** one model breaks down the task and delegates to others (subagents).
- **Evaluator:** one model generates, another critiques, until it's good.

## 3. What changes when prompting agents

- **Say whether to suggest or to do.** Current models follow instructions literally: "can you suggest improvements?" gets suggestions. "Improve this component's contrast" gets the change.
- **Explain why.** With the reason behind a rule, the agent applies the idea to cases you didn't foresee.
- **Define success and how to verify it.** With no one watching each step, the agent needs to know when it's done: run a test, compare with the design, look at the screen.
- **Agree on the limits of autonomy.** Local, reversible actions can go ahead. Deleting, publishing or sending messages need confirmation.
- **Ask it to investigate before answering.** "Read the file before talking about it" reduces made-up answers.
- **Keep the scope small.** Agents tend to do more than asked. Tell it to do only what's needed.
- **On long tasks, ask it to log progress** in a notes file or in the git history.

## 4. Claude models

All current models read text and images, use tools, work in many languages and have a 1-million-token context window. What changes is the balance between capability, speed and cost.

| Model | What for | Speed | Cost (input / output, per million tokens) |
|---|---|---|---|
| **Fable 5.1** | The most capable: hard reasoning, agents that work for hours, deep research | Slower | US$ 10 / US$ 50 |
| **Opus 5.5** | The recommended starting point: long-running coding agents and knowledge work | Moderate | US$ 4 / US$ 20 |
| **Sonnet 5.5** | The best balance of speed and intelligence for everyday work | Fast | US$ 2 / US$ 10 |
| **Haiku 5.5** | The fastest and cheapest: classifying, extracting, routing, high-volume tasks | Fastest | from US$ 0.10 / US$ 0.50 |

*Prices as of October 2026. There is also **Mythos 5.1**, with the same capabilities as Fable 5.1, available only to organizations verified by Anthropic.*

A design analogy: it's like choosing between a quick wireframe, a clickable prototype or a full usability test. Not every question needs the most expensive method.

### Effort

Current models **think before answering**, and how much they think is adjustable through the effort level (from low to max). More effort gives more careful answers, but slower and more expensive ones.

Often, **adjusting effort works better than switching models.**

### How to choose

There are two paths:

- **Efficiency first:** start with Haiku, test, and only move up if capability is missing. Good for prototypes, real-time answers and simple high-volume tasks.
- **Capability first:** start with Opus, tune the prompt, then see whether you can lower effort or move to a lighter model. If the result still falls short even at high effort, move up to Fable.

You can also **combine models**: a more capable model coordinates and delegates repetitive work to cheaper models.

Most important: **test with your real tasks.** A small set of your own examples tells you more than any table.

## 5. Why the prompt changes from one model to another

Each model has its own prompting guide, because each one reacts differently to the same instructions. Some differences that show up:

- **Response length:** some models write more by default, others less. If length matters, ask for it explicitly.
- **Initiative:** newer models are more proactive. Old instructions like "if in doubt, use the tool" can make the model overdo it.
- **Literal reading:** current models do exactly what was asked. If you want more than the basics, ask for it.
- **Progress updates:** on long tasks, some models say little about what they're doing. If you want to follow along, ask for a summary at each step.

The lesson for designers: **a prompt is like a component.** It works well in the context it was designed for, and needs testing again when the context changes.

## 6. Why this is a design topic

- **Transparency:** showing the agent's plan and each step is what makes people trust what's happening.
- **Approval points:** deciding where the agent stops and asks is designing the balance between autonomy and control.
- **Agent-computer interface:** the tools an agent uses need clear names, descriptions and examples. It's interface design, except the user is the model.
- **Choosing a model is an experience decision:** speed, cost and quality change how people feel using the product.

## Takeaway

A good prompt says what to do. A good prompt for an agent also says how to know it worked. And the right model is the smallest one that does your task well.
