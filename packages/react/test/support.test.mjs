// Testa o HTML dos componentes de apoio.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Tag, Badge, Avatar, Link, Divider } from '../dist/index.js';

const html = (C, props, ...children) => renderToStaticMarkup(h(C, props, ...children));

test('Tag: span com a classe do sistema', () => {
  assert.equal(html(Tag, {}, 'Role'), '<span class="iy-tag">Role</span>');
});

test('Badge: accent por padrão e tom como classe', () => {
  assert.match(html(Badge, {}, 'AA'), /iy-badge iy-badge--accent/);
  assert.match(html(Badge, { tone: 'outline' }, 'Draft'), /iy-badge--outline/);
});

test('Avatar: iniciais da primeira e da última palavra, nome completo para leitor de tela', () => {
  const out = html(Avatar, { name: 'Isabela Yukari Akiyama' });
  assert.match(out, /role="img" aria-label="Isabela Yukari Akiyama"/);
  assert.match(out, /<span aria-hidden="true">IA<\/span>/);
  assert.match(out, /iy-avatar--dot/);
});

test('Avatar com foto: img decorativa (alt vazio) e sem ponto', () => {
  const out = html(Avatar, { name: 'Isabela', src: '/me.jpg' });
  assert.match(out, /<img class="iy-avatar__img" src="\/me.jpg" alt=""\/>/);
  assert.doesNotMatch(out, /iy-avatar--dot/);
});

test('Link externo: nova aba com rel seguro e aviso para leitor de tela', () => {
  const out = html(Link, { href: 'https://x.com', external: true }, 'X');
  assert.match(out, /target="_blank" rel="noopener noreferrer"/);
  assert.match(out, /\(opens in a new tab\)/);
});

test('Link interno: sem target', () => {
  assert.doesNotMatch(html(Link, { href: '#a' }, 'A'), /target=/);
});

test('Divider: hr com peso como classe', () => {
  assert.equal(html(Divider, { weight: 'strong' }), '<hr class="iy-divider iy-divider--strong"/>');
});
