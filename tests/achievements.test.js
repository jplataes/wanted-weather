// Tests for achievements and the nickname.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ACHIEVEMENTS, evaluate, nickname, tierFor, nextTier, promotionCall } from '../src/achievements.js';

const empty = () => ({ unlocked: {}, cities: [], pulls: 0 });
const p0 = { respect: 0, streak: 0 };
const view = (o) => ({ id: 1, kind: 'clear', feels: 18, gustShowKmh: 10, level: 1, ...o });

test('every achievement has a name and a hint in both languages', () => {
  const ids = new Set();
  for (const a of ACHIEVEMENTS) {
    assert.ok(!ids.has(a.id), `duplicate ${a.id}`);
    ids.add(a.id);
    assert.ok(a.name.es && a.name.en && a.hint.es && a.hint.en, a.id);
  }
});

test('the real weather unlocks weather achievements', () => {
  assert.deepEqual(evaluate({ type: 'weather', view: view({}) }, empty(), p0), ['newcomer']);
  const storm = evaluate({ type: 'weather', view: view({ kind: 'storm', level: 5, gustShowKmh: 70 }) }, { ...empty(), unlocked: { newcomer: 1 } }, p0);
  assert.deepEqual(storm.sort(), ['gale', 'storm', 'wanted']);
  assert.ok(evaluate({ type: 'weather', view: view({ feels: 36 }) }, empty(), p0).includes('oven'));
});

test('already unlocked achievements do not repeat', () => {
  assert.deepEqual(evaluate({ type: 'weather', view: view({}) }, { ...empty(), unlocked: { newcomer: 1 } }, p0), []);
});

test('games and progress unlock their achievements', () => {
  assert.deepEqual(evaluate({ type: 'duel', result: 'win', score: { you: 5, rival: 0 } }, empty(), p0).sort(), ['duelWin', 'firstDuel', 'whitewash']);
  assert.deepEqual(evaluate({ type: 'dodge', survived: true, lives: 3 }, empty(), p0).sort(), ['survivor', 'untouchable']);
  assert.ok(evaluate({ type: 'progress' }, empty(), { respect: 600, streak: 7 }).includes('streak7'));
  assert.ok(evaluate({ type: 'excuse' }, { ...empty(), pulls: 10 }, p0).includes('excuses'));
  assert.ok(evaluate({ type: 'bet', grade: 'exact' }, empty(), p0).includes('bullseye'));
});

test('nickname by respect, with streak', () => {
  assert.equal(nickname(0, 0, 'es'), 'Turista del tiempo');
  assert.equal(tierFor(1000), 4);
  assert.equal(nickname(1000, 4, 'es'), 'Leyenda del Chubasco · en racha de 4 días');
  assert.equal(nextTier(120).min, 250);
  assert.equal(nextTier(5000), null);
  assert.ok(promotionCall('Mirón de nubes', 'es').includes('«Mirón de nubes»'));
});
