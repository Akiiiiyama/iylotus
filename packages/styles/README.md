# @iylotus/styles

CSS for [IY Lotus](https://github.com/Akiiiiyama/iylotus): tokens as custom properties, light and dark themes, type classes and base styles.

```bash
npm i @iylotus/styles
```

```js
import '@iylotus/styles';
```

```html
<h1 class="iy-type-h2"><span class="iy-lt">Design </span><span class="iy-bd">Engineer</span><span class="iy-dot">.</span></h1>
```

- **Themes:** follows the operating system by default. Force one with `data-theme="light"` or `data-theme="dark"` on `<html>` or on any block.
- **Variables:** `--color-text-primary`, `--color-action-accent`, `--space-4`, `--radius-pill`, `--ease-out`…
- **Classes:** `.iy-type-display` … `.iy-type-code`, `.iy-lt` / `.iy-bd` (light/bold on whole words), `.iy-dot`, `.iy-mask`, `.iy-mono`.
- Load the fonts yourself: DM Sans (300, 400, 500, 700) and JetBrains Mono (400, 500).

Only `tokens.css` or `base.css`? Import `@iylotus/styles/tokens.css` or `@iylotus/styles/base.css`.

MIT
