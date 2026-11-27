// Tests for the forecast summary and the mission of the day.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeForecast } from '../src/forecast.js';
import { themeFor, gearFor, buildMission, upcomingCard } from '../src/missions.js';

// A tiny forecast: UTC city, starting at 2026-11-27 00:00, every 3 hours for 3 days
const start = Date.UTC(2026, 10, 27, 0) / 1000;
const slot = (i, over = {}) => ({
  dt: start + i * 3 * 3600,
  main: { temp: 10 + (i % 8), temp_min: 9 + (i % 8), temp_max: 11 + (i % 8), feels_like: 9 + (i % 8) },
  weather: [{ id: 800, description: 'cielo claro' }],
  wind: { speed: 3 },
  pop: 0,
  ...over,
});
const forecast = {
  city: { timezone: 0 },
  list: Array.from({ length: 24 }, (_, i) => (i === 13 ? slot(i, { weather: [{ id: 502, description: 'lluvia fuerte' }], pop: 0.9, rain: { '3h': 8 } }) : slot(i))),
};

test('forecast is grouped by local day', () => {
  const { today, days } = summarizeForecast(forecast, start + 3600);
  assert.equal(today.key, '2026-11-27');
  assert.equal(days[0].key, '2026-11-28');
  assert.equal(days.length, 2);
});

test('a day takes its worst weather and real numbers', () => {
  const { days } = summarizeForecast(forecast, start + 3600);
  const sat = days[0];
  assert.equal(sat.kind, 'rain');
  assert.equal(sat.pop, 90);
  assert.equal(sat.rainMm, 8);
  assert.equal(sat.level, 4);
  assert.equal(sat.rainStart, '15:00');
});

test('themes: worst conditions first', () => {
  assert.equal(themeFor({ kind: 'storm', pop: 0, maxFeels: 20, minFeels: 10, windKmh: 0 }), 'storm');
  assert.equal(themeFor({ kind: 'clear', pop: 60, maxFeels: 20, minFeels: 10, windKmh: 0 }), 'rain');
  assert.equal(themeFor({ kind: 'clear', pop: 0, maxFeels: 34, minFeels: 20, windKmh: 0 }), 'heat');
  assert.equal(themeFor({ kind: 'clouds', pop: 0, maxFeels: 5, minFeels: 1, windKmh: 0 }), 'cold');
  assert.equal(themeFor({ kind: 'clear', pop: 0, maxFeels: 20, minFeels: 12, windKmh: 0 }), 'clear');
});

test('gear follows the numbers', () => {
  assert.deepEqual(gearFor({ kind: 'rain', pop: 80, rainMm: 6, windKmh: 10, min: 8, max: 12, minFeels: 6, maxFeels: 11 }), ['umbrella', 'boots', 'coat']);
  assert.ok(gearFor({ kind: 'clear', pop: 0, rainMm: 0, windKmh: 5, min: 22, max: 33, minFeels: 22, maxFeels: 35 }).includes('sunglasses'));
  assert.ok(gearFor({ kind: 'clouds', pop: 0, rainMm: 0, windKmh: 5, min: 0, max: 4, minFeels: -2, maxFeels: 3 }).includes('scarf'));
  assert.ok(gearFor({ kind: 'clouds', pop: 0, rainMm: 0, windKmh: 5, min: 18, max: 21, minFeels: 18, maxFeels: 21 }).length >= 1);
});

test('mission has title, objective, intel from real data, gear and a call script', () => {
  const { days } = summarizeForecast(forecast, start + 3600);
  const view = { seed: '1-2026-11-27', temp: 12, feels: 11, windKmh: 10, gustKmh: 0, kind: 'clear', city: 'Testville', sunset: '17:50', level: 1 };
  const m = buildMission({ day: days[0], when: 'tomorrow', view, lang: 'es' });
  assert.equal(m.theme, 'rain');
  assert.ok(m.title && m.objective);
  assert.ok(m.intel.some((l) => l.includes('90%') && l.includes('15:00')));
  assert.ok(m.gear.some((g) => g.label === 'Paraguas'));
  assert.ok(m.script.includes('Testville'));
  const en = buildMission({ day: days[0], when: 'tomorrow', view, lang: 'en' });
  assert.ok(en.gear.some((g) => g.label === 'Umbrella'));
});

test('mission still works without a forecast', () => {
  const view = { seed: 's', temp: 36, feels: 38, windKmh: 5, gustKmh: 0, kind: 'clear', city: 'X', sunset: '20:00', level: 4 };
  const m = buildMission({ day: null, when: 'today', view, lang: 'en' });
  assert.equal(m.theme, 'heat');
  assert.ok(m.intel[0].includes('36°'));
});

test('upcoming card has a weekday in the right language', () => {
  const { days } = summarizeForecast(forecast, start + 3600);
  assert.equal(upcomingCard(days[0], 'es', 's').weekday, 'Sábado');
  assert.equal(upcomingCard(days[0], 'en', 's').weekday, 'Saturday');
});
