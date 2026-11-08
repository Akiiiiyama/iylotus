// Sabedoria: AA como mínimo. Se um token novo quebrar o contraste, o teste falha antes de publicar.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const { themes } = JSON.parse(await readFile(new URL('../dist/tokens.json', import.meta.url), 'utf8'));

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// [frente, fundo, mínimo]: 4.5 para texto, 3 para ícones e bordas de controle
const PAIRS = [
  ['color/text/primary', 'color/bg', 4.5],
  ['color/text/primary', 'color/surface', 4.5],
  ['color/text/secondary', 'color/bg', 4.5],
  ['color/text/secondary', 'color/surface', 4.5],
  ['color/text/accent', 'color/bg', 4.5],
  ['color/feedback/danger', 'color/bg', 4.5],
  ['color/action/on-accent', 'color/action/accent', 4.5],
  ['color/text/inverse', 'color/action/primary', 4.5],
  ['color/icon/muted', 'color/bg', 3],
  ['color/focus', 'color/bg', 3],
];

for (const [mode, list] of Object.entries(themes)) {
  const get = (name) => list.find((t) => t.name === name)?.value;
  for (const [fg, bg, min] of PAIRS) {
    test(`${mode}: ${fg} sobre ${bg} ≥ ${min}:1`, () => {
      const r = ratio(get(fg), get(bg));
      assert.ok(r >= min, `${r.toFixed(2)}:1 está abaixo de ${min}:1`);
    });
  }
}
