// Tests for the arcade game rules that depend on the real weather.
import { test } from 'node:test';
import assert from 'node:assert/strict';

// dodge.js touches the DOM only inside its functions; importing it in Node is safe.
const { hazardFor, windPush } = await import('../src/dodge.js');

test('what falls follows the weather', () => {
  const v = (o) => ({ kind: 'clouds', feels: 15, windKmh: 5, scene: 'clouds', ...o });
  assert.equal(hazardFor(v({ kind: 'rain' })), 'rain');
  assert.equal(hazardFor(v({ kind: 'storm' })), 'storm');
  assert.equal(hazardFor(v({ kind: 'snow' })), 'snow');
  assert.equal(hazardFor(v({ feels: 32 })), 'heat');
  assert.equal(hazardFor(v({ windKmh: 40 })), 'wind');
  assert.equal(hazardFor(v({})), 'clouds');
  assert.equal(hazardFor(v({ kind: 'clear' })), 'sun');
});

test('wind pushes sideways in the real direction', () => {
  assert.ok(windPush(40, 270) > 0, 'wind from the west blows east (right)');
  assert.ok(windPush(40, 90) < 0, 'wind from the east blows west (left)');
  assert.equal(Math.abs(windPush(40, 0)) < 1, true, 'north wind: no sideways push');
});
