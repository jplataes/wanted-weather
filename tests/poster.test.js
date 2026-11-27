// Tests for the poster of the day: genres, titles with real facts, and no invented numbers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { POSTER_THEMES, posterTheme, posterText } from '../src/poster-copy.js';

const facts = { CITY: 'MADRID', TEMP: 38, MAX: 40, MIN: 24, FEELS: 39, GUST: 20, POP: 10, HUM: 20, DESC: 'cielo claro', WIND: 12 };

test('every theme has a genre, titles, taglines and a rating in both languages', () => {
  for (const [id, th] of Object.entries(POSTER_THEMES)) {
    for (const lang of ['es', 'en']) {
      assert.ok(th.genre[lang] && th.rating[lang], `${id} ${lang}`);
      assert.ok(th.titles[lang].length >= 2 && th.taglines[lang].length >= 2, `${id} ${lang}`);
    }
  }
});

test('genre follows the weather', () => {
  const v = (o) => ({ kind: 'clear', feels: 18, night: false, scene: 'sun', ...o });
  assert.equal(posterTheme(v({ feels: 39 })), 'heat');
  assert.equal(posterTheme(v({ kind: 'storm' })), 'storm');
  assert.equal(posterTheme(v({ night: true })), 'night');
  assert.equal(posterTheme(v({ feels: 1, kind: 'clouds' })), 'cold');
  assert.equal(posterTheme(v({ kind: 'clouds' })), 'clouds');
});

test('the classic title with real numbers', () => {
  const p = posterText('heat', facts, 'en', 0);
  assert.equal(p.title, 'MADRID: 38° OF FURY');
  assert.equal(p.genre, 'Action');
  assert.ok(p.credits.includes('Starring MADRID'));
  assert.equal(posterText('heat', facts, 'es', 0).title, 'MADRID: 38° DE FURIA');
});

test('lines that need missing numbers are skipped, and titles cycle', () => {
  const noForecast = { ...facts, MAX: null, MIN: null, POP: null };
  const p = posterText('heat', noForecast, 'es', 0);
  assert.ok(!p.tagline.includes('null') && !/\{\w+\}/.test(p.tagline));
  const rain = posterText('rain', noForecast, 'es', 0);
  assert.ok(!rain.tagline.includes('%'));
  assert.notEqual(posterText('heat', facts, 'es', 0).title, posterText('heat', facts, 'es', 1).title);
});
