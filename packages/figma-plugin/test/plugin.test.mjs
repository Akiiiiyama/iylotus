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
    createText: () => node('TEXT', { characters: '', ranges: [], setRangeFontName(start, end, font) { this.ranges.push([start, end, font.style]); } }),
    createVector: () => node('VECTOR', { vectorPaths: [] }),
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

// ---------- componentes além do Button ----------

const setsOn = (figma, pageName) => {
  const page = figma.root.children.find((p) => p.name === pageName);
  assert.ok(page, `página ${pageName} não foi criada`);
  return Object.fromEntries(page.children.map((n) => [n.name, n]));
};
const boundId = (paint) => paint && paint.boundVariables && paint.boundVariables.color.id;
const varId = (variables, name) => variables.find((v) => v.name === name).id;

test('Inputs: os 6 componentes com o número de variantes do React', async () => {
  const { figma } = await runPlugin();
  const sets = setsOn(figma, '🌸 Inputs');
  const counts = Object.fromEntries(Object.entries(sets).map(([k, s]) => [k, s.children.length]));
  same(counts, { TextField: 5, TextArea: 2, Select: 3, Checkbox: 6, Radio: 4, Switch: 4 });
});

test('TextField com erro: borda e mensagem ligadas a color/feedback/danger', async () => {
  const { figma, variables } = await runPlugin();
  const error = setsOn(figma, '🌸 Inputs').TextField.children.find((c) => c.name === 'state=error');
  const control = error.children.find((n) => n.name === 'control');
  const danger = variables.find((v) => v.name === 'color/feedback/danger' && v.variableCollectionId !== undefined).id;
  assert.equal(boundId(control.strokes[0]), danger);
  assert.equal(boundId(error.children[2].fills[0]), danger);
});

test('Switch ligado: bolinha com a cor de ação accent', async () => {
  const { figma, variables } = await runPlugin();
  const on = setsOn(figma, '🌸 Inputs').Switch.children.find((c) => c.name === 'checked=true, disabled=false');
  const thumb = on.children.find((n) => n.name === 'track').children[0];
  assert.equal(boundId(thumb.fills[0]), varId(variables, 'color/action/accent'));
});

test('Card: 8 variantes; raised usa o tema, red usa o Root fixo, título leve/negrito', async () => {
  const { figma, variables } = await runPlugin();
  const card = setsOn(figma, '🌸 Card').Card;
  assert.equal(card.children.length, 8);
  const raised = card.children.find((c) => c.name === 'tone=raised, shape=rounded');
  const red = card.children.find((c) => c.name === 'tone=red, shape=tile');
  assert.equal(boundId(raised.fills[0]), varId(variables, 'color/surface-raised'));
  assert.equal(boundId(red.fills[0]), varId(variables, 'color/red/600'));
  same(raised.children[1].ranges, [[0, 7, 'Light'], [7, 13, 'Bold']]);
});

test('Apoio: Tag, Badge (3), Avatar (3), Link e Divider (2)', async () => {
  const { figma } = await runPlugin();
  const sets = setsOn(figma, '🌸 Support');
  same(Object.keys(sets).sort(), ['Avatar', 'Badge', 'Divider', 'Link', 'Tag']);
  assert.equal(sets.Badge.children.length, 3);
  assert.equal(sets.Avatar.children.length, 3);
  assert.equal(sets.Divider.children.length, 2);
  const lg = sets.Avatar.children.find((c) => c.name === 'size=lg');
  assert.equal(lg.children.find((n) => n.name === 'dot').layoutPositioning, 'ABSOLUTE');
});

test('rodar de novo não duplica os componentes novos', async () => {
  const env = makeFigma();
  for (let run = 0; run < 2; run++) {
    env.figma.closed = null;
    vm.runInNewContext(code, { figma: env.figma, console });
    for (let i = 0; i < 400 && env.figma.closed === null; i++) await new Promise((r) => setTimeout(r, 5));
  }
  for (const name of ['🌸 Inputs', '🌸 Card', '🌸 Support']) {
    const page = env.figma.root.children.find((p) => p.name === name);
    const names = page.children.map((n) => n.name);
    assert.equal(names.length, new Set(names).size, `${name} tem duplicados: ${names}`);
  }
});
