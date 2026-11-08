// Lê os tokens no formato DTCG (src/), resolve as referências {color.neutral.0}
// e gera dist/tokens.json (lista para CSS e para o plugin do Figma) e dist/index.js (objeto para JS/TS).
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const here = (p) => new URL(`../${p}`, import.meta.url);
const read = async (p) => JSON.parse(await readFile(here(p), 'utf8'));

const [primitives, typography, light, dark] = await Promise.all([
  read('src/primitives.json'), read('src/typography.json'), read('src/theme/light.json'), read('src/theme/dark.json'),
]);

// Achata a árvore em uma lista: { name: 'color/neutral/0', type, value, description }.
// O $type de um grupo vale para todos os filhos, como manda o DTCG.
function flatten(node, path = [], type) {
  const out = [];
  const groupType = node.$type ?? type;
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$') || typeof child !== 'object' || child === null) continue;
    if ('$value' in child) {
      out.push({ name: [...path, key].join('/'), type: child.$type ?? groupType, value: child.$value, ...(child.$description && { description: child.$description }) });
    } else {
      out.push(...flatten(child, [...path, key], groupType));
    }
  }
  return out;
}

const REF = /^\{([^}]+)\}$/;
const toName = (ref) => ref.replace(/\./g, '/');

// Troca cada {referência} pelo valor final. Guarda a primeira referência em `ref` para o CSS apontar var(--…).
function resolveAll(list, lookup) {
  const resolve = (value, seen = []) => {
    if (typeof value === 'string' && REF.test(value)) {
      const name = toName(value.match(REF)[1]);
      if (seen.includes(name)) throw new Error(`Referência circular: ${[...seen, name].join(' → ')}`);
      const target = lookup.get(name);
      if (!target) throw new Error(`Referência não encontrada: ${value}`);
      return resolve(target.value, [...seen, name]);
    }
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v, seen)]));
    return value;
  };
  return list.map((t) => {
    const ref = typeof t.value === 'string' && REF.test(t.value) ? toName(t.value.match(REF)[1]) : undefined;
    return { ...t, value: resolve(t.value), ...(ref && { ref }) };
  });
}

const base = [...flatten(primitives), ...flatten(typography)];
const baseLookup = new Map(base.map((t) => [t.name, t]));
const resolvedBase = resolveAll(base, baseLookup);

const themes = {};
for (const [mode, source] of Object.entries({ light, dark })) {
  const list = flatten(source);
  const lookup = new Map([...baseLookup, ...list.map((t) => [t.name, t])]);
  themes[mode] = resolveAll(list, lookup);
}

// Os dois modos precisam ter exatamente os mesmos tokens.
const names = (l) => l.map((t) => t.name).sort().join();
if (names(themes.light) !== names(themes.dark)) throw new Error('Os temas light e dark não têm os mesmos tokens.');

const output = {
  primitives: resolvedBase.filter((t) => t.type !== 'typography'),
  typography: resolvedBase.filter((t) => t.type === 'typography'),
  themes,
};

// Objeto aninhado para quem usa em JS: tokens.color.red['600'] → '#C8102E'.
function nest(list) {
  const root = {};
  for (const t of list) {
    const parts = t.name.split('/');
    let node = root;
    parts.slice(0, -1).forEach((p) => (node = node[p] ??= {}));
    node[parts.at(-1)] = t.value;
  }
  return root;
}
const js = { tokens: nest(resolvedBase), themes: { light: nest(themes.light), dark: nest(themes.dark) } };

await mkdir(here('dist'), { recursive: true });
await writeFile(here('dist/tokens.json'), JSON.stringify(output, null, 2) + '\n');
await writeFile(here('dist/index.js'),
  `// Gerado por scripts/build.mjs. Não edite à mão.\nexport const tokens = ${JSON.stringify(js.tokens, null, 2)};\n\nexport const themes = ${JSON.stringify(js.themes, null, 2)};\n`);
await writeFile(here('dist/index.d.ts'),
  `// Gerado por scripts/build.mjs. Não edite à mão.\nexport declare const tokens: ${JSON.stringify(js.tokens)};\nexport declare const themes: ${JSON.stringify(js.themes)};\n`);

const count = output.primitives.length + output.typography.length + themes.light.length;
console.log(`@iylotus/tokens: ${count} tokens (${output.primitives.length} primitives, ${output.typography.length} type styles, ${themes.light.length} theme × 2 modes)`);
