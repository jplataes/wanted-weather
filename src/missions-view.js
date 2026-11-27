// missions-view.js — draws the mission of the day (dossier and Street teaser), the upcoming missions
// and the missed-call badge. The mission logic itself lives in missions.js.
import { t } from './i18n.js';
import { weatherIcon, gearIcon } from './icons.js';
import { renderStars } from './dom.js';

const $ = (id) => document.getElementById(id);

/** The mission briefing card. */
export function renderMission(mission) {
  $('missionWhen').textContent = t(mission.when === 'today' ? 'missionToday' : 'missionTomorrow');
  $('missionTitle').textContent = mission.title;
  $('missionObjective').textContent = mission.objective;
  $('missionIntel').replaceChildren(...mission.intel.map((line) => {
    const li = document.createElement('li');
    li.textContent = line;
    return li;
  }));
  $('missionGear').replaceChildren(...mission.gear.map((item) => {
    const li = document.createElement('li');
    li.innerHTML = gearIcon(item.id);
    const span = document.createElement('span');
    span.textContent = item.label;
    li.appendChild(span);
    return li;
  }));
  $('missionTip').textContent = `«${mission.tip}»`;
  $('mission').dataset.theme = mission.theme;
  $('mission').hidden = false;

  // Short version for the Street zone
  $('teaserWhen').textContent = $('missionWhen').textContent;
  $('teaserTitle').textContent = mission.title;
  $('teaserGear').replaceChildren(...$('missionGear').cloneNode(true).children);
  $('teaser').hidden = false;
}

/** Show or hide the "missed call" badge on the call button. */
export function setMissedCall(missed) {
  document.querySelectorAll('.js-call').forEach((b) => b.classList.toggle('missed', missed));
  document.querySelectorAll('.js-call-label').forEach((l) => { l.textContent = t(missed ? 'missedCall' : 'callBtn'); });
  $('missedDot').hidden = !missed;
}

/** Upcoming days as mission cards. Pass null when the forecast is not available. */
export function renderUpcoming(cards) {
  const list = $('upcomingList');
  $('upcoming').hidden = false;
  if (!cards || !cards.length) {
    list.replaceChildren();
    $('upcomingNote').textContent = t('upcomingUnavailable');
    $('upcomingNote').hidden = false;
    return;
  }
  $('upcomingNote').hidden = true;
  list.replaceChildren(...cards.map((c) => {
    const li = document.createElement('li');
    li.className = 'up-card';
    li.dataset.theme = c.theme;
    const day = document.createElement('p');
    day.className = 'up-day';
    day.textContent = c.weekday;
    const icon = document.createElement('div');
    icon.className = 'up-icon';
    icon.innerHTML = weatherIcon(c.kind);
    const temps = document.createElement('p');
    temps.className = 'up-temps';
    temps.setAttribute('aria-label', t('maxMinAria', { max: c.max, min: c.min }));
    temps.innerHTML = `<span class="up-max"></span> <span class="up-min"></span>`;
    temps.querySelector('.up-max').textContent = `${c.max}°`;
    temps.querySelector('.up-min').textContent = `${c.min}°`;
    const desc = document.createElement('p');
    desc.className = 'up-desc';
    desc.textContent = c.pop >= 20 ? `${c.description} · ${t('rainShort', { pop: c.pop })}` : c.description;
    const stars = document.createElement('div');
    stars.className = 'wanted small';
    stars.setAttribute('role', 'img');
    renderStars(stars, c.level);
    const code = document.createElement('p');
    code.className = 'up-code';
    code.textContent = c.codename;
    li.append(day, icon, temps, desc, stars, code);
    return li;
  }));
}
