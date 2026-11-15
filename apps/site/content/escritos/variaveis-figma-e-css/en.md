## Summary

- **CSS variables** are the in-code version of Figma variables: the value lives in one place and everything else calls it by name.
- Code can look **visually identical** to the design and still use no tokens at all. The difference only shows up when the design system changes.
- To find out, cross-check three things: **what is bound in Figma**, **what is written in the code** and **whether the values match**.
- When AI doesn't get the token name, it copies the value and sometimes **makes up** colors and sizes that don't exist in the design system.
- You can check without knowing how to code: **the Fill panel and Dev Mode in Figma, a search in the code and the browser's Inspect.**

---

## 1. What CSS variables are

In Figma, when you paint a button with the `color/action/accent` variable, the button stores **the name** of the variable. The value (`#c8102e`) lives in one place, the variables panel. If you change the red there, every button changes.

CSS follows the same idea, in two steps:

```css
/* 1. Define once, in :root (the "top" of the page) */
:root {
  --color-action-accent: #c8102e;
  --color-bg: #1c1c1c;
}

/* 2. Use it by name anywhere */
.primary-button {
  background: var(--color-action-accent);
}
```

- `--color-action-accent` is the variable. The name starts with two hyphens.
- `var(...)` is how you call the variable, like attaching the variable chip to a Fill instead of typing the hex.
- By convention, the slashes in Figma names become hyphens in CSS: `color/action/accent` becomes `--color-action-accent`.

A **hard-coded value** is the opposite: a color or size written straight into the code, like `background: #c8102e`. It looks the same on screen today, but that code never finds out when the design system changes.

## 2. A real example: my site's header

The floating header on my portfolio is written only with variables from my design system, IY Lotus:

```css
.topbar__panel {
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--color-surface) 82%, transparent);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-2);
}
```

No hex shows up. That's why the site's light/dark theme switch works: in dark mode, the site redefines the value of `--color-surface`, and everything that uses that variable changes with it, without touching any component.

## 3. How I analyzed the generated code

After generating a coded prototype with Figma code layers (the experiment is in the [Prototype as prompt](/en/escritos/prototipo-como-prompt) guide), I did this analysis in three steps.

1. **I checked what was bound in Figma.** I listed, for each layer, which variable was applied. For example: the Continue button background on `color/action/accent`, the button text on `color/action/on-accent`, the email field on `color/surface-raised` with a `color/border` stroke. I also wrote down each variable's value in dark mode: `color/bg = #1c1c1c`, `color/surface = #232323`, `color/border = #363636`.
2. **I searched the code for variables.** I searched for `var(--` and found none. I searched for `#` and found dozens of colors written directly: `#1c1c1c`, `#363636`, `#c8102e`.
3. **I cross-checked both.** Every hex in the code matches the value of a Figma variable exactly. Conclusion: the AI read the variable's value at that moment and wrote down the number, leaving the name behind. And some hex values don't match any token: those were made up.

## 4. Before × after: what came out and what it should be

### Primary button

What came out:

```jsx
className="bg-[#c8102e] hover:bg-[#dc1436] rounded-full h-14 text-[17px]"
```

What it should be:

```jsx
className="bg-[var(--color-action-accent)] hover:bg-[var(--color-action-accent-hover)] rounded-[var(--radius-pill)]"
```

`#dc1436` doesn't exist in my design system. The right hover is `color/action/accent-hover`, which is `#a80d27` and **darker**. Without the reference, the AI made up a lighter red.

### Floating menu

What came out:

```css
.floating-menu {
  border: 1px solid #363636;
  border-radius: 18px;
  background: rgba(35, 35, 35, 0.92);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(8px);
}
```

What it should be:

```css
.floating-menu {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--color-surface) 82%, transparent);
  box-shadow: var(--shadow-2);
  backdrop-filter: blur(16px);
}
```

`rgba(35, 35, 35, ...)` is the same `#232323` (`color/surface`), just written another way. And the opacity came out at 92%, not the 82% in the design. The blur came out at 8px, not 16px.

### Font

What came out:

```css
font-family: "DM Sans:Bold", sans-serif;
```

What it should be:

```css
font-family: var(--font-family-sans); /* "DM Sans" */
font-weight: 700;
```

`"DM Sans:Bold"` is the internal name Figma gives the style. No installed font has that name, so the browser falls back to `sans-serif`, the system's generic font. It looks "almost right", which is why it goes unnoticed.

### Screen background

What came out:

```css
background: #1c1c1c;
```

What it should be:

```css
background: var(--color-bg);
```

## 5. Why it matters

Imagine that tomorrow you tweak the design system's red or create a light mode for the app.

| | With variables | With hard-coded values |
|---|---|---|
| Changing a color | Change the value in `:root` and the whole app follows | Hunt down every `#c8102e` in the code and change it by hand |
| Creating light mode | Redefine the variables, like my site does | Rewrite every color |
| Colors outside the system | Easy to spot, because they stand out from the names | Hidden among dozens of hex values |
| Design and code talking | Both use the same name: `color/surface` | Design says `color/surface`, code says `#232323` |

It's the same difference as using the variable in Figma versus typing the hex straight into the Fill: it looks the same today, but only one of them keeps up with the design system.

## 6. Where to check

### In Figma

1. Select an element and look at the **Fill** panel. If you see a chip with a name (`color/action/accent`), it's a variable. If you only see the hex (`C8102E`), it's a hard-coded value.
2. In **Dev Mode**, in the inspect tab, the code snippet shows the variable names for the selection.
3. Do the same for strokes, corners and spacing: they can also be bound to variables.

### In the code

1. Search for `var(--` (Ctrl+F or Cmd+F). Zero results means no token made it.
2. Search for `#`. Each result is a hard-coded color: check whether it exists in your design system.
3. Search for `rgba(`. Sometimes the same color shows up written in another format.
4. Search for `font-family` and check that the name is the real font's name.

### In the browser

This works on any site and on the preview of the generated prototype.

1. Right-click the element and choose **Inspect**.
2. In the **Styles** tab, see whether the property shows `var(--...)` or a hard-coded value.
3. For the font, go to the **Computed** tab and scroll to the bottom. The **Rendered Fonts** section shows the font that was actually drawn. If it says Helvetica or Arial instead of DM Sans, the font didn't load.

A tip: first inspect a site you know uses variables, like your own. Then inspect the generated code. The difference becomes visible in seconds.

## 7. How to ask AI to use the tokens

Ask explicitly, with the names:

> Use CSS variables with the same names as the Figma variables (for example `--color-bg` and `--color-action-accent`) instead of hex values, and font-family "DM Sans" with font-weight.

Then check the result with the steps in section 6. Asking is the first test. If it isn't enough, the next step is to give the design system to the AI another way, like a tokens file in the repository.

## Takeaway

Code can look identical to the design and contain no piece of your design system at all. The screen doesn't show it. The code does.

Before calling a result design to code, search for `var(--`. It's the fastest way to know whether the code will keep up with your design system or grow old on its own.
