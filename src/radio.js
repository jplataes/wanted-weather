// radio.js — the car radio. Music is generated live in the browser with the Web Audio API
// (no audio files), and the hosts read real forecast lines with Speech Synthesis.
// It never starts by itself: only the power button turns it on.
import { t, getLang } from './i18n.js';
import { local } from './storage.js';
import { STATIONS, STATION_IDS, stationFor, djLine } from './radio-lines.js';

const midi = (m) => 440 * 2 ** ((m - 69) / 12);

// Four bars of chords per station (MIDI notes) and the groove style
const SONGS = {
  neon: { bpm: 96, swing: 0, style: 'synth', chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]] },
  sol: { bpm: 108, swing: 0, style: 'funk', chords: [[52, 55, 59, 62], [52, 55, 59, 62], [57, 61, 64, 67], [57, 61, 64, 67]] },
  chaparron: { bpm: 74, swing: 0.22, style: 'lofi', chords: [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]] },
  tormenta: { bpm: 128, swing: 0, style: 'dark', chords: [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]] },
};

const state = {
  on: false,
  station: 'neon',
  recommended: 'neon',
  volume: Math.min(1, Math.max(0, Number(local.get('ww.radio.volume', 0.7)))),
  muted: false,
  facts: null,
  lineIndex: Math.floor(Math.random() * 5),
  ducked: false,
  paused: false, // true while Uncle Isobar is on the phone
  manual: false, // true once the listener changes station by hand
  // Hidden as a small bubble by default on phones (most people won't want it), shown on desktop
  collapsed: local.get('ww.radio.collapsed', window.matchMedia('(max-width: 899px)').matches) === true,
};

let ctx, master, music, delayIn, noiseBuf, crackle;
let step = 0;
let nextTime = 0;
let timer = null;
let djTimer = null;
const $ = (id) => document.getElementById(id);

// ---------- Audio engine ----------
function initAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain();
  master.connect(ctx.destination);
  music = ctx.createGain();
  music.connect(master);
  // Echo for leads
  delayIn = ctx.createGain();
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.28;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.32;
  const wet = ctx.createGain();
  wet.gain.value = 0.3;
  delayIn.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(music);
  // One second of white noise for drums and vinyl crackle
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  applyVolume();
  return true;
}

function envelope(gain, time, attack, peak, decay) {
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(peak, time + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + attack + decay);
}

function tone(time, type, freq, dur, vol, { attack = 0.005, cutoff = null, echo = false, detune = 0 } = {}) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  const gain = ctx.createGain();
  let node = osc;
  if (cutoff) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    osc.connect(filter);
    node = filter;
  }
  node.connect(gain);
  envelope(gain, time, attack, vol, dur);
  gain.connect(music);
  if (echo) gain.connect(delayIn);
  osc.start(time);
  osc.stop(time + attack + dur + 0.05);
}

function noise(time, dur, vol, type, freq, q = 1) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const gain = ctx.createGain();
  envelope(gain, time, 0.001, vol, dur);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(music);
  src.start(time);
  src.stop(time + dur + 0.05);
}

function kick(time, vol = 0.9) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
  envelope(gain, time, 0.002, vol, 0.28);
  osc.connect(gain);
  gain.connect(music);
  osc.start(time);
  osc.stop(time + 0.35);
}
const hat = (time, vol = 0.12, open = false) => noise(time, open ? 0.18 : 0.04, vol, 'highpass', 7000);
const snare = (time, vol = 0.35) => { noise(time, 0.18, vol, 'bandpass', 1800, 0.7); tone(time, 'triangle', 185, 0.08, vol * 0.5); };

function pad(time, chord, dur, vol, cutoff, type = 'sawtooth') {
  chord.forEach((n) => {
    tone(time, type, midi(n), dur, vol, { attack: 0.3, cutoff, detune: -7 });
    tone(time, type, midi(n), dur, vol, { attack: 0.3, cutoff, detune: 7 });
  });
}

/** Schedule one 16th-note step of the current station's groove. */
function playStep(index, time) {
  const song = SONGS[state.station];
  const s16 = 60 / song.bpm / 4;
  const bar = Math.floor(index / 16);
  const s = index % 16;
  const chord = song.chords[bar % song.chords.length];
  const root = chord[0];
  const t0 = time + (s % 2 === 1 ? song.swing * s16 : 0);

  if (song.style === 'synth') {
    if (s % 4 === 0) kick(t0, 0.8);
    if (s === 4 || s === 12) snare(t0, 0.3);
    if (s % 2 === 0) hat(t0, 0.06, s === 14);
    if (s % 2 === 0) tone(t0, 'sawtooth', midi(root - 24), s16 * 1.6, 0.16, { cutoff: 520 });
    const arp = [...chord, chord[0] + 12];
    tone(t0, 'square', midi(arp[s % arp.length] + 12), s16 * 0.8, 0.035, { cutoff: 2600, echo: true });
    if (s === 0) pad(t0, chord, s16 * 15, 0.02, 1400);
  } else if (song.style === 'funk') {
    if ([0, 3, 7, 10].includes(s)) kick(t0, 0.85);
    if (s === 4 || s === 12) snare(t0, 0.32);
    if (s === 14) snare(t0, 0.08);
    hat(t0, s % 2 ? 0.05 : 0.09, s === 6);
    if ([0, 3, 6, 8, 10, 11, 14].includes(s)) {
      const up = s === 6 || s === 11 ? 12 : 0;
      tone(t0, 'square', midi(root - 24 + up), 0.12, 0.13, { cutoff: 900 });
    }
    if ([2, 6, 10, 15].includes(s)) chord.forEach((n) => tone(t0, 'square', midi(n + 12), 0.06, 0.018, { cutoff: 2200 }));
  } else if (song.style === 'lofi') {
    if (s === 0 || s === 10) kick(t0, 0.55);
    if (s === 4 || s === 12) noise(t0, 0.07, 0.14, 'bandpass', 2600, 2);
    if (s % 2 === 0) hat(t0, 0.035);
    if (s === 0) chord.forEach((n) => tone(t0, 'triangle', midi(n), s16 * 13, 0.045, { attack: 0.02, cutoff: 1200 }));
    if (s === 8) chord.forEach((n) => tone(t0, 'triangle', midi(n), s16 * 6, 0.025, { attack: 0.02, cutoff: 1000 }));
    if (s === 0 || s === 7) tone(t0, 'sine', midi(root - 24), 0.45, 0.22);
    if ((s === 6 || s === 14) && Math.random() > 0.35) tone(t0, 'sine', midi(chord[Math.floor(Math.random() * chord.length)] + 12), 0.35, 0.03, { echo: true });
  } else {
    if (s % 4 === 0) kick(t0, 1);
    if (s === 4 || s === 12) snare(t0, 0.38);
    hat(t0, 0.05);
    tone(t0, 'sawtooth', midi(root - 24), 0.09, 0.13, { cutoff: 380 });
    if ([0, 3, 6, 10].includes(s)) {
      const riff = [0, 3, 7, 10, 12];
      tone(t0, 'square', midi(root + 12 + riff[(bar + s) % riff.length]), 0.16, 0.03, { cutoff: 1600, echo: true });
    }
    if (s === 0) pad(t0, chord, s16 * 15, 0.018, 900);
  }
}

function schedule() {
  const s16 = 60 / SONGS[state.station].bpm / 4;
  while (nextTime < ctx.currentTime + 0.12) {
    playStep(step, nextTime);
    nextTime += s16;
    step++;
  }
}

function startCrackle() {
  stopCrackle();
  if (SONGS[state.station].style !== 'lofi') return;
  crackle = ctx.createBufferSource();
  crackle.buffer = noiseBuf;
  crackle.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 3200;
  filter.Q.value = 0.6;
  const gain = ctx.createGain();
  gain.gain.value = 0.012;
  crackle.connect(filter);
  filter.connect(gain);
  gain.connect(music);
  crackle.start();
}
function stopCrackle() {
  if (crackle) { try { crackle.stop(); } catch { /* already stopped */ } crackle = null; }
}

function applyVolume() {
  if (!ctx) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setTargetAtTime(state.muted ? 0 : state.volume * 0.8, now, 0.05);
  music.gain.cancelScheduledValues(now);
  music.gain.setTargetAtTime(state.ducked ? 0.25 : 1, now, 0.15);
}

// ---------- Hosts (Speech Synthesis) ----------
const canSpeak = () => 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';

// Short gaps: nobody stays long on a weather site, so the hosts keep talking
const GAP_MIN = 2000;
const GAP_MAX = 3000;
let speechToken = 0; // bumps on every stop, so a cancelled line never schedules the next one

function speakLine() {
  clearTimeout(djTimer);
  if (!state.on || !state.facts || state.paused) return;
  const lang = getLang();
  const line = djLine(state.station, state.lineIndex++, state.facts, lang);
  showTicker(line);
  const token = ++speechToken;
  const next = (delay) => {
    if (token !== speechToken) return;
    djTimer = setTimeout(speakLine, delay ?? GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN));
  };
  if (!canSpeak() || state.muted) {
    // No voice: give people time to read the scrolling line, then the next one
    next(Math.max(7000, line.length * 70));
    return;
  }
  const utter = new SpeechSynthesisUtterance(line);
  utter.lang = lang === 'en' ? 'en-GB' : 'es-ES';
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith(lang));
  if (voice) utter.voice = voice;
  utter.volume = Math.min(1, state.volume + 0.2);
  utter.rate = 1.05;
  utter.onstart = () => { if (token === speechToken) { state.ducked = true; applyVolume(); } };
  const done = () => {
    if (token !== speechToken) return;
    state.ducked = false;
    applyVolume();
    next();
  };
  utter.onend = done;
  utter.onerror = done;
  window.speechSynthesis.speak(utter);
}

function stopSpeech() {
  speechToken++;
  clearTimeout(djTimer);
  if (canSpeak()) window.speechSynthesis.cancel();
  state.ducked = false;
}

// ---------- Display ----------
/** Show the host's whole line as a subtitle above the radio (the small display only shows who's on air). */
function showTicker(text) {
  $('radioCaption').textContent = text;
}

function renderDisplay() {
  const lang = getLang();
  const st = STATIONS[state.station];
  if (state.on) {
    $('radioStation').innerHTML = '<span class="radio-freq"></span><span class="radio-name"></span>';
    $('radioStation').querySelector('.radio-freq').textContent = `${st.freq} · `;
    $('radioStation').querySelector('.radio-name').textContent = st.name[lang];
  } else {
    $('radioStation').textContent = t('radio.off');
  }
  $('radioGenre').textContent = state.on ? `${st.genre} · ${st.host[lang]}${state.station === state.recommended ? ` · ${t('radio.recommended')}` : ''}` : t('radio.hint');
  $('radioTicker').textContent = state.on ? `${t('radio.onAir')} ${st.host[lang]} · ${st.slogan[lang]}` : '';
  if (!state.on) $('radioCaption').textContent = '';
  const radio = $('radio');
  radio.dataset.on = String(state.on);
  radio.dataset.station = state.station;
  radio.dataset.paused = String(state.paused);
  $('radioPower').setAttribute('aria-pressed', String(state.on));
  $('radioMute').setAttribute('aria-pressed', String(state.muted));
  $('radioPrev').disabled = !state.on;
  $('radioNext').disabled = !state.on;
}

// ---------- Controls ----------
function powerOn() {
  if (!ctx && !initAudio()) {
    $('radioTicker').textContent = t('radio.unsupported');
    return;
  }
  ctx.resume();
  state.on = true;
  state.station = state.recommended;
  state.manual = false;
  state.lineIndex = 3 * Math.floor(Math.random() * 3); // start with the weather
  step = 0;
  nextTime = ctx.currentTime + 0.1;
  timer = setInterval(schedule, 25);
  startCrackle();
  applyVolume();
  $('radioTicker').textContent = '';
  renderDisplay();
  djTimer = setTimeout(speakLine, 1200);
}

function powerOff() {
  state.on = false;
  state.paused = false;
  clearInterval(timer);
  stopCrackle();
  stopSpeech();
  if (ctx) ctx.suspend();
  renderDisplay();
}

function tune(delta, { manual = true } = {}) {
  if (!state.on) return;
  if (manual) state.manual = true;
  const i = STATION_IDS.indexOf(state.station);
  state.station = STATION_IDS[(i + delta + STATION_IDS.length) % STATION_IDS.length];
  stopSpeech();
  startCrackle();
  state.lineIndex = Math.ceil(state.lineIndex / 3) * 3; // new station opens with the weather
  step = 0;
  $('radioCaption').textContent = '';
  renderDisplay();
  djTimer = setTimeout(speakLine, 1200);
}

// ---------- Hide / show ----------
function setCollapsed(collapsed, { remember = true, focus = false } = {}) {
  state.collapsed = collapsed;
  $('radio').dataset.collapsed = String(collapsed);
  document.body.classList.toggle('radio-collapsed', collapsed);
  if (remember) local.set('ww.radio.collapsed', collapsed);
  if (focus) (collapsed ? $('radioBubble') : $('radioHide')).focus();
}

/** Swipe the bar down or sideways to hide it (phones). Sliders and buttons keep working normally. */
function bindSwipe() {
  const radio = $('radio');
  let start = null;
  radio.addEventListener('pointerdown', (e) => {
    if (state.collapsed || e.pointerType === 'mouse' || e.target.closest('input')) return;
    start = { x: e.clientX, y: e.clientY };
  });
  radio.addEventListener('pointermove', (e) => {
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    radio.style.transform = dy > Math.abs(dx) ? `translateY(${Math.max(0, dy)}px)` : `translateX(${dx}px)`;
  });
  const end = (e) => {
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start = null;
    radio.style.transform = '';
    if (dy > 35 || Math.abs(dx) > 70) {
      setCollapsed(true);
      // stop the tap that started the swipe from also pressing a button
      const swallow = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
      radio.addEventListener('click', swallow, { capture: true });
      setTimeout(() => radio.removeEventListener('click', swallow, { capture: true }), 350);
    }
  };
  radio.addEventListener('pointerup', end);
  radio.addEventListener('pointercancel', () => { start = null; radio.style.transform = ''; });
}

/** Wire up the radio controls. Call once. */
export function initRadio() {
  setCollapsed(state.collapsed, { remember: false });
  $('radioHide').addEventListener('click', () => setCollapsed(true, { focus: true }));
  $('radioBubble').addEventListener('click', () => setCollapsed(false, { focus: true }));
  bindSwipe();
  $('radioPower').addEventListener('click', () => (state.on ? powerOff() : powerOn()));
  $('radioPrev').addEventListener('click', () => tune(-1));
  $('radioNext').addEventListener('click', () => tune(1));
  $('radioMute').addEventListener('click', () => {
    state.muted = !state.muted;
    // Muted: the host goes quiet but the lines keep scrolling on the display
    if (state.muted && canSpeak()) window.speechSynthesis.cancel();
    applyVolume();
    renderDisplay();
  });
  const vol = $('radioVol');
  vol.value = String(Math.round(state.volume * 100));
  vol.addEventListener('input', () => {
    state.volume = Number(vol.value) / 100;
    local.set('ww.radio.volume', state.volume);
    applyVolume();
  });
  // The mission phone call takes priority: the radio ducks and the host waits
  document.addEventListener('ww:call', (e) => {
    // The mission call pauses the radio completely; it carries on when the call ends
    if (e.detail === 'start' && state.on && !state.paused) {
      state.paused = true;
      stopSpeech();
      ctx?.suspend();
      renderDisplay();
      showTicker(t('radio.paused'));
    } else if (e.detail === 'end' && state.paused) {
      state.paused = false;
      if (state.on) {
        ctx?.resume();
        djTimer = setTimeout(speakLine, 2000);
      }
      renderDisplay();
    }
  });
  renderDisplay();
}

/** New weather data: update facts and the recommended station. */
export function updateRadio(view, mission) {
  state.facts = {
    city: view.city,
    temp: view.temp,
    feels: view.feels,
    desc: view.description.toLowerCase(),
    wind: view.windKmh,
    humidity: view.humidity,
    time: view.localTime,
    sunset: view.sunset,
    mission: mission ? mission.title : '',
  };
  state.recommended = stationFor(view);
  // Playing and the listener hasn't picked a station by hand: follow the new city's weather
  if (state.on && !state.manual && !state.paused && state.station !== state.recommended) {
    const delta = STATION_IDS.indexOf(state.recommended) - STATION_IDS.indexOf(state.station);
    tune(delta, { manual: false });
    return;
  }
  renderDisplay();
}

/** Re-render labels after a language change. */
export function refreshRadioTexts() {
  if (state.on) $('radioCaption').textContent = '';
  renderDisplay();
}

export const radioState = () => ({ ...state });
