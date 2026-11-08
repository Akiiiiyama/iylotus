// IY Lotus · plugin do Figma
// Lê os tokens embutidos no build e cria (ou atualiza) no arquivo aberto:
// variáveis Root e Stem, estilos de texto e sombra, páginas de fundação e o componente Button.
// Escrito sem ?. ?? e spread de objeto, para rodar em qualquer versão do sandbox de plugins do Figma.

var TOKENS = __IYLOTUS_TOKENS__;

var NAMES = {
  primitives: 'IY Lotus · Root',
  theme: 'IY Lotus · Stem',
  themeDark: 'IY Lotus · Stem (Dark)',
};
var report = [];

// ---------- utilitários ----------

function hexToRgba(hex) {
  var h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
    a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
  };
}
function rgb(hex) { var c = hexToRgba(hex); return { r: c.r, g: c.g, b: c.b }; }
function num(v) { return parseFloat(v); }
function find(list, fn) { for (var i = 0; i < list.length; i++) if (fn(list[i])) return list[i]; return undefined; }

var WEIGHT_STYLE = { 300: 'Light', 400: 'Regular', 500: 'Medium', 700: 'Bold' };

// ---------- variáveis ----------

var state = { collections: [], variables: [] };

async function loadState() {
  state.collections = await figma.variables.getLocalVariableCollectionsAsync();
  state.variables = await figma.variables.getLocalVariablesAsync();
}

function getCollection(name) {
  var c = find(state.collections, function (x) { return x.name === name; });
  if (!c) { c = figma.variables.createVariableCollection(name); state.collections.push(c); }
  return c;
}

function getVariable(collection, name, type) {
  var v = find(state.variables, function (x) { return x.variableCollectionId === collection.id && x.name === name; });
  if (v && v.resolvedType !== type) { v.remove(); v = undefined; }
  if (!v) { v = figma.variables.createVariable(name, collection, type); state.variables.push(v); }
  return v;
}

// Como cada tipo de token vira variável do Figma: tipo, valor e onde ela aparece nos seletores.
function primitiveSpec(t) {
  var root = t.name.split('/')[0];
  switch (t.type) {
    case 'color': return { type: 'COLOR', value: hexToRgba(t.value), scopes: [] }; // escondidas: use as do Stem
    case 'dimension':
      if (root === 'space') return { type: 'FLOAT', value: num(t.value), scopes: ['GAP', 'WIDTH_HEIGHT'] };
      if (root === 'radius') return { type: 'FLOAT', value: num(t.value), scopes: ['CORNER_RADIUS'] };
      if (root === 'border') return { type: 'FLOAT', value: num(t.value), scopes: ['STROKE_FLOAT'] };
      return { type: 'FLOAT', value: num(t.value), scopes: [] };
    case 'duration': return { type: 'FLOAT', value: num(t.value), scopes: [] };
    case 'fontWeight': return { type: 'FLOAT', value: t.value, scopes: ['FONT_WEIGHT'] };
    case 'fontFamily': return { type: 'STRING', value: t.value[0], scopes: ['FONT_FAMILY'] };
    case 'cubicBezier': return { type: 'STRING', value: t.value.join(', '), scopes: [] };
    default: return null; // sombra vira estilo de efeito
  }
}

function themeScopes(name) {
  if (name.indexOf('color/text/') === 0 || name === 'color/action/on-accent') return ['TEXT_FILL'];
  if (name.indexOf('color/border') === 0 || name === 'color/focus') return ['STROKE_COLOR'];
  if (name.indexOf('color/icon/') === 0) return ['SHAPE_FILL', 'STROKE_COLOR'];
  return ['FRAME_FILL', 'SHAPE_FILL'];
}

async function syncVariables() {
  await loadState();

  // Root: um modo só, chamado Value.
  var prim = getCollection(NAMES.primitives);
  var primMode = prim.modes[0].modeId;
  if (prim.modes[0].name !== 'Value') prim.renameMode(primMode, 'Value');
  var byName = {};
  var count = 0;
  TOKENS.primitives.forEach(function (t) {
    var spec = primitiveSpec(t);
    if (!spec) return;
    var v = getVariable(prim, t.name, spec.type);
    v.setValueForMode(primMode, spec.value);
    v.scopes = spec.scopes;
    v.description = t.description || '';
    byName[t.name] = v;
    count++;
  });

  // Stem: modos Light e Dark na mesma coleção. No plano gratuito (1 modo por coleção), o Dark vai para outra coleção.
  var theme = getCollection(NAMES.theme);
  var lightMode = theme.modes[0].modeId;
  if (theme.modes[0].name !== 'Light') theme.renameMode(lightMode, 'Light');
  var darkMode = find(theme.modes, function (m) { return m.name === 'Dark'; });
  var darkTarget = { collection: theme, modeId: darkMode ? darkMode.modeId : null };
  if (!darkMode) {
    try {
      darkTarget.modeId = theme.addMode('Dark');
    } catch (e) {
      var dark = getCollection(NAMES.themeDark);
      darkTarget = { collection: dark, modeId: dark.modes[0].modeId };
      if (dark.modes[0].name !== 'Dark') dark.renameMode(darkTarget.modeId, 'Dark');
      report.push('Seu plano permite 1 modo por coleção: o tema Dark ficou em "' + NAMES.themeDark + '".');
    }
  }

  function setTheme(collection, modeId, list) {
    list.forEach(function (t) {
      var v = getVariable(collection, t.name, 'COLOR');
      var target = t.ref ? byName[t.ref] : null;
      v.setValueForMode(modeId, target ? figma.variables.createVariableAlias(target) : hexToRgba(t.value));
      v.scopes = themeScopes(t.name);
      v.description = t.description || '';
    });
  }
  setTheme(theme, lightMode, TOKENS.themes.light);
  setTheme(darkTarget.collection, darkTarget.modeId, TOKENS.themes.dark);

  report.push(count + ' variáveis Root e ' + TOKENS.themes.light.length + ' de tema (Light e Dark)');
  return { theme: theme, lightMode: lightMode, dark: darkTarget };
}

async function themeVariable(name) {
  await loadState();
  var theme = find(state.collections, function (c) { return c.name === NAMES.theme; });
  if (!theme) throw new Error('Rode "Variables" antes.');
  var v = find(state.variables, function (x) { return x.variableCollectionId === theme.id && x.name === name; });
  if (!v) throw new Error('Variável não encontrada: ' + name);
  return v;
}

// ---------- estilos ----------

async function loadFont(family, style) {
  try { await figma.loadFontAsync({ family: family, style: style }); return { family: family, style: style }; }
  catch (e) {
    await figma.loadFontAsync({ family: 'Inter', style: style === 'Light' ? 'Regular' : style });
    report.push('Fonte ' + family + ' ' + style + ' não encontrada: usei Inter.');
    return { family: 'Inter', style: style === 'Light' ? 'Regular' : style };
  }
}

async function syncStyles() {
  var textStyles = await figma.getLocalTextStylesAsync();
  for (var i = 0; i < TOKENS.typography.length; i++) {
    var t = TOKENS.typography[i];
    var v = t.value;
    var name = t.name; // type/display
    var s = find(textStyles, function (x) { return x.name === name; });
    if (!s) s = figma.createTextStyle();
    s.name = name;
    s.fontName = await loadFont(v.fontFamily[0], WEIGHT_STYLE[v.fontWeight] || 'Regular');
    s.fontSize = num(v.fontSize);
    s.lineHeight = { unit: 'PERCENT', value: v.lineHeight * 100 };
    s.letterSpacing = { unit: 'PERCENT', value: num(v.letterSpacing) * 100 };
    s.textCase = name === 'type/label' ? 'UPPER' : 'ORIGINAL';
  }

  var effectStyles = await figma.getLocalEffectStylesAsync();
  var shadows = TOKENS.primitives.filter(function (t) { return t.type === 'shadow'; });
  shadows.forEach(function (t) {
    var e = find(effectStyles, function (x) { return x.name === t.name; });
    if (!e) e = figma.createEffectStyle();
    e.name = t.name; // shadow/1
    e.effects = [{
      type: 'DROP_SHADOW', visible: true, blendMode: 'NORMAL',
      color: hexToRgba(t.value.color),
      offset: { x: num(t.value.offsetX), y: num(t.value.offsetY) },
      radius: num(t.value.blur), spread: num(t.value.spread),
    }];
  });
  report.push(TOKENS.typography.length + ' estilos de texto e ' + shadows.length + ' de sombra');
}

// ---------- páginas ----------

async function getPage(name) {
  await figma.loadAllPagesAsync();
  var p = find(figma.root.children, function (x) { return x.name === name; });
  if (!p) { p = figma.createPage(); p.name = name; }
  return p;
}

function clearByName(page, name) {
  page.children.filter(function (n) { return n.name === name; }).forEach(function (n) { n.remove(); });
}

function boundFill(variable, opacity) {
  var paint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: opacity === undefined ? 1 : opacity };
  return figma.variables.setBoundVariableForPaint(paint, 'color', variable);
}

function autoFrame(name, direction, gap, padding) {
  var f = figma.createFrame();
  f.name = name;
  f.layoutMode = direction;
  f.itemSpacing = gap;
  f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = padding;
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.fills = [];
  return f;
}

async function text(chars, style, size, color) {
  var t = figma.createText();
  t.fontName = await loadFont(style === 'mono' ? 'JetBrains Mono' : 'DM Sans', style === 'mono' ? 'Regular' : style);
  t.characters = chars;
  t.fontSize = size;
  t.fills = [{ type: 'SOLID', color: rgb(color) }];
  return t;
}

async function syncPages() {
  await loadState();
  var prim = find(state.collections, function (c) { return c.name === NAMES.primitives; });
  if (!prim) throw new Error('Rode "Variables" antes.');

  var page = await getPage('🌱 Root');
  await page.loadAsync();
  clearByName(page, 'Color');

  var board = autoFrame('Color', 'VERTICAL', 24, 48);
  board.fills = [{ type: 'SOLID', color: rgb('#141414') }];
  board.appendChild(await text('Color', 'Bold', 58, '#FFFFFF'));

  var groups = { neutral: [], red: [] };
  TOKENS.primitives.forEach(function (t) {
    if (t.type !== 'color') return;
    var fam = t.name.split('/')[1];
    if (groups[fam]) groups[fam].push(t);
  });

  var famNames = ['neutral', 'red'];
  for (var g = 0; g < famNames.length; g++) {
    var row = autoFrame('color/' + famNames[g], 'HORIZONTAL', 2, 0);
    var list = groups[famNames[g]];
    for (var i = 0; i < list.length; i++) {
      var t = list[i];
      var variable = find(state.variables, function (x) { return x.variableCollectionId === prim.id && x.name === t.name; });
      var sw = autoFrame(t.name, 'VERTICAL', 2, 10);
      sw.primaryAxisSizingMode = 'FIXED';
      sw.counterAxisSizingMode = 'FIXED';
      sw.resize(96, 128);
      sw.primaryAxisAlignItems = 'MAX';
      sw.fills = variable ? [boundFill(variable)] : [{ type: 'SOLID', color: rgb(t.value) }];
      var light = hexToRgba(t.value);
      var ink = (light.r * 0.2126 + light.g * 0.7152 + light.b * 0.0722) > 0.4 ? '#141414' : '#FFFFFF';
      sw.appendChild(await text(t.name.split('/')[2], 'mono', 11, ink));
      sw.appendChild(await text(t.value, 'mono', 10, ink));
      row.appendChild(sw);
    }
    board.appendChild(row);
  }
  page.appendChild(board);
  report.push('Página 🌱 Root com ' + (groups.neutral.length + groups.red.length) + ' cores ligadas às variáveis');
}

// ---------- Button ----------

var BUTTON = {
  variants: ['primary', 'accent', 'secondary', 'ghost', 'link'],
  sizes: [['sm', 32, 13], ['md', 44, 15], ['lg', 56, 17]],
  states: ['default', 'hover', 'disabled'],
  fill: {
    primary: ['color/action/primary', 'color/action/primary-hover'],
    accent: ['color/action/accent', 'color/action/accent-hover'],
  },
  label: { primary: 'color/text/inverse', accent: 'color/action/on-accent' },
};

async function syncButton() {
  var page = await getPage('🌸 Button');
  await page.loadAsync();
  clearByName(page, 'Button');

  var v = {};
  var needed = ['color/action/primary', 'color/action/primary-hover', 'color/action/accent', 'color/action/accent-hover',
    'color/text/inverse', 'color/action/on-accent', 'color/text/primary', 'color/border-strong'];
  for (var n = 0; n < needed.length; n++) v[needed[n]] = await themeVariable(needed[n]);
  var font = await loadFont('DM Sans', 'Bold');

  var components = [];
  var y = 0;
  for (var a = 0; a < BUTTON.variants.length; a++) {
    var variant = BUTTON.variants[a];
    var x = 0;
    for (var b = 0; b < BUTTON.sizes.length; b++) {
      var size = BUTTON.sizes[b];
      for (var c = 0; c < BUTTON.states.length; c++) {
        var st = BUTTON.states[c];
        var comp = figma.createComponent();
        comp.name = 'variant=' + variant + ', size=' + size[0] + ', state=' + st;
        comp.layoutMode = 'HORIZONTAL';
        comp.primaryAxisAlignItems = 'CENTER';
        comp.counterAxisAlignItems = 'CENTER';
        comp.itemSpacing = 8;
        var pad = variant === 'link' ? 2 : size[1] / 2;
        comp.paddingLeft = comp.paddingRight = pad;
        comp.counterAxisSizingMode = 'FIXED';
        comp.resize(100, size[1]);
        comp.primaryAxisSizingMode = 'AUTO';
        comp.cornerRadius = variant === 'link' ? 4 : 999;

        var hover = st === 'hover';
        if (BUTTON.fill[variant]) comp.fills = [boundFill(v[BUTTON.fill[variant][hover ? 1 : 0]])];
        else if (hover && (variant === 'secondary' || variant === 'ghost')) comp.fills = [boundFill(v['color/text/primary'], 0.08)];
        else comp.fills = [];
        if (variant === 'secondary') {
          comp.strokes = [boundFill(v['color/border-strong'])];
          comp.strokeWeight = 1.5;
          comp.strokeAlign = 'INSIDE';
        }
        if (st === 'disabled') comp.opacity = 0.38;

        var label = figma.createText();
        label.fontName = font;
        label.characters = 'Button';
        label.fontSize = size[2];
        label.letterSpacing = { unit: 'PERCENT', value: -1 };
        label.fills = [boundFill(v[BUTTON.label[variant] || 'color/text/primary'])];
        if (variant === 'link') label.textDecoration = 'UNDERLINE';
        comp.appendChild(label);
        comp.setPluginData('iylotus', 'Button');

        comp.x = x;
        comp.y = y;
        x += 160;
        page.appendChild(comp);
        components.push(comp);
      }
    }
    y += 80;
  }

  var set = figma.combineAsVariants(components, page);
  set.name = 'Button';
  set.description = 'IY Lotus Button. React: <Button variant="accent" size="md" />. CSS: .iy-button--accent.iy-button--md. Accent (red) once per screen.';
  set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 32;
  report.push('Componente Button: ' + components.length + ' variantes (5 estilos × 3 tamanhos × 3 estados)');
}

// ---------- comandos ----------

async function run(command) {
  if (command === 'variables' || command === 'all') await syncVariables();
  if (command === 'styles' || command === 'all') await syncStyles();
  if (command === 'pages' || command === 'all') await syncPages();
  if (command === 'button' || command === 'all') await syncButton();
}

run(figma.command || 'all').then(function () {
  figma.closePlugin('IY Lotus 🌸 ' + report.join(' · '));
}).catch(function (e) {
  figma.closePlugin('IY Lotus: erro. ' + (e && e.message ? e.message : String(e)));
});
