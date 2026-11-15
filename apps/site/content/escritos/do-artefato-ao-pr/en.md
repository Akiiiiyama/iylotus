I watched the Dive Club episode where Ridd talks with Meaghan Choi, who leads design for Claude Code at Anthropic. It was almost an hour of someone opening up her kitchen: how she goes from a team request to a prototype people actually use, and ends with a pull request, without the handoff to engineering in the middle.

The core of the conversation isn't the tool: the designer's work didn't shrink, it moved up a level. Execution goes to the model, and thinking about the product's shape and mental model stays with us. This text is what I took from that conversation.

## Shape first, then the screen

Before talking about interface, Meaghan uses Claude as a product partner. She brings in research and data, maps the flow and asks whether the thing really needs a UI.

It sounds obvious, but it's easy to skip that part when generating a screen takes seconds. The model will execute a bad idea without questioning it. Deciding the product's shape is still the designer's job, and it's what gives value to everything else.

## A live link instead of a static file

Instead of sending a file nobody opens, she shares an artifact: an interactive, versioned link that people use as if it were the product. Ridd compares it to sending a Figma file to executives, who almost never open it.

Artifacts started as a hack. People asked Claude for HTML and sent it to each other, until it became the way the team prototypes. The logic is simple: fast validation depends on lowering the effort for whoever reviews. A link that works in the browser brings earlier, more concrete feedback than a series of screenshots.

## The artifact also keeps the decision

Beyond prototyping, the artifact becomes a record. She asks for three or four variants, adds a summary of the research and data and links related artifacts. She describes the result as almost a mini microsite and a decision log.

That way anyone can understand why a decision was made, not just what was decided. It's exactly the part of documentation that usually gets lost between one meeting and the next.

## From artifact to PR, in one flow

The flow she showed is short. The team sends a request, she asks Claude for an artifact with the proposal, the team iterates on it and, once it reaches mid fidelity, Claude rebuilds it with the real components and brings it into the repository. From there it becomes a pull request, and the review continues together with engineering.

The prototype stops being disposable. What was validated becomes the starting point of the code, and the conversation with engineering happens in the PR, on top of something that works. She said more than half of the code she ships today comes from PRs Claude started.

## Delegating the repetitive and respecting other people's work

UI polish, code cleanup and opening PRs go to the model, with her preferences saved: draft PR, before-and-after screenshots, CI running. Claude follows Slack conversations and merged work, proposes changes and lets her know when the merge happens. What's repetitive becomes configuration, and the free time goes to the ambiguous problems.

There's a detail worth pointing out. Sometimes she stacks refinement PRs on top of an engineer's PR instead of rewriting what was already there. A designer who ships code earns the team's trust by contributing without stepping on anyone.

## Knowing when craft matters

Experimental work doesn't need polish. Care for the finish matters most once the product's shape is set, because polishing too early is spending time on something that will still change. And quality belongs to the whole team: the idea is to make it easier for engineering and product to spot problems too and raise the bar together.

She also separates what must stay fixed from what can adapt. Login, billing and settings have to be stable, while other parts of the product can change depending on who uses it. Deciding that boundary is design work.

And no dogma about tools: she still uses Figma, with auto layout, when iterating there is faster than in code.

## The designer who will stand out

At the end, Ridd asks which designers will thrive from here on. Her first answer wasn't technical: be open and curious. Have ideas and develop them, but let go when a better path shows up. Keep updating the way you think, your own role and the product. Lean into ambiguity, find a starting point and keep moving, even when the path feels chaotic.

Then she adds judgment to decide what to build and end-to-end ownership. And she reminds us it's still early, so whoever is working now helps define what this becomes.

## What I'm taking to my work

I left the episode with five things to try. Before opening any tool, write the product's shape and mental model in a few lines. On the next feature request, send an artifact prototype instead of screenshots or a static file. Generate three variants with a short rationale and use that as the decision record. Once the prototype is validated, bring it into the repo with the real components and open a draft PR with before-and-after screenshots. And save those PR preferences in a `CLAUDE.md`, so I don't repeat them every time.

None of this depends on working at Anthropic. It depends on treating the prototype as the beginning of the product, not as a drawing someone will redo later.

## Watch it

The episode runs about 54 minutes and is on [YouTube](https://www.youtube.com/watch?v=jEEbjiC4JE0). The moments I'd go back to:

| Time | Topic |
|---|---|
| 01:35 | Joining Anthropic and early Claude Code days |
| 03:14 | Designing for the command line (CLI) |
| 07:45 | The "magic moment" and personality in the tool |
| 10:19 | Artifacts: prototyping, sharing and decision log |
| 19:38 | Claude Tag: a Claude shared across the organization |
| 27:56 | Claude-initiated PRs |
| 31:53 | Offloading execution vs. high-level design thinking |
| 38:48 | Letting go of craft |
| 42:48 | Fixed vs. adaptive interfaces |
| 46:53 | New challenges and the designer's role |
