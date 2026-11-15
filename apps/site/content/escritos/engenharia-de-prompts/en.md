## Summary

- **Prompt engineering** is the practice of writing instructions that lead a language model to the answer you need.
- The model **doesn't understand** the way a person does: it predicts the most likely text based on what is written. If something is only implied, it doesn't know it.
- A good prompt has **5 elements**: instruction, context, example, input data and output format.
- For designers, this is a familiar skill: **a prompt is a brief**. And, more and more, it is also part of the product we design.

---

## 1. What prompt engineering is

A prompt is the text you send to an AI model: a question, a request, some material to analyze. Prompt engineering is writing that text **intentionally**, testing the result and adjusting until the answer is useful.

It's not about memorizing "magic prompts". It's about communicating well: saying what you want, for whom, based on what, and in what format.

## 2. How the model reads a prompt

Understanding the mechanism explains why some instructions work and others don't.

1. **Tokenization.** The text is split into *tokens*: words, parts of words or characters.
2. **Embeddings.** Each token becomes a numeric vector that represents its meaning.
3. **Attention.** In the *Transformer* architecture, the model relates each token to every other token in the text, not just its neighbor. That's how it uses context.
4. **Prediction.** The model calculates the most likely next token, writes it, and repeats until the answer is done.

What this means in practice:

| How the model works | What to do in your prompt |
|---|---|
| It predicts the most likely answer | Be specific. A vague request gets a generic answer, because generic is the most likely. |
| It relates every part of the text | Give context. Each relevant detail changes the weight of everything else. |
| It only knows what is written | Leave nothing implied. What's in your head is not in the prompt. |
| It learns from patterns | Show examples. An example explains style better than a description. |

## 3. Why it matters

- **Quality.** The difference between a generic answer and a usable one is usually in the prompt, not the model.
- **Time.** A well-structured prompt cuts down the back-and-forth of corrections.
- **Consistency.** Structured prompts can be reused and shared with the team, giving similar results every time.
- **Critical thinking.** Knowing how the model works helps you understand its limits: when it may make things up, when context is missing, when the answer needs review.

## 4. Why it matters for designers

### A prompt is a brief

Designers already know that a bad brief leads to bad work. Goal, audience, constraints, references, deliverable: these are exactly the elements of a good prompt. The skill isn't new; only the recipient changed.

### AI is already part of the design workflow

- **Research:** synthesizing interviews, clustering feedback, raising hypotheses.
- **UX writing:** generating microcopy variations, error messages, empty states.
- **Visual exploration and prototypes:** tools that generate screens and code from text respond directly to the quality of the request.
- **Design engineering:** asking for components that follow the design system means passing tokens, rules and examples in the prompt.

In all of these cases, whoever writes the prompt is, in practice, directing the result.

### The prompt is also interface

In AI products, designers don't just *use* prompts: they **design** the experience around them. That includes:

- The assistant's behavior and tone (the system instructions).
- What happens when the AI doesn't know, gets it wrong or needs more information.
- How users write their own requests: suggestions, examples, fields that already carry context.

Understanding prompt engineering helps you design these experiences knowing what's behind them, and talk to engineering and product as an equal.

### Quality criteria

AI generates fast, but it doesn't decide what is good. Judging whether an answer serves the user, the context and the quality bar is still design work. A well-written prompt already carries that criteria: it says what a good answer looks like before it exists.

## 5. The 5 elements of a good prompt

| Element | What it is | Example (UX research) |
|---|---|---|
| **Instruction** | The task, direct and unambiguous | "Synthesize the interviews below into main themes." |
| **Context** | Who it's for, the goal, the situation | "These are interviews with users of a personal finance app who dropped off during sign-up. The goal is to prioritize onboarding improvements." |
| **Example** | A sample of what you expect | "For each theme, something like: *Theme: distrust when asked for personal data · Evidence: 'why do they need my ID number on the very first screen?'*" |
| **Input data** | The specific material to use | The research transcripts, notes or answers. |
| **Output format** | Length, structure, tone | "A table with theme, frequency, quote and impact. At most 6 themes, sorted by impact." |

### Template to copy

```
[INSTRUCTION]
What you want done, in one sentence.

[CONTEXT]
Who it's for, the goal, the situation.

[EXAMPLE]
A sample of the result you expect.

[INPUT DATA]
The material the model should use.

[OUTPUT FORMAT]
Length, structure (bullets, table, paragraphs) and tone.

Before answering, ask me about anything that's missing.
```

## 6. Before and after

**Before**

```
Give me onboarding ideas for an app.
```

The result is a list that would fit any product: guided tour, tooltips, checklist.

**After**

```
Suggest 3 onboarding ideas for a personal finance app.

Audience: people aged 25 to 35 who have never used an expense-tracking app.
Problem: many users drop off during sign-up before they see the product's value.

Example of what I expect: "Show a simulated spending summary before asking for
any data, so people see the value first."

Format: for each idea, a name, how it works (2 sentences), which problem it
solves and one risk. Direct tone.
```

The request is the same. The difference is that, in the second one, the model doesn't have to guess anything.

## 7. Common mistakes

1. **Asking for everything in one prompt.** Split it into steps: structure, content, refinement.
2. **Not giving an example.** A sample of what you want is worth more than a paragraph describing it.
3. **Not defining the format.** If you don't specify length, tone and structure, the model chooses.
4. **Accepting the first version.** The first answer is a draft. Ask for changes.
5. **Not asking the model what's missing.** One line at the end of the prompt prevents answers based on assumptions.

## 8. Takeaway

The best prompt isn't the longest one. It's the one that leaves nothing for the model to guess.

If you can write a good brief, you're already halfway there.

---

Next: [Claude agents and models](/en/escritos/agentes-e-modelos).
