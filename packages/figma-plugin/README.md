# IY Lotus · Figma plugin

Creates the IY Lotus foundations in any Figma file, straight from `@iylotus/tokens`. No network access: the tokens are bundled into the plugin at build time.

## What it creates

| Command | Result |
|---|---|
| **Variables** | Collection `IY Lotus · Root` (one mode, `Value`): colors, space, radius, border, duration, font weight and family, easing, breakpoints. Collection `IY Lotus · Stem` with modes `Light` and `Dark`, each token an alias to a Root variable. |
| **Text & effect styles** | `type/display` … `type/code` (DM Sans and JetBrains Mono), and `shadow/1` … `shadow/3`. |
| **Foundation pages** | Page `🌱 Root` with every color swatch bound to its variable. |
| **Button component** | Page `🌸 Button` with a component set: 5 variants × 3 sizes × 3 states, fills and labels bound to theme variables. |
| **Inputs components** | Page `🌸 Inputs`: TextField (5 states), TextArea (2), Select (3), Checkbox (checked, unchecked, indeterminate × disabled), Radio (4) and Switch (4). |
| **Card component** | Page `🌸 Card`: 4 tones × 2 shapes. `raised` is bound to theme variables; `grey`, `ink` and `red` to fixed Root colors, like the reel's scenes. |
| **Support components** | Page `🌸 Support`: Tag, Badge (3 tones), Avatar (3 sizes, with the red dot), Link and Divider (2 weights). |
| **Sync everything** | All of the above, in order. |

The variant names match the React props (`variant=accent, size=md`, `tone=red, shape=tile`), so a designer and a developer read the same thing.

Running it again updates what exists instead of duplicating it. The `Color` board and the component sets are rebuilt each time, so detach or copy them before editing by hand.

**Known differences from the code:** the Link underline is red in code but follows the text color in Figma, and the focus ring of the TextField is a fixed shadow instead of a bound variable.

**Free (Starter) plan:** a collection can have only one mode. The plugin then puts the dark theme in a second collection, `IY Lotus · Stem (Dark)`, and says so in the closing message.

## Install (development plugin)

Development plugins are free and run only on your machine. They need the Figma desktop app.

1. Build the plugin from the repository root:

   ```bash
   npm install
   npm run build
   ```

2. In Figma Desktop, open any design file.
3. Menu **Plugins → Development → Import plugin from manifest…**
4. Pick `packages/figma-plugin/manifest.json`.
5. Run it from **Plugins → Development → IY Lotus → Sync everything**.

After changing tokens, run `npm run build` again and re-run the plugin. Figma reloads `dist/code.js` on each run.

## Develop

- `src/code.js` is the plugin. It avoids `?.`, `??` and object spread so it runs in every version of Figma's plugin sandbox.
- `scripts/build.mjs` replaces `__IYLOTUS_TOKENS__` with `@iylotus/tokens/dist/tokens.json` and writes `dist/code.js`.
- `npm test` runs the plugin against a simulated Figma API and checks the variables, aliases, modes, styles, pages and the Button. It does not replace a run in the real Figma.
