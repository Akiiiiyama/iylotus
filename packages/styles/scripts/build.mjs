// Transforma @iylotus/tokens em CSS: variáveis dos primitives, temas light/dark e classes de tipografia.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { primitives, typography, themes } = JSON.parse(await readFile(require.resolve('@iylotus/tokens/tokens.json'), 'utf8'));
const here = (p) => new URL(`../${p}`, import.meta.url);

const cssName = (name) => `--${name.replace(/\//g, '-')}`;

function cssValue(t) {
  switch (t.type) {
    case 'cubicBezier': return `cubic-bezier(${t.value.join(', ')})`;
    case 'fontFamily': return t.value.map((f) => (/\s/.test(f) ? `'${f}'` : f)).join(', ');
    case 'shadow': { const s = t.value; return `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`; }
    default: return String(t.value);
  }
}

// Tema aponta para o primitive (var(--color-neutral-950)) em vez do hex: a camada Stem continua visível no CSS.
const themeDecl = (list) => list.map((t) => `  ${cssName(t.name)}: ${t.ref ? `var(${cssName(t.ref)})` : cssValue(t)};`).join('\n');

const tokensCss = `/* @iylotus/styles · gerado a partir de @iylotus/tokens. Não edite à mão. */

/* Root: primitives */
:root {
${primitives.map((t) => `  ${cssName(t.name)}: ${cssValue(t)};`).join('\n')}
}

/* Stem: tema light (padrão). Também vale para qualquer bloco com data-theme="light". */
:root, [data-theme="light"] {
${themeDecl(themes.light)}
  color-scheme: light;
}

/* Stem: tema dark, pelo sistema operacional… */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${themeDecl(themes.dark).replace(/^/gm, '  ')}
    color-scheme: dark;
  }
}

/* …ou escolhido na página */
[data-theme="dark"] {
${themeDecl(themes.dark)}
  color-scheme: dark;
}

/* Tipografia: uma classe por estilo da escala */
${typography.map((t) => {
  const v = t.value, cls = `.iy-type-${t.name.split('/').at(-1)}`;
  const family = v.fontFamily.map((f) => (/\s/.test(f) ? `'${f}'` : f)).join(', ');
  const upper = t.name.endsWith('label') ? '\n  text-transform: uppercase;' : '';
  return `${cls} {\n  font-family: ${family};\n  font-size: ${v.fontSize};\n  font-weight: ${v.fontWeight};\n  line-height: ${v.lineHeight};\n  letter-spacing: ${v.letterSpacing};${upper}\n}`;
}).join('\n\n')}
`;

const baseCss = await readFile(here('src/base.css'), 'utf8');

await mkdir(here('dist'), { recursive: true });
await writeFile(here('dist/tokens.css'), tokensCss);
await writeFile(here('dist/base.css'), baseCss);
await writeFile(here('dist/iylotus.css'), `${tokensCss}\n${baseCss}`);
console.log(`@iylotus/styles: ${primitives.length} primitives, ${themes.light.length} theme tokens × 2 modes, ${typography.length} type classes`);
