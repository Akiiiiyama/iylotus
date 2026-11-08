// Testa o HTML que o Button gera (renderToStaticMarkup, sem navegador).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '../dist/index.js';

const html = (props, children) => renderToStaticMarkup(h(Button, props, children));

test('padrão: primary, md, type="button"', () => {
  const out = html({}, 'Go');
  assert.match(out, /class="iy-button iy-button--primary iy-button--md"/);
  assert.match(out, /type="button"/);
});

test('variante e tamanho viram classes com o nome do Figma', () => {
  assert.match(html({ variant: 'accent', size: 'lg' }, 'Go'), /iy-button--accent iy-button--lg/);
});

test('loading: aria-busy e aria-disabled, sem perder o foco (não usa disabled)', () => {
  const out = html({ loading: true }, 'Saving');
  assert.match(out, /aria-busy="true"/);
  assert.match(out, /aria-disabled="true"/);
  assert.doesNotMatch(out, / disabled=""/);
  assert.match(out, /iy-button__spinner/);
});

test('só ícone: classe icon-only e o ícone escondido do leitor de tela', () => {
  const out = html({ iconStart: h('svg'), 'aria-label': 'Add' });
  assert.match(out, /iy-button--icon-only/);
  assert.match(out, /aria-label="Add"/);
  assert.match(out, /class="iy-button__icon" aria-hidden="true"/);
});

test('className do usuário é somado, não substitui', () => {
  assert.match(html({ className: 'extra' }, 'Go'), /iy-button--md extra/);
});
