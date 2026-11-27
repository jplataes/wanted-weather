// Tests for the Excuse-o-matic and the radio station choice.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EXCUSES, excuseThemes, excusePool, makePicker } from '../src/excuses.js';
import { STATIONS, stationFor, djLine } from '../src/radio-lines.js';

const view = (over = {}) => ({ kind: 'clear', feels: 18, windKmh: 5, night: false, scene: 'sun', ...over });
const facts = { temp: 12, feels: 10, wind: 40, humidity: 85, pop: 70, time: '21:30', city: 'Madrid' };

test('every excuse theme has lines in both languages', () => {
  for (const [theme, langs] of Object.entries(EXCUSES)) {
    assert.ok(langs.es.length >= 3, `${theme} es`);
    assert.equal(langs.es.length, langs.en.length, `${theme} same count`);
  }
});

test('excuse themes follow the weather', () => {
  assert.deepEqual(excuseThemes(view({ kind: 'rain' })), ['rain']);
  assert.deepEqual(excuseThemes(view({ kind: 'clear', feels: 35 })), ['heat']);
  assert.deepEqual(excuseThemes(view({ kind: 'clouds', feels: 2, night: true })), ['cold', 'night']);
  assert.deepEqual(excuseThemes(view({ kind: 'clear' })), ['clear']);
  assert.deepEqual(excuseThemes(view({ kind: 'clouds', windKmh: 45 })), ['wind']);
});

test('excuses get real numbers, and lines needing unknown numbers are skipped', () => {
  const pool = excusePool(view({ kind: 'rain' }), 'es', facts);
  assert.ok(pool.some((l) => l.includes('70%')));
  assert.ok(pool.every((l) => !/\{\w+\}/.test(l)));
  const noPop = excusePool(view({ kind: 'rain' }), 'es', { ...facts, pop: null });
  assert.ok(noPop.length > 0 && noPop.every((l) => !l.includes('%')));
});

test('the picker does not repeat until the bag is empty', () => {
  const pick = makePicker(() => 0.3);
  const pool = ['a', 'b', 'c', 'd'];
  const seen = new Set([pick(pool), pick(pool), pick(pool), pick(pool)]);
  assert.equal(seen.size, 4);
});

test('radio: recommended station by weather', () => {
  assert.equal(stationFor(view({ kind: 'storm' })), 'tormenta');
  assert.equal(stationFor(view({ kind: 'rain' })), 'chaparron');
  assert.equal(stationFor(view({ kind: 'clear', night: true })), 'neon');
  assert.equal(stationFor(view({ kind: 'clear' })), 'sol');
});

test('radio: host lines use real facts in both languages', () => {
  for (const id of Object.keys(STATIONS)) {
    for (const lang of ['es', 'en']) {
      for (let i = 0; i < STATIONS[id].lines[lang].length; i++) {
        const line = djLine(id, i, { ...facts, desc: 'nubes', sunset: '17:50', mission: 'Operación Charco' }, lang);
        assert.ok(!/\{\w+\}/.test(line), `${id} ${lang} ${i}`);
      }
    }
  }
});
