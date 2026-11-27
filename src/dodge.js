// dodge.js — "Dodge the Downpour": a 20-second arcade game drawn on a canvas.
// What falls depends on today's real weather, the difficulty on today's stars,
// and the real wind pushes everything sideways.
import { t, getLang } from './i18n.js';
import { recordDodge, getProgress } from './progress.js';

const W = 360;
const H = 440;
const GAME_SECONDS = 20;
const PLAYER_Y = H - 46;
const SKYLINE = 'M0 232V182H22V152H48V170H62V122H70V110H78V122H92V162H110V142H138V176H150V96H168V84H178V96H196V150H214V132H240V166H258V116H290V152H306V172H322V126H334V108H346V126H360V162H380V142H400V232Z';
const STAR = 'M12 2L14.9 8.6L22 9.3L16.6 14L18.2 21L12 17.3L5.8 21L7.4 14L2 9.3L9.1 8.6Z';

const SKIES = {
  rain: ['#1c2846', '#5a3d7a'], storm: ['#0d0620', '#3b2f63'], snow: ['#7d8fd0', '#e9eeff'], fog: ['#4a3f63', '#a297b5'],
  clear: ['#ff2e8a', '#ffc93c'], clouds: ['#8a7fd8', '#ffb38a'], wind: ['#19a6c4', '#ffd27a'], night: ['#0d0620', '#6e2bc4'],
};

/** What falls today. */
export function hazardFor(view) {
  if (view.kind === 'storm') return 'storm';
  if (view.kind === 'rain') return 'rain';
  if (view.kind === 'snow') return 'snow';
  if (view.feels >= 27) return 'heat';
  if (view.scene === 'wind' || view.windKmh >= 30) return 'wind';
  if (view.kind === 'clear') return 'sun';
  return 'clouds';
}

/** Sideways push in px/s from the real wind (direction it blows to). */
export function windPush(windKmh, windDeg) {
  const to = ((windDeg + 180) % 360) * (Math.PI / 180);
  return Math.round(Math.sin(to) * Math.min(windKmh, 80) * 1.2);
}

let canvas;
let ctx;
let view = null;
let state = 'idle'; // idle | playing | over
let player;
let items;
let elapsed;
let lives;
let score;
let spawnTimer;
let lastTime;
let invulnerable;
let dir = 0;
let targetX = null;
let raf = null;
let skyline;
let star;
const $ = (id) => document.getElementById(id);

function sizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ---------- Drawing ----------
function drawBackground() {
  const key = view ? (view.night && !['rain', 'storm', 'snow', 'fog'].includes(view.kind) ? 'night' : view.scene) : 'clouds';
  const [top, bottom] = SKIES[key] || SKIES.clouds;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.translate(0, H - 205);
  ctx.scale(W / 400, 0.9);
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = '#1e1638';
  ctx.fill(skyline);
  ctx.restore();
  ctx.fillStyle = '#2a1250';
  ctx.fillRect(0, H - 24, W, 24);
  ctx.fillStyle = '#ffc93c';
  for (let x = 6; x < W; x += 34) ctx.fillRect(x, H - 13, 18, 3);
}

function drawPlayer() {
  if (invulnerable > 0 && Math.floor(invulnerable * 12) % 2 === 0) return; // blink after a hit
  const { x } = player;
  ctx.save();
  ctx.translate(x, PLAYER_Y);
  ctx.fillStyle = '#140a24';
  ctx.strokeStyle = '#fff3dc';
  ctx.lineWidth = 2;
  // legs, body, head
  ctx.fillRect(-8, 4, 6, 20);
  ctx.fillRect(2, 4, 6, 20);
  ctx.beginPath();
  ctx.roundRect(-12, -22, 24, 30, 6);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -31, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // gear on the head: newspaper in the rain, shades in the heat
  const hazard = view ? hazardFor(view) : 'rain';
  if (hazard === 'rain' || hazard === 'storm') {
    ctx.fillStyle = '#fff3dc';
    ctx.strokeStyle = '#140a24';
    ctx.beginPath();
    ctx.rect(-18, -48, 36, 8);
    ctx.fill();
    ctx.stroke();
  } else if (hazard === 'heat' || hazard === 'sun') {
    ctx.fillStyle = '#16c7b7';
    ctx.fillRect(-8, -34, 7, 4);
    ctx.fillRect(1, -34, 7, 4);
  } else if (hazard === 'snow') {
    ctx.fillStyle = '#ff2e8a';
    ctx.fillRect(-11, -14, 22, 5);
  }
  ctx.restore();
}

function drawItem(it) {
  ctx.save();
  ctx.translate(it.x, it.y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#140a24';
  if (it.type === 'drop') {
    ctx.fillStyle = '#bfe9ff';
    ctx.beginPath();
    ctx.moveTo(0, -it.r * 1.6);
    ctx.quadraticCurveTo(it.r, 0, 0, it.r);
    ctx.quadraticCurveTo(-it.r, 0, 0, -it.r * 1.6);
    ctx.fill();
    ctx.stroke();
  } else if (it.type === 'bolt') {
    ctx.fillStyle = '#ffc93c';
    ctx.beginPath();
    ctx.moveTo(-4, -18); ctx.lineTo(8, -18); ctx.lineTo(2, -4); ctx.lineTo(9, -4); ctx.lineTo(-6, 18); ctx.lineTo(-1, 2); ctx.lineTo(-8, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (it.type === 'flake') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, it.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (it.type === 'sun') {
    ctx.rotate(it.spin);
    ctx.fillStyle = '#ffc93c';
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-2, -it.r - 6, 4, 6);
    }
    ctx.beginPath();
    ctx.arc(0, 0, it.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (it.type === 'leaf') {
    ctx.rotate(it.spin);
    ctx.fillStyle = '#0e7a66';
    ctx.beginPath();
    ctx.ellipse(0, 0, it.r * 1.3, it.r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    // cloud puff
    ctx.fillStyle = '#e2d8fb';
    ctx.beginPath();
    ctx.arc(-6, 0, it.r * 0.7, 0, Math.PI * 2);
    ctx.arc(6, -3, it.r * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawHud() {
  // lives as wanted stars
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(10 + i * 26, 10);
    ctx.fillStyle = i < lives ? '#ffc93c' : 'rgba(255,243,220,.15)';
    ctx.strokeStyle = '#140a24';
    ctx.lineWidth = 1.5;
    ctx.fill(star);
    ctx.stroke(star);
    ctx.restore();
  }
  ctx.fillStyle = '#140a24';
  ctx.fillRect(W - 92, 10, 82, 26);
  ctx.fillStyle = '#ffc93c';
  ctx.font = '400 20px Anton, Impact, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(String(score).padStart(3, '0'), W - 16, 31);
  // time bar
  const left = Math.max(0, 1 - elapsed / GAME_SECONDS);
  ctx.fillStyle = 'rgba(20,10,36,.6)';
  ctx.fillRect(10, 42, W - 20, 6);
  ctx.fillStyle = left < 0.25 ? '#ff2e8a' : '#16c7b7';
  ctx.fillRect(10, 42, (W - 20) * left, 6);
}

function draw() {
  drawBackground();
  items?.forEach(drawItem);
  if (player) drawPlayer();
  if (state === 'playing') drawHud();
}

// ---------- Game ----------
function spawn() {
  const hazard = hazardFor(view);
  const level = view.level;
  const push = windPush(view.windKmh, view.windDeg);
  const base = 150 + level * 28 + elapsed * 6;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const type = {
    rain: 'drop', storm: pick(['drop', 'drop', 'bolt']), snow: 'flake', heat: 'sun', sun: 'sun', wind: pick(['leaf', 'leaf', 'cloud']), clouds: pick(['cloud', 'drop']),
  }[hazard];
  const r = type === 'sun' ? 11 : type === 'bolt' ? 12 : type === 'flake' ? 7 : 8;
  items.push({ type, r, x: 14 + Math.random() * (W - 28), y: -20, vy: base * (type === 'bolt' ? 1.35 : type === 'flake' ? 0.75 : 1) * (0.85 + Math.random() * 0.3), vx: push * (type === 'leaf' || type === 'flake' ? 1.4 : 0.6), spin: 0 });
}

function step(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  elapsed += dt;
  invulnerable = Math.max(0, invulnerable - dt);

  // movement: buttons/keys or follow the finger
  const speed = 280;
  if (targetX !== null) {
    const d = targetX - player.x;
    player.x += Math.sign(d) * Math.min(Math.abs(d), speed * dt);
  } else {
    player.x += dir * speed * dt;
  }
  player.x = Math.max(16, Math.min(W - 16, player.x));

  // spawning: more and faster on rougher days and as time runs out
  spawnTimer -= dt;
  const rate = 1.4 + view.level * 0.45 + elapsed * 0.08;
  if (spawnTimer <= 0) {
    spawn();
    spawnTimer = 1 / rate;
  }

  for (const it of items) {
    it.y += it.vy * dt;
    it.x += it.vx * dt;
    it.spin += dt * 3;
    if (it.x < -20) it.x = W + 20;
    if (it.x > W + 20) it.x = -20;
    const hit = !it.done && Math.abs(it.x - player.x) < 10 + it.r * 0.6 && it.y + it.r * 0.6 > PLAYER_Y - 40 && it.y - it.r < PLAYER_Y + 22;
    if (hit && invulnerable === 0) {
      it.done = true;
      it.hit = true;
      lives -= 1;
      invulnerable = 1;
      if (navigator.vibrate) navigator.vibrate(60);
    } else if (!it.done && it.y - it.r > H) {
      it.done = true;
      score += 1;
    }
  }
  items = items.filter((it) => it.y - it.r < H + 30 && !it.hit);

  draw();
  if (lives <= 0 || elapsed >= GAME_SECONDS) return end();
  raf = requestAnimationFrame(step);
}

function start() {
  if (!view) return;
  state = 'playing';
  player = { x: W / 2 };
  items = [];
  elapsed = 0;
  lives = 3;
  score = 0;
  spawnTimer = 0.4;
  invulnerable = 0;
  dir = 0;
  targetX = null;
  $('dodgeOverlay').hidden = true;
  $('dodgeInfo').textContent = t('dodge.playing');
  canvas.focus();
  lastTime = performance.now();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(step);
}

function end() {
  state = 'over';
  cancelAnimationFrame(raf);
  const survived = lives > 0;
  const respect = Math.floor(score / 4) + (survived ? 10 : 0) + (survived && lives === 3 ? 10 : 0);
  const { progress, record } = recordDodge(score, respect);
  const lang = getLang();
  $('dodgeOverlayTitle').textContent = survived ? t('dodge.survived', { city: view.city }) : t(`dodge.lost.${hazardFor(view)}`, { city: view.city });
  $('dodgeBest').textContent = progress.bestDodge;
  $('dodgeOverlayText').textContent = t('dodge.result', { score, respect, best: progress.bestDodge }) + (record ? ` ${t('dodge.record')}` : '');
  $('dodgeStart').textContent = t('dodge.again');
  $('dodgeOverlay').hidden = false;
  $('dodgeInfo').textContent = $('dodgeOverlayText').textContent;
  $('dodgeMachine').dataset.lang = lang;
  draw();
}

/** True while a game is running (calls wait until it's over). */
export const isDodgePlaying = () => state === 'playing';

/** Stop a running game (e.g. when leaving the zone). */
export function pauseDodge() {
  if (state !== 'playing') return;
  cancelAnimationFrame(raf);
  state = 'idle';
  $('dodgeOverlayTitle').textContent = t('dodge.paused');
  $('dodgeOverlayText').textContent = '';
  $('dodgeStart').textContent = t('dodge.play');
  $('dodgeOverlay').hidden = false;
}

function pointerToX(e) {
  const r = canvas.getBoundingClientRect();
  return ((e.clientX - r.left) / r.width) * W;
}

/** Wire up the machine. Call once. */
export function initDodge() {
  canvas = $('dodgeCanvas');
  ctx = canvas.getContext('2d');
  skyline = new Path2D(SKYLINE);
  star = new Path2D(STAR);
  sizeCanvas();
  draw();
  $('dodgeStart').addEventListener('click', start);
  // finger / mouse: the character follows
  canvas.addEventListener('pointerdown', (e) => { if (state === 'playing') { targetX = pointerToX(e); canvas.setPointerCapture(e.pointerId); } });
  canvas.addEventListener('pointermove', (e) => { if (state === 'playing' && targetX !== null) targetX = pointerToX(e); });
  const release = () => { targetX = null; };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  // on-screen buttons (hold)
  const hold = (id, d) => {
    const b = $(id);
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); dir = d; targetX = null; });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, () => { if (dir === d) dir = 0; }));
  };
  hold('dodgeLeft', -1);
  hold('dodgeRight', 1);
  // keyboard
  window.addEventListener('keydown', (e) => {
    if (state !== 'playing') return;
    if (['ArrowLeft', 'a', 'A'].includes(e.key)) { dir = -1; targetX = null; e.preventDefault(); }
    if (['ArrowRight', 'd', 'D'].includes(e.key)) { dir = 1; targetX = null; e.preventDefault(); }
  });
  window.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'a', 'A'].includes(e.key) && dir === -1) dir = 0;
    if (['ArrowRight', 'd', 'D'].includes(e.key) && dir === 1) dir = 0;
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseDodge(); });
}

/** New weather: the game adapts to it. */
export function updateDodge(v) {
  view = v;
  const hazard = hazardFor(v);
  $('dodgeSub').textContent = t('dodge.sub', { city: v.city, hazard: t(`dodge.hazard.${hazard}`), level: v.level });
  $('dodgeBest').textContent = getProgress().bestDodge;
  canvas.setAttribute('aria-label', t('dodge.canvas', { hazard: t(`dodge.hazard.${hazard}`) }));
  if (state !== 'playing') draw();
}
