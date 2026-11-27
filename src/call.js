// call.js — the mission phone call. The phone "rings" on screen (no sound); the voice only plays
// after the user taps "Answer", using the browser's Speech Synthesis API. Subtitles are always shown.
import { t, getLang } from './i18n.js';
import { phoneIcon } from './icons.js';

let el = null;
let ringTimer = null;
let clockTimer = null;
let script = '';
let onMissed = () => {};

const $ = (sel) => el.querySelector(sel);
const speechAvailable = () => 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';

function build() {
  el = document.createElement('div');
  el.className = 'call';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-labelledby', 'callName');
  el.setAttribute('aria-describedby', 'callStatus');
  el.hidden = true;
  el.innerHTML = `
    <div class="call-top">
      <div class="call-avatar" aria-hidden="true">
        <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#2a1250"/>
          <path d="M14 64q2-20 18-20t18 20z" fill="#140a24"/><circle cx="32" cy="30" r="11" fill="#140a24"/>
          <ellipse cx="32" cy="21" rx="17" ry="3.5" fill="#140a24"/><path d="M22 21l2-10h16l2 10z" fill="#140a24"/><path d="M23 18h18" stroke="#ff2e8a" stroke-width="2.5"/>
          <path d="M23 29h7v3q-3.5 2-7 0zM34 29h7v3q-3.5 2-7 0z" fill="#16c7b7"/><path d="M22 29h20" stroke="#16c7b7" stroke-width="1.2"/></svg>
      </div>
      <div class="call-who">
        <p class="call-status" id="callStatus"></p>
        <p class="call-name" id="callName"></p>
      </div>
      <p class="call-clock" aria-hidden="true"></p>
    </div>
    <p class="call-subs" aria-live="polite"></p>
    <div class="call-actions">
      <button type="button" class="call-btn answer">${phoneIcon()}<span></span></button>
      <button type="button" class="call-btn decline">${phoneIcon()}<span></span></button>
      <button type="button" class="call-btn hangup" hidden>${phoneIcon()}<span></span></button>
    </div>`;
  document.body.appendChild(el);
  $('.answer').addEventListener('click', answer);
  $('.decline').addEventListener('click', () => close(true));
  $('.hangup').addEventListener('click', () => close(false));
}

function labels() {
  $('#callName').textContent = t('call.contact');
  $('.answer span').textContent = t('call.answer');
  $('.decline span').textContent = t('call.decline');
  $('.hangup span').textContent = t('call.hangup');
}

function setState(state) {
  el.dataset.state = state; // ringing | talking | ended
  $('.answer').hidden = state !== 'ringing';
  $('.decline').hidden = state !== 'ringing';
  $('.hangup').hidden = state !== 'talking';
  $('#callStatus').textContent = t(`call.${state}`);
}

function stopVoice() {
  if (speechAvailable()) window.speechSynthesis.cancel();
}

const signal = (detail) => document.dispatchEvent(new CustomEvent('ww:call', { detail }));

function close(missed) {
  clearTimeout(ringTimer);
  clearInterval(clockTimer);
  stopVoice();
  if (!el) return;
  if (el.dataset.state === 'talking' || el.dataset.state === 'ended') signal('end');
  el.hidden = true;
  if (missed) onMissed();
}

function startClock() {
  const started = Date.now();
  const clock = $('.call-clock');
  const tick = () => {
    const s = Math.floor((Date.now() - started) / 1000);
    clock.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };
  tick();
  clockTimer = setInterval(tick, 1000);
}

function answer() {
  clearTimeout(ringTimer);
  signal('start'); // the radio ducks while the call is on
  setState('talking');
  $('.call-subs').textContent = script;
  $('.hangup').focus();
  startClock();

  if (!speechAvailable()) {
    $('.call-subs').textContent = `${t('call.noVoice')} ${script}`;
    return;
  }
  const lang = getLang();
  const utter = new SpeechSynthesisUtterance(script);
  utter.lang = lang === 'en' ? 'en-GB' : 'es-ES';
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(lang)) ;
  if (voice) utter.voice = voice;
  utter.rate = 1.03;
  utter.pitch = 0.85;
  utter.onend = () => {
    clearInterval(clockTimer);
    setState('ended');
    ringTimer = setTimeout(() => close(false), 2500);
  };
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

/**
 * Show the call. "ring" waits for the user to answer; "now" answers straight away (user asked for it).
 * @param {{text: string, mode: 'ring'|'now', missed?: () => void}} options
 */
export function showCall({ text, mode, missed }) {
  if (!el) build();
  close(false);
  script = text;
  onMissed = missed || (() => {});
  labels();
  $('.call-subs').textContent = '';
  $('.call-clock').textContent = '';
  el.hidden = false;
  if (mode === 'now') {
    answer();
  } else {
    setState('ringing');
    ringTimer = setTimeout(() => close(true), 20000); // unanswered: missed call
  }
}

export const isCallOpen = () => !!el && !el.hidden;
export const hangUp = () => close(false);
