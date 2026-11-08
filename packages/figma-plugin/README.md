# IY Lotus · Figma plugin

Creates the IY Lotus foundations in any Figma file, straight from `@iylotus/tokens`. No network access: the tokens are bundled into the plugin at build time.

## What it creates

| Command | Result |
|---|---|
| **Variables** | Collection `IY Lotus · Root` (one mode, `Value`): colors, space, radius, border, duration, font weight and family, easing, breakpoints. Collection `IY Lotus · Stem` with modes `Light` and `Dark`, each token an alias to a Root variable. |
| **Text & effect styles** | `type/display` … `type/code` (DM Sans and JetBrains Mono), and `shadow/1` … `shadow/3`. |
| **Foundation pages** | Page `🌱 Root` with every color swatch bound to its variable. |
| **Button component** | Page `🌸 Button` with a component set: 5 variants × 3 sizes × 3 states, fills and labels bound to theme variables. |
| **Sync everything** | All of the above, in order. |

Running it again updates what exists instead of duplicating it. The `Color` board and the `Button` component set are rebuilt each time, so detach or copy them before editing by hand.

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
