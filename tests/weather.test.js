// Tests for the game logic (wanted level, scene choice, formatting).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kindFromCode, sceneFor, wantedLevel, compassIndex, cityTime, buildView } from '../src/weather.js';

const base = (over = {}) => ({
  id: 1, name: 'Testville', dt: 1700000000, timezone: 3600,
  coord: { lat: 40.4, lon: -3.7 },
  sys: { country: 'ES', sunrise: 1699990000, sunset: 1700030000 },
  weather: [{ id: 800, description: 'cielo claro' }],
  main: { temp: 20, feels_like: 20, humidity: 50 },
  wind: { speed: 2, deg: 90 },
  ...over,
});

test('weather kinds from condition codes', () => {
  assert.equal(kindFromCode(211), 'storm');
  assert.equal(kindFromCode(501), 'rain');
  assert.equal(kindFromCode(601), 'snow');
  assert.equal(kindFromCode(741), 'fog');
  assert.equal(kindFromCode(800), 'clear');
  assert.equal(kindFromCode(803), 'clouds');
});

test('scene: rain wins over night, otherwise night or sun', () => {
  assert.equal(sceneFor('rain', true), 'rain');
  assert.equal(sceneFor('clear', true), 'night');
  assert.equal(sceneFor('clouds', false), 'sun');
});

test('a mild clear day is 1 star with no alert', () => {
  const w = wantedLevel(base());
  assert.equal(w.level, 1);
  assert.equal(w.extreme, null);
});

test('heavy rain, heat, cold, wind and storm raise the level', () => {
  assert.deepEqual([wantedLevel(base({ weather: [{ id: 502 }] })).level, wantedLevel(base({ weather: [{ id: 502 }] })).extreme], [4, 'rain']);
  assert.equal(wantedLevel(base({ main: { temp: 41, feels_like: 42 } })).extreme, 'heat');
  assert.equal(wantedLevel(base({ main: { temp: -12, feels_like: -15 } })).extreme, 'cold');
  assert.equal(wantedLevel(base({ wind: { speed: 20, deg: 0 } })).extreme, 'wind');
  assert.deepEqual([wantedLevel(base({ weather: [{ id: 212 }] })).level, wantedLevel(base({ weather: [{ id: 212 }] })).extreme], [5, 'storm']);
});

test('moderate conditions give stars but no alert', () => {
  const w = wantedLevel(base({ weather: [{ id: 501 }] }));
  assert.equal(w.level, 3);
  assert.equal(w.extreme, null);
});

test('compass and local time', () => {
  assert.equal(compassIndex(0), 0);
  assert.equal(compassIndex(90), 2);
  assert.equal(compassIndex(359), 0);
  assert.equal(cityTime(0, 3600, 'es'), '01:00');
});

test('buildView rounds values and converts wind to km/h', () => {
  const v = buildView(base({ main: { temp: 20.6, feels_like: 19.4, humidity: 50.2 }, wind: { speed: 5, deg: 180 } }), 'es');
  assert.equal(v.temp, 21);
  assert.equal(v.feels, 19);
  assert.equal(v.windKmh, 18);
  assert.equal(v.description, 'Cielo claro');
});
