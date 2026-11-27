// Tests for the City Duel.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { playDuel, skyScore, roundLine, verdict, randomRival } from '../src/duel.js';

const city = (o = {}) => ({
  weather: [{ id: o.id ?? 800, description: o.desc ?? 'cielo claro' }],
  main: { feels_like: o.feels ?? 22, humidity: o.hum ?? 45 },
  wind: { speed: o.wind ?? 2, gust: o.gust ?? 0 },
  sys: { sunrise: 0, sunset: (o.day ?? 600) * 60 },
});

test('sky ranking', () => {
  assert.ok(skyScore(800) > skyScore(802));
  assert.ok(skyScore(802) > skyScore(804));
  assert.ok(skyScore(804) > skyScore(500));
  assert.ok(skyScore(500) > skyScore(211));
});

test('a perfect day beats a stormy, windy, humid, short day 5-0', () => {
  const d = playDuel(city(), city({ id: 211, desc: 'tormenta', feels: 5, hum: 95, wind: 15, day: 540 }));
  assert.deepEqual(d.score, { you: 5, rival: 0 });
  assert.equal(d.result, 'win');
});

test('the same weather is a draw', () => {
  const d = playDuel(city(), city());
  assert.equal(d.result, 'draw');
  assert.ok(d.rounds.every((r) => r.winner === 'tie'));
});

test('losing, and commentary with real values', () => {
  const d = playDuel(city({ feels: 2, hum: 90 }), city());
  assert.equal(d.result, 'lose');
  const temp = d.rounds.find((r) => r.id === 'temp');
  assert.equal(roundLine(temp, 'Madrid', 'Dubái', 'es'), 'Dubái gana el asalto del termómetro: 22° de sensación contra 2°.');
  assert.match(verdict(d, 'Madrid', 'Dubái', 'en'), /Dubái|Madrid/);
  assert.ok(verdict(d, 'Madrid', 'Dubái', 'es').includes(`${d.score.rival}-${d.score.you}`), 'winner goals first');
  assert.ok(!/\{\w+\}/.test(verdict(d, 'Madrid', 'Dubái', 'es')));
});

test('random rival is never your own city', () => {
  for (const r of [0, 0.1, 0.5, 0.99]) assert.notEqual(randomRival('Londres', () => r).q, 'London');
  assert.ok(randomRival('', () => 0).es);
});
