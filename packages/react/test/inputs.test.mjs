// Testa o HTML que os Inputs geram: rótulo ligado ao campo, ajuda e erro anunciados, papéis de acessibilidade.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TextField, TextArea, Select, Checkbox, Radio, RadioGroup, Switch } from '../dist/index.js';

const html = (C, props, ...children) => renderToStaticMarkup(h(C, props, ...children));

test('TextField: label aponta para o input pelo id', () => {
  const out = html(TextField, { label: 'Email', id: 'email' });
  assert.match(out, /<label class="iy-field__label" for="email">Email<\/label>/);
  assert.match(out, /<input id="email"/);
});

test('TextField: ajuda e erro entram no aria-describedby, e o erro marca aria-invalid', () => {
  const out = html(TextField, { label: 'Email', id: 'e', hint: 'Só para responder', error: 'Falta o domínio' });
  assert.match(out, /aria-invalid="true"/);
  assert.match(out, /aria-describedby="e-hint e-error"/);
  assert.match(out, /id="e-error">Falta o domínio/);
});

test('TextField: sem erro não marca aria-invalid', () => {
  assert.doesNotMatch(html(TextField, { label: 'Nome' }), /aria-invalid/);
});

test('TextField: contador aparece com maxLength e showCount', () => {
  assert.match(html(TextField, { label: 'Título', defaultValue: 'Design', maxLength: 40, showCount: true }), /6 \/ 40/);
});

test('TextArea: mesmo padrão de label e erro', () => {
  const out = html(TextArea, { label: 'Mensagem', id: 'm', error: 'Escreva mais' });
  assert.match(out, /for="m"/);
  assert.match(out, /<textarea[^>]*aria-invalid="true"/);
});

test('Select: placeholder vira a primeira opção vazia e desabilitada', () => {
  const out = html(Select, { label: 'Papel', placeholder: 'Escolha' }, h('option', { value: 'de' }, 'Design Engineer'));
  assert.match(out, /<option value="" disabled="" selected="">Escolha<\/option>/);
});

test('Checkbox: input nativo dentro do label', () => {
  const out = html(Checkbox, { label: 'Design Systems', defaultChecked: true });
  assert.match(out, /<label class="iy-choice"><input type="checkbox"[^>]*checked=""/);
});

test('RadioGroup: fieldset com legend, mesmo name e defaultValue marcado', () => {
  const out = html(RadioGroup, { legend: 'Papel', name: 'role', defaultValue: 'b' },
    h(Radio, { value: 'a', label: 'A' }), h(Radio, { value: 'b', label: 'B' }));
  assert.match(out, /<fieldset[^>]*><legend class="iy-radio-group__legend">Papel<\/legend>/);
  assert.equal((out.match(/name="role"/g) || []).length, 2);
  assert.match(out, /<input type="radio"[^>]*checked=""[^>]*value="b"/);
  assert.doesNotMatch(out, /checked=""[^>]*value="a"/);
});

test('Switch: role="switch" com aria-checked', () => {
  assert.match(html(Switch, { label: 'Modo escuro', defaultChecked: true }), /role="switch" aria-checked="true"/);
  assert.match(html(Switch, { label: 'Modo escuro' }), /aria-checked="false"/);
});
