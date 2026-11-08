# @iylotus/tokens

Design tokens of [IY Lotus](https://github.com/Akiiiiyama/iylotus), in the W3C DTCG format.

```bash
npm i @iylotus/tokens
```

```js
import { tokens, themes } from '@iylotus/tokens';

tokens.color.red['600'];              // '#C8102E'
tokens.space['4'];                    // '16px'
themes.dark.color.text.primary;       // '#FFFFFF'
```

- `@iylotus/tokens/tokens.json`: every token as a list (`name`, `type`, `value`, `ref`), used to generate CSS and the Figma variables.
- `@iylotus/tokens/src/*`: the DTCG source files.

Layers: **Root** (primitives) → **Stem** (theme, light and dark) → components. Every theme token points to a primitive.

MIT
