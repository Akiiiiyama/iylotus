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

// ---------- base para os outros componentes ----------

// Todas as variáveis de tema (Light) e do Root, por nome.
async function allVars() {
  await loadState();
  var theme = find(state.collections, function (c) { return c.name === NAMES.theme; });
  var prim = find(state.collections, function (c) { return c.name === NAMES.primitives; });
  if (!theme || !prim) throw new Error('Rode "Variables" antes.');
  var T = {}, R = {};
  state.variables.forEach(function (v) {
    if (v.variableCollectionId === theme.id) T[v.name] = v;
    if (v.variableCollectionId === prim.id) R[v.name] = v;
  });
  return { T: T, R: R };
}

function setPadding(n, top, right, bottom, left) {
  n.paddingTop = top; n.paddingRight = right; n.paddingBottom = bottom; n.paddingLeft = left;
}

// Frame com auto layout. size: [largura, altura]; null numa posição = abraça o conteúdo.
function box(kind, name, direction, gap, size) {
  var n = kind === 'component' ? figma.createComponent() : figma.createFrame();
  n.name = name;
  n.fills = [];
  n.layoutMode = direction;
  n.itemSpacing = gap;
  setPadding(n, 0, 0, 0, 0);
  var w = size && size[0], h = size && size[1];
  if (w || h) n.resize(w || 100, h || 100);
  var horizontal = direction === 'HORIZONTAL';
  n.primaryAxisSizingMode = (horizontal ? w : h) ? 'FIXED' : 'AUTO';
  n.counterAxisSizingMode = (horizontal ? h : w) ? 'FIXED' : 'AUTO';
  return n;
}

function stroke(n, variable, weight) {
  n.strokes = [boundFill(variable)];
  n.strokeWeight = weight;
  n.strokeAlign = 'INSIDE';
}

// Texto com cor ligada a uma variável. opts: { mono, style, upper, tracking, underline }
async function vtext(chars, size, variable, opts) {
  opts = opts || {};
  var t = figma.createText();
  t.fontName = opts.mono ? await loadFont('JetBrains Mono', opts.style || 'Regular') : await loadFont('DM Sans', opts.style || 'Regular');
  t.characters = chars;
  t.fontSize = size;
  t.fills = [boundFill(variable)];
  if (opts.upper) t.textCase = 'UPPER';
  if (opts.tracking !== undefined) t.letterSpacing = { unit: 'PERCENT', value: opts.tracking };
  if (opts.underline) t.textDecoration = 'UNDERLINE';
  return t;
}

// Junta variantes num component set, organizadas em grade, e empilha os sets na página.
function combine(page, components, name, cols, cellW, cellH, description, cursor) {
  components.forEach(function (c, i) {
    c.x = (i % cols) * cellW;
    c.y = Math.floor(i / cols) * cellH;
    page.appendChild(c);
  });
  var set = components.length > 1 ? figma.combineAsVariants(components, page) : components[0];
  set.name = name;
  set.description = description;
  set.x = 0;
  set.y = cursor.y;
  cursor.y += (set.height || cellH) + 120;
  return set;
}

async function componentPage(name, setNames) {
  var page = await getPage(name);
  await page.loadAsync();
  setNames.forEach(function (n) { clearByName(page, n); });
  return page;
}

function chevron(variable) {
  var v = figma.createVector();
  v.name = 'chevron';
  v.vectorPaths = [{ windingRule: 'NONE', data: 'M 0 0 L 6 6 L 12 0' }];
  v.strokes = [boundFill(variable)];
  v.strokeWeight = 1.5;
  v.strokeCap = 'ROUND';
  v.fills = [];
  return v;
}

// ---------- Inputs ----------

async function field(V, kind, st) {
  var T = V.T;
  var c = box('component', 'state=' + st, 'VERTICAL', 6, [320, null]);
  c.appendChild(await vtext(kind === 'Select' ? 'Role' : kind === 'TextArea' ? 'Message' : 'Email', 14, T['color/text/primary'], { style: 'Medium' }));

  var multi = kind === 'TextArea';
  var control = box('frame', 'control', 'HORIZONTAL', 8, [320, multi ? 120 : 48]);
  control.layoutAlign = 'STRETCH';
  control.counterAxisAlignItems = multi ? 'MIN' : 'CENTER';
  setPadding(control, multi ? 12 : 0, 16, multi ? 12 : 0, 16);
  control.cornerRadius = 8;
  control.fills = [boundFill(st === 'disabled' ? T['color/surface'] : T['color/surface-raised'])];
  stroke(control, st === 'error' ? T['color/feedback/danger'] : st === 'focus' ? T['color/border-strong'] : T['color/border'], 1.5);
  if (st === 'focus') control.effects = [{ type: 'DROP_SHADOW', visible: true, blendMode: 'NORMAL', color: { r: 0.08, g: 0.08, b: 0.08, a: 0.16 }, offset: { x: 0, y: 0 }, radius: 0, spread: 3 }];
  if (st === 'disabled') control.opacity = 0.55;

  var filled = st === 'filled' || st === 'error';
  var valueText = kind === 'Select' ? 'Choose a role' : kind === 'TextArea' ? (filled ? 'Hi' : 'Tell me about the project') : (st === 'error' ? 'isabela@' : filled ? 'isabela@email.com' : 'you@email.com');
  var value = await vtext(valueText, 15, filled ? T['color/text/primary'] : T['color/text/secondary']);
  value.layoutGrow = 1;
  control.appendChild(value);
  if (kind === 'Select') control.appendChild(chevron(T['color/text/secondary']));
  c.appendChild(control);

  c.appendChild(st === 'error'
    ? await vtext(kind === 'TextField' ? 'Add the domain, like isabela@email.com' : kind === 'Select' ? 'Choose a role to continue' : 'Write at least 20 characters', 13, T['color/feedback/danger'])
    : await vtext(kind === 'Select' ? 'Native select on the web' : 'Only to reply to you', 13, T['color/text/secondary']));
  return c;
}

async function choice(V, kind, checked, disabled) {
  var T = V.T;
  var c = box('component', 'checked=' + checked + ', disabled=' + disabled, 'HORIZONTAL', 12, null);
  c.counterAxisAlignItems = 'CENTER';
  var mark = box('frame', kind === 'Radio' ? 'circle' : 'box', 'HORIZONTAL', 0, [20, 20]);
  mark.primaryAxisAlignItems = 'CENTER';
  mark.counterAxisAlignItems = 'CENTER';
  mark.cornerRadius = kind === 'Radio' ? 10 : 4;
  var on = checked !== 'false';
  stroke(mark, on ? T['color/action/primary'] : T['color/border-strong'], 1.5);
  if (on) mark.fills = [boundFill(T['color/action/primary'])];
  if (checked === 'true' && kind === 'Checkbox') {
    var check = figma.createVector();
    check.name = 'check';
    check.vectorPaths = [{ windingRule: 'NONE', data: 'M 0 4 L 3.5 7.5 L 10 0' }];
    check.strokes = [boundFill(T['color/text/inverse'])];
    check.strokeWeight = 2;
    check.fills = [];
    mark.appendChild(check);
  }
  if (checked === 'indeterminate') {
    var dash = box('frame', 'dash', 'HORIZONTAL', 0, [10, 2]);
    dash.fills = [boundFill(T['color/text/inverse'])];
    mark.appendChild(dash);
  }
  if (checked === 'true' && kind === 'Radio') {
    var dot = box('frame', 'dot', 'HORIZONTAL', 0, [8, 8]);
    dot.cornerRadius = 4;
    dot.fills = [boundFill(T['color/text/inverse'])];
    mark.appendChild(dot);
  }
  c.appendChild(mark);
  c.appendChild(await vtext(kind === 'Radio' ? 'Design Engineer' : 'Design Systems', 15, T['color/text/primary']));
  if (disabled) c.opacity = 0.45;
  return c;
}

async function switchVariant(V, on, disabled) {
  var c = box('component', 'checked=' + on + ', disabled=' + disabled, 'HORIZONTAL', 12, null);
  c.counterAxisAlignItems = 'CENTER';
  c.appendChild(await vtext('Dark mode', 15, V.T['color/text/primary']));
  var track = box('frame', 'track', 'HORIZONTAL', 0, [56, 32]);
  track.cornerRadius = 999;
  track.counterAxisAlignItems = 'CENTER';
  track.primaryAxisAlignItems = on ? 'MAX' : 'MIN';
  setPadding(track, 4, 4, 4, 4);
  track.fills = [boundFill(V.R['color/neutral/800'])];
  var thumb = box('frame', 'thumb', 'HORIZONTAL', 0, [24, 24]);
  thumb.cornerRadius = 12;
  thumb.fills = [boundFill(on ? V.T['color/action/accent'] : V.R['color/neutral/0'])];
  track.appendChild(thumb);
  c.appendChild(track);
  if (disabled) c.opacity = 0.45;
  return c;
}

async function syncInputs() {
  var V = await allVars();
  var names = ['TextField', 'TextArea', 'Select', 'Checkbox', 'Radio', 'Switch'];
  var page = await componentPage('🌸 Inputs', names);
  var cursor = { y: 0 };
  var i, list, total = 0;

  list = [];
  var fieldStates = { TextField: ['default', 'focus', 'filled', 'error', 'disabled'], TextArea: ['default', 'error'], Select: ['default', 'error', 'disabled'] };
  var fieldDocs = {
    TextField: 'React: <TextField label hint error prefix suffix showCount />. Label always visible; error sets aria-invalid.',
    TextArea: 'React: <TextArea label hint error showCount />.',
    Select: 'React: <Select label placeholder>…options</Select>. Native select on the web.',
  };
  var kinds = ['TextField', 'TextArea', 'Select'];
  for (var k = 0; k < kinds.length; k++) {
    list = [];
    for (i = 0; i < fieldStates[kinds[k]].length; i++) list.push(await field(V, kinds[k], fieldStates[kinds[k]][i]));
    combine(page, list, kinds[k], 5, 360, 200, fieldDocs[kinds[k]], cursor);
    total += list.length;
  }

  list = [];
  var checks = ['false', 'true', 'indeterminate'];
  for (i = 0; i < 6; i++) list.push(await choice(V, 'Checkbox', checks[i % 3], i >= 3));
  combine(page, list, 'Checkbox', 3, 240, 48, 'React: <Checkbox label hint indeterminate />. Native checkbox.', cursor);
  total += list.length;

  list = [];
  for (i = 0; i < 4; i++) list.push(await choice(V, 'Radio', i % 2 ? 'true' : 'false', i >= 2));
  combine(page, list, 'Radio', 2, 240, 48, 'React: <RadioGroup legend><Radio value label /></RadioGroup>.', cursor);
  total += list.length;

  list = [];
  for (i = 0; i < 4; i++) list.push(await switchVariant(V, i % 2 === 1, i >= 2));
  combine(page, list, 'Switch', 2, 240, 56, 'React: <Switch label checked onCheckedChange />. role="switch". For settings that apply right away.', cursor);
  total += list.length;

  report.push('Inputs: ' + total + ' variantes em 6 componentes');
}

// ---------- Card ----------

var CARD_TONES = {
  raised: ['T', 'color/surface-raised', 'color/text/primary', 'color/text/secondary'],
  grey: ['R', 'color/neutral/100', 'color/neutral/950', 'color/neutral/600'],
  ink: ['R', 'color/neutral/950', 'color/neutral/0', 'color/neutral/400'],
  red: ['R', 'color/red/600', 'color/neutral/0', 'color/neutral/0'],
};

async function syncCard() {
  var V = await allVars();
  var page = await componentPage('🌸 Card', ['Card']);
  var light = await loadFont('DM Sans', 'Light');
  var bold = await loadFont('DM Sans', 'Bold');
  var tones = ['raised', 'grey', 'ink', 'red'];
  var shapes = ['rounded', 'tile'];
  var list = [];

  for (var s = 0; s < shapes.length; s++) {
    for (var t = 0; t < tones.length; t++) {
      var spec = CARD_TONES[tones[t]];
      var src = V[spec[0]];
      var tile = shapes[s] === 'tile';
      var c = box('component', 'tone=' + tones[t] + ', shape=' + shapes[s], 'VERTICAL', 8, tile ? [240, 300] : [280, null]);
      setPadding(c, 24, 24, 24, 24);
      c.fills = [boundFill(src[spec[1]])];
      if (tile) c.primaryAxisAlignItems = 'SPACE_BETWEEN';
      else c.cornerRadius = 18;
      if (tones[t] === 'raised') stroke(c, V.T['color/border'], 1);

      c.appendChild(await vtext('Case', 11, src[spec[3]], { mono: true, upper: true, tracking: 10 }));
      var title = await vtext('Design System', 26, src[spec[2]], { tracking: -3 });
      title.setRangeFontName(0, 7, light);
      title.setRangeFontName(7, 13, bold);
      c.appendChild(title);
      title.layoutAlign = 'STRETCH';
      title.textAutoResize = 'HEIGHT';
      c.appendChild(await vtext('Product · Design Engineering →', 12, src[spec[3]], { mono: true }));
      list.push(c);
    }
  }
  combine(page, list, 'Card', 4, 320, 340,
    'React: <Card tone shape href><CardTag/><CardTitle/><CardMeta/></Card>. raised follows the theme; grey, ink and red are fixed scenes.', { y: 0 });
  report.push('Card: ' + list.length + ' variantes (4 tons × 2 formatos)');
}

// ---------- Apoio ----------

async function syncSupport() {
  var V = await allVars();
  var T = V.T;
  var page = await componentPage('🌸 Support', ['Tag', 'Badge', 'Avatar', 'Link', 'Divider']);
  var cursor = { y: 0 };
  var total = 0, i, list;

  var tag = box('component', 'Tag', 'HORIZONTAL', 8, null);
  setPadding(tag, 6, 10, 6, 10);
  stroke(tag, T['color/border-strong'], 1);
  tag.appendChild(await vtext('Role 01 / 02', 12, T['color/text/primary'], { mono: true, upper: true, tracking: 10 }));
  combine(page, [tag], 'Tag', 1, 200, 40, 'React: <Tag>. Mono label for categories and counters.', cursor);
  total++;

  list = [];
  var tones = [['accent', 'color/action/accent', 'color/action/on-accent'], ['neutral', 'color/action/primary', 'color/text/inverse'], ['outline', null, 'color/text/primary']];
  for (i = 0; i < tones.length; i++) {
    var b = box('component', 'tone=' + tones[i][0], 'HORIZONTAL', 4, null);
    setPadding(b, 5, 12, 5, 12);
    b.cornerRadius = 999;
    if (tones[i][1]) b.fills = [boundFill(T[tones[i][1]])];
    else stroke(b, T['color/border-strong'], 1);
    b.appendChild(await vtext('AA 5.9 : 1', 13, T[tones[i][2]], { style: 'Bold' }));
    list.push(b);
  }
  combine(page, list, 'Badge', 3, 140, 40, 'React: <Badge tone>. Accent (red) for the one thing to notice.', cursor);
  total += list.length;

  list = [];
  var sizes = [['sm', 32], ['md', 44], ['lg', 64]];
  for (i = 0; i < sizes.length; i++) {
    var d = sizes[i][1];
    var a = box('component', 'size=' + sizes[i][0], 'HORIZONTAL', 0, [d, d]);
    a.cornerRadius = d / 2;
    a.primaryAxisAlignItems = 'CENTER';
    a.counterAxisAlignItems = 'CENTER';
    a.fills = [boundFill(T['color/action/primary'])];
    a.appendChild(await vtext('IY', Math.round(d * 0.34), T['color/text/inverse'], { style: 'Bold', tracking: -2 }));
    var dot = box('frame', 'dot', 'HORIZONTAL', 0, [Math.max(3, Math.round(d * 0.11)), Math.max(3, Math.round(d * 0.11))]);
    dot.cornerRadius = 999;
    dot.fills = [boundFill(V.R['color/red/600'])];
    a.appendChild(dot);
    dot.layoutPositioning = 'ABSOLUTE';
    dot.x = Math.round(d * 0.71);
    dot.y = Math.round(d * 0.64);
    list.push(a);
  }
  combine(page, list, 'Avatar', 3, 100, 80, 'React: <Avatar name src size dot />. Initials with the red dot; photo when src loads.', cursor);
  total += list.length;

  var link = box('component', 'Link', 'HORIZONTAL', 4, null);
  link.appendChild(await vtext('View on GitHub', 16, T['color/text/primary'], { underline: true }));
  combine(page, [link], 'Link', 1, 200, 40, 'React: <Link href external />. Red underline in code; Figma underlines in the text color.', cursor);
  total++;

  list = [];
  var weights = [['hairline', 1, 'color/border'], ['strong', 1.5, 'color/border-strong']];
  for (i = 0; i < weights.length; i++) {
    var line = box('component', 'weight=' + weights[i][0], 'HORIZONTAL', 0, [320, weights[i][1]]);
    line.fills = [boundFill(T[weights[i][2]])];
    list.push(line);
  }
  combine(page, list, 'Divider', 1, 360, 24, 'React: <Divider weight />. A real <hr>.', cursor);
  total += list.length;

  report.push('Apoio: ' + total + ' variantes em 5 componentes');
}

// ---------- comandos ----------

async function run(command) {
  if (command === 'variables' || command === 'all') await syncVariables();
  if (command === 'styles' || command === 'all') await syncStyles();
  if (command === 'pages' || command === 'all') await syncPages();
  if (command === 'button' || command === 'all') await syncButton();
  if (command === 'inputs' || command === 'all') await syncInputs();
  if (command === 'card' || command === 'all') await syncCard();
  if (command === 'support' || command === 'all') await syncSupport();
}

run(figma.command || 'all').then(function () {
  figma.closePlugin('IY Lotus 🌸 ' + report.join(' · '));
}).catch(function (e) {
  figma.closePlugin('IY Lotus: erro. ' + (e && e.message ? e.message : String(e)));
});
