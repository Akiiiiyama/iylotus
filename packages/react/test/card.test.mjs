// Testa o HTML do Card: article ou link, tons e formatos como classes, partes com a estrutura certa.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Card, CardTitle, CardStat, CardTag } from '../dist/index.js';

const html = (C, props, ...children) => renderToStaticMarkup(h(C, props, ...children));

test('sem href é um <article> estático, com raised e rounded por padrão', () => {
  assert.match(html(Card, {}, 'x'), /^<article class="iy-card iy-card--raised iy-card--rounded">/);
});

test('com href o card inteiro vira um link', () => {
  const out = html(Card, { href: '/case', tone: 'ink', shape: 'tile' }, 'x');
  assert.match(out, /^<a class="iy-card iy-card--ink iy-card--tile iy-card--link" href="\/case">/);
});

test('CardTitle é h3 por padrão e aceita outro nível', () => {
  assert.match(html(CardTitle, {}, 'T'), /^<h3 class="iy-card__title">T<\/h3>/);
  assert.match(html(CardTitle, { as: 'h2' }, 'T'), /^<h2 /);
});

test('CardStat: número leve e sufixo negrito', () => {
  assert.equal(html(CardStat, { value: '12', suffix: '+' }), '<p class="iy-card__stat"><span class="iy-lt">12</span><span class="iy-bd">+</span></p>');
});

test('className do usuário é somado', () => {
  assert.match(html(CardTag, { className: 'x' }, 'Case'), /class="iy-card__tag x"/);
});
