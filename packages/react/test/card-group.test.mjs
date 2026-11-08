// Testa o HTML do CardGroup e se o CSS do spotlight foi para o pacote.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CardGroup } from '../dist/index.js';

const html = (props, ...children) => renderToStaticMarkup(h(CardGroup, props, ...children));

test('sem spotlight é só o agrupador', () => {
  assert.equal(html({}, 'x'), '<div class="iy-card-group">x</div>');
});

test('spotlight soma a classe e mantém a do usuário', () => {
  assert.equal(html({ spotlight: true, className: 'projects' }, 'x'), '<div class="iy-card-group iy-card-group--spotlight projects">x</div>');
});

test('o CSS do spotlight apaga os outros cards no hover e no foco pelo teclado', async () => {
  const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.iy-card-group--spotlight:has\(> \.iy-card--link:hover\) > \.iy-card:not\(:hover\)/);
  assert.match(css, /:focus-visible\) > \.iy-card:not\(:focus-visible\)/);
});
