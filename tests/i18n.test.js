import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickLang } from '../src/i18n.js';

test('a phone in any Spanish starts in Spanish', () => {
  for (const code of ['es', 'es-ES', 'es-MX', 'es-AR', 'ES-es', 'es_419']) assert.equal(pickLang(null, [code]), 'es', code);
});

test('a phone in any other language starts in English', () => {
  for (const code of ['en-US', 'en-GB', 'fr-FR', 'it-IT', 'de-DE', 'pt-BR', 'ca-ES', 'eu', 'gl-ES']) assert.equal(pickLang(null, [code]), 'en', code);
});

test('the main phone language decides, not the second one', () => {
  assert.equal(pickLang(null, ['fr-FR', 'es-ES']), 'en');
  assert.equal(pickLang(null, ['es-ES', 'en-US']), 'es');
});

test('a language chosen with the switch always wins', () => {
  assert.equal(pickLang('es', ['fr-FR']), 'es');
  assert.equal(pickLang('en', ['es-ES']), 'en');
});

test('with no information it stays in Spanish', () => {
  assert.equal(pickLang(null, []), 'es');
  assert.equal(pickLang(null, undefined), 'es');
  assert.equal(pickLang(null, [undefined, '']), 'es');
  assert.equal(pickLang('xx', ['']), 'es');
});
