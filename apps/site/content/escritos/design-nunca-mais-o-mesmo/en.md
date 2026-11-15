I watched "Design Will Never Be The Same", Meaghan Choi's talk at uxcon vienna. She leads design for Claude Code at Anthropic and is living from the inside what a lot of us are still trying to understand from the outside: what happens to the designer's role when the lines between design, code and product start to blur.

The title sounds like a warning, but the last line of the talk flips it: design will never be the same because it's more than ever before. This text is what I took from it, mixed with what I've been feeling in practice.

## From convincing people to nobody needing convincing

Meaghan opens by sharing that, a year ago, a big part of her job was convincing designers and design teams to try AI coding. And when she succeeded, the second battle began: convincing engineering to let those designers into their codebases.

Today, she says, nobody needs convincing anymore. The problem is the opposite. A Designer Fund study from early 2026 shows that 65% of designers say they're taking on more product or engineering responsibilities. The designer's role already goes way beyond design.

## Stressful and fun at the same time

One of the most honest parts of the talk is admitting that design has never been this hard. It always feels like we're behind: a new tool every week, a new workflow to optimize every day, a pile of terms that are still more buzzword than practice.

At the same time, she shows people building amazing, fun and even deliberately "useless" things, projects that wouldn't exist without AI tools. Her summary: design has never been so stressful, and never been so fun.

For her, part of the discomfort comes from talking about change in a vague way, as if it simply happens to us. So the talk tries to name exactly what changed, and that's what helped me organize my own thinking the most.

I agree. It's a hard era, with too much information arriving too fast. But I see curious people, the ones with a critical and strategic sense, thriving in the middle of it.

## The three underlying shifts

The first shift is the most obvious: anyone can code. Meaghan calls AI coding the second major use case for AI, after search, and says plainly that designers should be coding. That debate is over, it's part of the job.

The second comes from the first: trying out a new idea is now basically free. We have an abundance of ideas, which isn't necessarily a good thing.

The third is the one that weighs on us emotionally: the expectation of speed. What used to take months can now, in theory, take days or hours. Even when that isn't true, the environment makes it feel like we should be moving faster.

The result is that the process we learned (discover, define, explore, refine, build and ship) got compressed into something like build and ship. But it's not the same "build and ship" as before.

| Before | Now |
|---|---|
| Each step had a concrete deliverable | Continuous iteration on something that works |
| A clear owner per step (PM, design, engineering) | Blended roles, each learning from the others |
| Handoffs between functions | Shared responsibility and decisions |
| Weeks or months | Much shorter cycles |

The most successful teams she sees are the ones leaning on each other and learning from their partners' skills. Engineering got much faster, but not every part of the process sped up with it. Design hasn't caught up yet, and quality became hard to sustain in a world where everyone is shipping.

## The new challenge: deciding what's worth building

She asks the audience: how many times this year has someone dropped an idea or a weekend demo on your plate? Almost everyone raises a hand. Then: how many of those ideas were good? Almost no one.

A demo used to be a sign of effort, and effort hinted there was something good underneath. Now building is so cheap that a demo doesn't signal anything anymore. She calls it "idea slop" and says a 10 to 20% hit rate is already genius-level innovation.

That's why the usual questions still exist, and maybe they've never mattered more:

- Should this exist?
- Who is it for? Is that a real person, or is it just you?
- What problem does it solve? Is it a real problem?
- Does it make sense within the product we're building?

She shares an example from Anthropic. Claude Design started as an engineer's demo showing that Claude could generate HTML. A designer on the team saw a tool for designers in it, built a functional prototype, noticed the results got much better when Claude had access to the design system and created a skill for that. Then came the brand, then slides, and the marketing and sales teams started using it. Every product decision along the way was made by design.

That's where the new skills she puts on the table come from:

| Skill | What it means |
|---|---|
| Audience and use cases | What has always been the foundation of design: who it's for and why |
| Demos > mocks | Iterating on a product that actually works, not on docs or static screens |
| M-LVU-P | Defining the first minimum lovable, viable or usable product |
| Strategy | Understanding how the idea fits the roadmap: priority, headcount, launch plan |

For me, the most important new skill is the boldness to turn an idea into something that actually works. We're past the era of the static document. You have to use it and make sure it works.

## Deciding when it's ready

The second part of the new process is knowing when something is ready to ship. Meaghan shows how much Anthropic designers' code contributions grew over the last six months, and that's code going to production, not a playground. She remembers that at her previous job she had to beg for repo access and still wasn't allowed to merge.

It used to be engineering that dictated when something was ready ("this will take two or three weeks"). Today there's often no handoff: the designer implements the last mile, and making sure it's ready became design's responsibility.

Her example is the Claude Code desktop app, which had three launches with different bars:

| When | Launch bar | Who drove it |
|---|---|---|
| Late 2025 | Make it work. Built in one week, with plenty of rough edges | Design and engineering together |
| Early 2026 | Redesign it into a real developer tool | Almost entirely design |
| Mid 2026 | Speed and reliability | A joint decision, with lots of design work on loading, hover and click behavior |

The third one caught my attention the most: a performance push, which traditionally would be engineering-only work, also had a lot of design work inside it.

## Coding is not enough

This is the point that hit me hardest. Yes, we should be coding. But Meaghan says that's not enough, and suggests asking an engineer whether all they do is write code. It isn't.

Engineering teams have other responsibilities within their scope, and over years they've learned to deal with the pipeline they go through every day. That's what we need to learn from them:

- **Scoping implementation** and estimating timelines.
- **Defining "done"** in concrete terms. We can't say "you'll know it when you see it" anymore. Quality has to be defined and measured.
- **Negotiating timelines**, recognizing when to push a launch or when something can be a fast follow.
- **Reviewing PRs**, looking at the front end and the user experience.
- **Turning design review into automated checks.**

That last one deserves its own paragraph. Large companies have DevOps or DevX teams whose job is to make implementation faster for engineering. Now that designers are coding, we need the same: automations that check adherence to the design system, content guidelines and accessibility rules. Meaghan herself has a bot that reviews PRs, and admits AI isn't great at this yet, but it's already showing early signs that it works.

She also reminds us that when you set the launch bar, you're not doing it just for yourself, but for the whole team that will help you implement the last mile.

In IY Lotus, my design system, I built a small version of this. Instead of eyeballing contrast, the bar became a test: every text and background pair has to pass AA (4.5:1 for text, 3:1 for icons and focus), in both the light and dark themes. If a new token breaks contrast, the test fails before anything is published.

## It's not taste, it's judgment

With everything blended and timelines compressed, you can't do it all. So she asks: what is it that only designers can do?

Her answer is that it's not "taste", because that word is too vague. It's design judgment. And she goes further, naming what she sees designers doing that other functions don't:

- **Creative solutions:** few functions explore so much variation and iterate on top of it like we do.
- **Simplifying complexity:** we're the bridge between the technology and the people who use the product.
- **Product cohesion:** caring about the end-to-end experience, so the app feels like one product and not a set of disconnected features.
- **Fit and finish:** the details that turn something functional into an experience people enjoy using.

Her warning is strong: if designers themselves accept that design is dead and that we're automatable, we'll end up in a world of joyless apps. She doesn't think that's where we're headed, but she treats it as a call to action.

## What stuck with me from the Q&A

Some answers from the Q&A are worth as much as the talk itself:

- **User research:** Anthropic relies on its research team more than ever. Tactical studies have been automated, and researchers now focus on the strategic questions. When designers or engineers run research on their own, she says, the results are bad.
- **Team structure:** they work in fluid "pods", sometimes one designer and two engineers, sometimes a PM and a designer, which shift depending on the phase of the project.
- **How to start in a more traditional company:** start small, with a team of two or three people. Once the organization sees how much faster it is to decide and build this way, it becomes the natural way of working.
- **Designers as the bottleneck:** at Anthropic, design became the most sought-after resource and the role they're trying to hire most.
- **Tools:** there's no right tool or workflow, just as there never was. And she says it's actually not good to be on the frontier right now: if she didn't work at an AI lab, she'd wait three or four months for the dust to settle before adopting something new.
- **Security:** when a designer reviews a PR, they look at the front end and the experience. Security stays with engineering, the DevOps teams and the automated checks.

## To wrap up

The big change is that anyone can code. Our big challenge is figuring out what's actually worth building and what actually delivers value.

Our process is much more hybrid, and we need to go after skills we didn't need before. But this moment is also opening up opportunities to build new and more creative things, and to shape an idea our own way, without depending on so many people to get it off the ground.

Meaghan closes by saying this won't happen if we wait for it to happen to us. We have to be open, curious and take the time to learn. Those who do won't just be preparing themselves, they'll be helping define the role design plays from here on.

The full talk is on [YouTube](https://www.youtube.com/watch?v=na1OyJ3E7Kc).

## Read next

[From artifact to PR](/en/escritos/do-artefato-ao-pr), about her conversation on the Dive Club podcast: how she goes from artifact to PR.
