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
| [`site`](apps/site) | Isabela Yukari's website, the first product built with IY Lotus (Next.js) | in progress |

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

## Release

Versions use [Changesets](https://github.com/changesets/changesets). `@iylotus/tokens`, `@iylotus/styles` and `@iylotus/react` always share the same version.

1. In a PR, describe the change: `npm run changeset` (pick the packages and patch, minor or major).
2. When the PR is merged, the **Release** workflow opens a "Version packages" PR with the new versions and changelogs.
3. Merging that PR publishes to npm, with provenance.

The workflow publishes only when the repository has the `NPM_TOKEN` secret (an npm automation token for the `iylotus` organization). Without it, it only runs the tests.

## License

MIT
