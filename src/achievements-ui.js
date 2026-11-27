// achievements-ui.js — listens to what happens in the app, unlocks achievements, shows the nickname
// and the trophy cabinet in the Fame zone, and lets Uncle Isobar call when your nickname goes up.
import { t, getLang } from './i18n.js';
import { local } from './storage.js';
import { ACHIEVEMENTS, evaluate, nickname, nextTier, tierFor, NICKNAMES, promotionCall } from './achievements.js';
import { getProgress, addRespect } from './progress.js';
import { weatherIcon, gearIcon, phoneIcon } from './icons.js';
import { showCall, isCallOpen } from './call.js';
import { isDodgePlaying } from './dodge.js';
import { isAlertOpen } from './dom.js';

const KEY = 'ww.achievements';
const $ = (id) => document.getElementById(id);
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2L14.9 8.6L22 9.3L16.6 14L18.2 21L12 17.3L5.8 21L7.4 14L2 9.3L9.1 8.6Z" fill="#ffc93c" stroke="#140a24" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const RADIO = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="8" width="20" height="13" rx="3" fill="#ff2e8a" stroke="#140a24" stroke-width="1.6"/><path d="M6 8L17 3" stroke="#140a24" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="14.5" r="3.2" fill="#140a24"/><path d="M14 12h5M14 15h5M14 18h3" stroke="#140a24" stroke-width="1.6" stroke-linecap="round"/></svg>';

const loadStore = () => ({ unlocked: {}, cities: [], pulls: 0, ...(local.get(KEY, {}) || {}) });
const saveStore = (s) => local.set(KEY, s);

function iconFor([type, name]) {
  if (type === 'weather') return weatherIcon(name);
  if (type === 'gear') return gearIcon(name);
  if (type === 'phone') return `<span class="badge-phone">${phoneIcon()}</span>`;
  if (type === 'radio') return RADIO;
  return STAR;
}

// ---------- Unlock toasts (one after another) ----------
const queue = [];
let showing = false;
function nextToast() {
  if (showing || !queue.length) return;
  showing = true;
  const a = queue.shift();
  const lang = getLang();
  const el = $('unlock');
  $('unlockIcon').innerHTML = iconFor(a.icon);
  $('unlockName').textContent = a.name[lang];
  $('unlockReward').textContent = a.reward ? t('fame.reward', { n: a.reward }) : '';
  el.hidden = false;
  el.classList.remove('leaving');
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => { el.hidden = true; showing = false; nextToast(); }, 350);
  }, 3400);
}

// ---------- Nickname promotion: Uncle Isobar calls ----------
function ringPromotion(nick) {
  const ring = () => {
    if (isCallOpen() || isAlertOpen() || isDodgePlaying()) { setTimeout(ring, 4000); return; }
    showCall({ text: promotionCall(nick, getLang()), mode: 'ring' });
  };
  setTimeout(ring, 1500);
}

function checkPromotion() {
  const p = getProgress();
  const tier = tierFor(p.respect);
  const known = local.get('ww.nickTier', null);
  if (known === null) { local.set('ww.nickTier', tier); return; }
  if (tier > known) {
    local.set('ww.nickTier', tier);
    ringPromotion(NICKNAMES[tier][getLang()]);
  }
}

// ---------- Rendering ----------
export function renderFame() {
  const lang = getLang();
  const p = getProgress();
  const store = loadStore();
  $('nickName').textContent = nickname(p.respect, p.streak, lang);
  $('profRespect').textContent = p.respect;
  $('profStreak').textContent = p.streak;
  $('profBest').textContent = p.bestDodge;
  const next = nextTier(p.respect);
  const cur = NICKNAMES[tierFor(p.respect)];
  $('nickBar').style.width = next ? `${Math.round(((p.respect - cur.min) / (next.min - cur.min)) * 100)}%` : '100%';
  $('nickNext').textContent = next ? t('fame.next', { n: next.min - p.respect, nick: next[lang] }) : t('fame.top');

  // The full ladder: ranks passed, where you are, and what's still ahead (with the crown at the top)
  const tier = tierFor(p.respect);
  $('ladder').replaceChildren(...NICKNAMES.map((n, i) => {
    const li = document.createElement('li');
    li.className = `rung ${i < tier ? 'done' : i === tier ? 'here' : 'ahead'}${i === NICKNAMES.length - 1 ? ' top' : ''}`;
    li.innerHTML = '<span class="rung-name"></span><span class="rung-need"></span>';
    li.querySelector('.rung-name').textContent = n[lang];
    li.querySelector('.rung-need').textContent = i === tier ? t('fame.here') : i < tier ? t('fame.done') : t('fame.need', { n: n.min });
    if (i === tier) li.setAttribute('aria-current', 'step');
    return li;
  }).reverse());

  const count = Object.keys(store.unlocked).length;
  $('badgeCount').textContent = `${count}/${ACHIEVEMENTS.length}`;
  // Unlocked first, newest first; then the ones still to get
  const ordered = [...ACHIEVEMENTS].sort((a, b) => (store.unlocked[b.id] ?? 0) - (store.unlocked[a.id] ?? 0));
  $('badges').replaceChildren(...ordered.map((a) => {
    const li = document.createElement('li');
    const when = store.unlocked[a.id];
    li.className = `badge ${when ? 'on' : 'off'}`;
    li.innerHTML = `<span class="badge-icon">${iconFor(a.icon)}</span><span class="badge-text"><strong></strong><small></small></span>`;
    li.querySelector('strong').textContent = a.name[lang];
    li.querySelector('small').textContent = when
      ? t('fame.unlockedOn', { date: new Date(when).toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', { day: 'numeric', month: 'short' }) })
      : a.hint[lang];
    li.setAttribute('aria-label', `${a.name[lang]}. ${when ? t('fame.unlocked') : t('fame.locked')}. ${a.hint[lang]}`);
    return li;
  }));
}

// ---------- Events ----------
function handle(event) {
  const store = loadStore();
  // Daily visit: a few respect points the first time you check the weather each day
  if (event.type === 'weather') {
    const today = new Date().toISOString().slice(0, 10);
    if (store.lastDaily !== today) {
      store.lastDaily = today;
      saveStore(store);
      addRespect(5);
      return handle(event);
    }
  }
  if (event.type === 'weather' && event.view?.id && !store.cities.includes(event.view.id)) store.cities = [...store.cities, event.view.id].slice(-50);
  if (event.type === 'excuse') store.pulls = (store.pulls || 0) + 1;
  const ids = evaluate(event, store, getProgress());
  ids.forEach((id) => { store.unlocked[id] = Date.now(); });
  saveStore(store);
  const fresh = ACHIEVEMENTS.filter((a) => ids.includes(a.id));
  fresh.forEach((a) => queue.push(a));
  const reward = fresh.reduce((sum, a) => sum + a.reward, 0);
  if (reward) addRespect(reward); // fires ww:progress, which re-checks respect-based achievements and the nickname
  nextToast();
  renderFame();
}

/** Wire up. Call once. */
export function initAchievements() {
  document.addEventListener('ww:track', (e) => handle(e.detail));
  document.addEventListener('ww:call', (e) => { if (e.detail === 'start') handle({ type: 'call' }); });
  document.addEventListener('ww:progress', () => {
    handle({ type: 'progress' });
    checkPromotion();
  });
  checkPromotion();
  renderFame();
}
