# IY Lotus

*Growth, beauty, discipline and wisdom.*

The design system behind Isabela Yukari's work. It grows in layers, like the flower:

| Layer | What it is | Example |
|---|---|---|
| **Root** | Primitives: raw values | `color/red/600 = #C8102E` |
| **Stem** | Theme: meaning, in light and dark | `color/action/accent` |
| **Petal** | Components | `<Button variant="accent" />` |
| **Bloom** | Layouts and pages | the Design Engineer site |

A component never uses a primitive directly. It always goes through a theme token.

## Packages

| Package | What it ships | Status |
|---|---|---|
| [`@iylotus/tokens`](packages/tokens) | Tokens in the W3C DTCG format, resolved to JSON and JavaScript | ready |
| [`@iylotus/styles`](packages/styles) | CSS custom properties, light/dark themes, type classes, base styles | ready |
| [`@iylotus/react`](packages/react) | React + TypeScript components with Storybook | v1 components ready |
| [`@iylotus/figma-plugin`](packages/figma-plugin) | Figma plugin that creates the variables, text styles and components from the tokens | variables, styles, all v1 components |

## Use

```bash
npm i @iylotus/styles
```

```css
@import '@iylotus/styles';
```

```html
<html data-theme="dark">
  <h1 class="iy-type-h2"><span class="iy-lt">Design </span><span class="iy-bd">Engineer</span><span class="iy-dot">.</span></h1>
</html>
```

Without `data-theme`, the page follows the operating system.

## Develop

```bash
npm install
npm run build   # tokens → JSON/JS → CSS
npm test        # build + WCAG contrast checks + component tests
npm run storybook   # component docs at http://localhost:6006
```

The source of truth is [`packages/tokens/src`](packages/tokens/src). Edit the JSON there, then build. Everything in `dist/` is generated.

## Rules

- **Discipline:** 4 px spacing scale, every state for every component, the same name in Figma, CSS and React.
- **Wisdom:** WCAG AA at minimum. `npm test` fails if a theme token drops below 4.5:1 for text or 3:1 for icons and focus.
- **Beauty:** light and bold on whole words, one red accent on about 10% of the screen.

| Figma | CSS | JS |
|---|---|---|
| `color/action/accent` | `--color-action-accent` | `themes.light.color.action.accent` |
| `space/4` | `--space-4` | `tokens.space['4']` |
| `type/h2` | `.iy-type-h2` | `tokens.type.h2` |

## License

MIT
