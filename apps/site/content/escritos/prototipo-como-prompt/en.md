## Summary

- Since November 3, 2026, when you create a **code layer** from frames in Figma Design, the agent **reads the prototype connections and interactions** between those screens. Code layers are in open beta.
- I tested the same flow (Login → Home, dark mode, built with my design system) in two ways: **prompt only**, and **prototype connections plus a one-line prompt**.
- Navigation worked in both. With connections, it **didn't forget interactions** and even **created an error state** I hadn't designed.
- In both cases, **no design system variable made it into the code**: colors became hard-coded values, some colors were made up, and the font came with a name the browser doesn't recognize.
- The prototype works very well as a prompt **for behavior**. For the **design system**, you still have to ask.

---

## 1. What changed

Before, to turn screens into a coded prototype, we described the flow in the prompt: "when tapping Sign in, go to Home". Now, if the screens already have prototype connections (the *On click → Navigate to* in the Prototype tab), the agent uses them as context.

The [release note](https://www.figma.com/release-notes/) promises less time writing prompts for the complex parts of a flow and more time refining the prototype and finding edge cases.

For designers, this changes the weight of the prototype: it stops being just the validation step and becomes **the code brief**. The more complete it is, the less you need to explain.

## 2. The experiment

**The screens:** Login and Home, mobile (393 × 852), dark mode, built with my design system's components, variables and text styles.

- **Login:** logo, title, email field, "Continue" button, "or", Google and Apple buttons, terms in the footer.
- **Home:** search, a highlighted value over a neutral gradient, quick actions, a recent items card and a floating menu.
- **Connections:** "Continue" goes to Home with Smart Animate (300 ms). The avatar on Home goes back to Login.

**The only variable in the test:** how the code layer receives the flow.

| | Test A | Test B |
|---|---|---|
| Prototype connections | Removed | Kept |
| Prompt | Detailed, explaining the flow | One line |

Test A prompt:

> Turn these two screens into a working prototype. When tapping Continue on Login, go to Home with a smooth transition. When tapping the avatar on Home, go back to Login. Keep the colors, fonts, spacing and floating menu as in the design.

Test B prompt:

> Turn these screens into a working prototype.

## 3. How to repeat the test

1. **Define "done" first.** For example: navigation goes back and forth, and the visuals match Figma. Without that, you don't know when to stop fixing.
2. **Duplicate the screens into clean copies**, one per run: A1, A2, B1, B2. Running each test twice helps, because AI doesn't answer the same way every time.
3. **In the A copies, delete the connections** in the Prototype tab and check in Prototype mode that no arrows are left.
4. **Create the code layer** by selecting both screens, with the test prompt.
5. **Time it and write down** every correction prompt until you reach "done".
6. **Compare** using the table in the next section, and **read the code**, not just the preview.
7. **Record your screen.** The moment test B navigates without you explaining anything is the best material to show the result.

## 4. What happened

| Criterion | A: prompt only | B: connections + minimal prompt |
|---|---|---|
| Login ↔ Home navigation | Worked | Worked |
| Menu interactions | Forgot some | Worked, with active tab |
| Transition | Almost the same, needed tweaks | Almost the same, needed tweaks |
| Visual fidelity | Same in both | Same in both |
| States I didn't design | None | Created an invalid email error |
| Code organization | Long classes in the JSX | Named classes and separate CSS |
| Design system variables | None | None |

The times were close: 2m10s and 2m35s. The bigger difference wasn't speed, it was **how much I had to explain** and **how much it forgot**.

## 5. Hard-coded values × variables

This was the most revealing part, and it applies to any design to code tool.

- **A hard-coded value** is a color or size written straight into the code: `background: #1c1c1c`. If the design system changes, this code never finds out.
- **A variable** is the code pointing to the token: `background: var(--color-bg)`. The value lives in one place and changes everywhere at once.

In Figma, the screens used variables for almost everything. In the code, both tests came back with **100% hard-coded values**: the agent took each variable's value at that moment and left the token name behind.

| In the generated code | Token it should be |
|---|---|
| `#1c1c1c` | `color/bg` |
| `#232323` | `color/surface` |
| `#2a2a2a` | `color/surface-raised` |
| `#363636` | `color/border` |
| `#a8a8a8` | `color/text/secondary` |
| `#c8102e` | `color/action/accent` |

And when the reference is missing, AI guesses:

- **Made-up colors.** A lighter red hover (`#dc1436`) and a gray border (`#484848`) that don't exist in the design system.
- **Small drifts.** Opacities of 18%, 20%, 24% and 25% where the design had 16% everywhere, and an 8px blur where the design had 16px.
- **Wrong font name.** The code came with `font-family: "DM Sans:Bold"`, which is how Figma names the style internally. The browser doesn't recognize it and falls back to the default font. The right way is `font-family: "DM Sans"` with `font-weight: 700`.
- **Spacing right by coincidence.** It matched because Tailwind's scale also steps by 4px, like my design system, not because it read the tokens.

## 6. Checklist for reviewing generated code

- [ ] Do colors use variables (`var(--...)`) or hard-coded hex values?
- [ ] Is there any color or size that **doesn't exist** in the design system?
- [ ] Is the `font-family` a valid name, and does the font actually load in the browser?
- [ ] Did text styles become loose sizes (`34px`) or a reusable pattern?
- [ ] Did design system components become components in code, or was each button rewritten?
- [ ] Do fields have a `<label>`, is focus visible, and can you navigate with Tab?
- [ ] Does the active tab have `aria-current`, and do dynamic notices have `aria-live`?
- [ ] Do the states the AI created on its own (error, toast) make sense, or are they made-up behavior?

## 7. Next test

Repeat test B, explicitly asking for the tokens:

> Use CSS variables with the same names as the Figma variables (for example `--color-bg` and `--color-action-accent`) instead of hex values, and font-family "DM Sans" with font-weight.

The question is whether asking is enough, or whether you still need to give the design system to the AI another way (for example through Dev Mode, the Figma MCP server or a tokens file in the repository).

## Takeaway

Connecting the prototype is worth it: less prompting and fewer forgotten interactions. But a prototype that works isn't the same as code that's ready to ship. Before calling it design to code, open the code and look for your tokens.
