// Roda dist/code.js contra um Figma simulado (só a parte da API que o plugin usa)
// e confere o que ele criou: variáveis, aliases, modos, estilos, páginas e o Button.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

// Objetos criados dentro do vm vêm de outro contexto: compara pelo conteúdo (JSON).
const same = (a, b) => assert.equal(JSON.stringify(a), JSON.stringify(b));

const code = await readFile(new URL('../dist/code.js', import.meta.url), 'utf8');

function makeFigma({ maxModes = 4, command = 'all' } = {}) {
  let ids = 0;
  const nextId = () => `id:${++ids}`;
  const collections = [];
  const variables = [];
  const textStyles = [];
  const effectStyles = [];

  function node(type, extra = {}) {
    const n = {
      id: nextId(), type, name: '', children: [], parent: null, fills: [], strokes: [], x: 0, y: 0, width: 100, height: 100,
      appendChild(child) { if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1); child.parent = n; n.children.push(child); },
      remove() { if (n.parent) n.parent.children.splice(n.parent.children.indexOf(n), 1); n.parent = null; },
      resize(w, h) { n.width = w; n.height = h; },
      setPluginData() {},
      ...extra,
    };
    return n;
  }

  const root = node('DOCUMENT');
  const firstPage = node('PAGE', { name: 'Page 1', loadAsync: async () => {} });
  root.appendChild(firstPage);
  const loadedFonts = [];

  const figma = {
    command,
    root,
    notifications: [],
    closed: null,
    variables: {
      getLocalVariableCollectionsAsync: async () => [...collections],
      getLocalVariablesAsync: async () => [...variables],
      createVariableCollection(name) {
        const c = {
          id: nextId(), name, modes: [{ modeId: nextId(), name: 'Mode 1' }],
          renameMode(modeId, newName) { c.modes.find((m) => m.modeId === modeId).name = newName; },
          addMode(name) {
            if (c.modes.length >= maxModes) throw new Error('Limited to ' + maxModes + ' modes only');
            const m = { modeId: nextId(), name }; c.modes.push(m); return m.modeId;
          },
        };
        collections.push(c);
        return c;
      },
      createVariable(name, collection, resolvedType) {
        const v = {
          id: nextId(), name, resolvedType, variableCollectionId: collection.id, valuesByMode: {}, scopes: ['ALL_SCOPES'], description: '',
          setValueForMode(modeId, value) { v.valuesByMode[modeId] = value; },
          remove() { variables.splice(variables.indexOf(v), 1); },
        };
        variables.push(v);
        return v;
      },
      createVariableAlias: (v) => ({ type: 'VARIABLE_ALIAS', id: v.id }),
      setBoundVariableForPaint: (paint, field, v) => ({ ...paint, boundVariables: { [field]: { type: 'VARIABLE_ALIAS', id: v.id } } }),
    },
    loadFontAsync: async (f) => { loadedFonts.push(`${f.family} ${f.style}`); },
    getLocalTextStylesAsync: async () => [...textStyles],
    createTextStyle() { const s = { id: nextId(), name: '' }; textStyles.push(s); return s; },
    getLocalEffectStylesAsync: async () => [...effectStyles],
    createEffectStyle() { const s = { id: nextId(), name: '', effects: [] }; effectStyles.push(s); return s; },
    loadAllPagesAsync: async () => {},
    createPage() { const p = node('PAGE', { loadAsync: async () => {} }); root.appendChild(p); return p; },
    createFrame: () => node('FRAME'),
    createText: () => node('TEXT', { characters: '' }),
    createComponent: () => node('COMPONENT'),
    combineAsVariants(components, parent) {
      const set = node('COMPONENT_SET');
      components.forEach((c) => set.appendChild(c));
      parent.appendChild(set);
      return set;
    },
    closePlugin(message) { figma.closed = message; },
  };
  return { figma, collections, variables, textStyles, effectStyles, loadedFonts };
}

async function runPlugin(options) {
  const env = makeFigma(options);
  vm.runInNewContext(code, { figma: env.figma, console });
  for (let i = 0; i < 200 && env.figma.closed === null; i++) await new Promise((r) => setTimeout(r, 5));
  return env;
}

const tokens = JSON.parse(await readFile(new URL('../../tokens/dist/tokens.json', import.meta.url), 'utf8'));

test('roda sem erro e fecha com o relatório', async () => {
  const { figma } = await runPlugin();
  assert.ok(figma.closed, 'o plugin não terminou');
  assert.doesNotMatch(figma.closed, /erro/i, figma.closed);
});

test('cria Root com um modo "Value" e as variáveis do tipo certo', async () => {
  const { collections, variables } = await runPlugin();
  const root = collections.find((c) => c.name === 'IY Lotus · Root');
  assert.deepEqual(root.modes.map((m) => m.name), ['Value']);
  const red = variables.find((v) => v.name === 'color/red/600');
  assert.equal(red.resolvedType, 'COLOR');
  same(red.scopes, []);
  assert.equal(variables.find((v) => v.name === 'space/4').valuesByMode[root.modes[0].modeId], 16);
  assert.equal(variables.find((v) => v.name === 'font/family/sans').valuesByMode[root.modes[0].modeId], 'DM Sans');
});

test('Stem com modos Light e Dark, apontando para o Root por alias', async () => {
  const { collections, variables } = await runPlugin();
  const stem = collections.find((c) => c.name === 'IY Lotus · Stem');
  assert.deepEqual(stem.modes.map((m) => m.name), ['Light', 'Dark']);
  const accent = variables.find((v) => v.name === 'color/text/accent' && v.variableCollectionId === stem.id);
  const red600 = variables.find((v) => v.name === 'color/red/600');
  const red300 = variables.find((v) => v.name === 'color/red/300');
  assert.deepEqual(accent.valuesByMode[stem.modes[0].modeId], { type: 'VARIABLE_ALIAS', id: red600.id });
  assert.deepEqual(accent.valuesByMode[stem.modes[1].modeId], { type: 'VARIABLE_ALIAS', id: red300.id });
  assert.equal(variables.filter((v) => v.variableCollectionId === stem.id).length, tokens.themes.light.length);
});

test('plano gratuito (1 modo por coleção): Dark vai para outra coleção e o relatório avisa', async () => {
  const { figma, collections } = await runPlugin({ maxModes: 1 });
  const dark = collections.find((c) => c.name === 'IY Lotus · Stem (Dark)');
  assert.ok(dark);
  assert.deepEqual(dark.modes.map((m) => m.name), ['Dark']);
  assert.match(figma.closed, /1 modo por coleção/);
});

test('estilos de texto e de sombra', async () => {
  const { textStyles, effectStyles } = await runPlugin();
  assert.equal(textStyles.length, tokens.typography.length);
  const label = textStyles.find((s) => s.name === 'type/label');
  assert.equal(label.textCase, 'UPPER');
  same(label.fontName, { family: 'JetBrains Mono', style: 'Medium' });
  assert.equal(effectStyles.map((s) => s.name).join(), 'shadow/1,shadow/2,shadow/3');
});

test('Button: 45 variantes, fundo e texto ligados às variáveis de tema', async () => {
  const { figma, variables } = await runPlugin();
  const page = figma.root.children.find((p) => p.name === '🌸 Button');
  const set = page.children.find((n) => n.type === 'COMPONENT_SET');
  assert.equal(set.children.length, 45);
  const accent = set.children.find((c) => c.name === 'variant=accent, size=md, state=default');
  const accentVar = variables.find((v) => v.name === 'color/action/accent');
  assert.equal(accent.fills[0].boundVariables.color.id, accentVar.id);
  assert.equal(accent.height, 44);
  assert.equal(set.children.find((c) => c.name.endsWith('state=disabled')).opacity, 0.38);
});

test('rodar duas vezes atualiza em vez de duplicar', async () => {
  const env = makeFigma();
  vm.runInNewContext(code, { figma: env.figma, console });
  for (let i = 0; i < 200 && env.figma.closed === null; i++) await new Promise((r) => setTimeout(r, 5));
  const counts = [env.variables.length, env.textStyles.length, env.collections.length];
  env.figma.closed = null;
  vm.runInNewContext(code, { figma: env.figma, console });
  for (let i = 0; i < 200 && env.figma.closed === null; i++) await new Promise((r) => setTimeout(r, 5));
  assert.deepEqual([env.variables.length, env.textStyles.length, env.collections.length], counts);
  const buttonPage = env.figma.root.children.find((p) => p.name === '🌸 Button');
  assert.equal(buttonPage.children.filter((n) => n.name === 'Button').length, 1);
});
