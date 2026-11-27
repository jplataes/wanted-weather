// excusometer.js — the Excuse-o-matic slot machine in the Arcade zone.
import { t, getLang } from './i18n.js';
import { weatherIcon, gearIcon } from './icons.js';
import { excusePool, makePicker } from './excuses.js';
import { toast, reducedMotion } from './dom.js';

const FILLERS = [
  () => weatherIcon('clear'), () => weatherIcon('rain'), () => weatherIcon('storm'), () => weatherIcon('snow'),
  () => weatherIcon('wind'), () => gearIcon('umbrella'), () => gearIcon('sunglasses'), () => gearIcon('scarf'),
  () => gearIcon('cap'), () => gearIcon('sofa'), () => weatherIcon('fog'), () => gearIcon('water'),
];
const CELLS = 14;

let context = null; // { view, mission }
let spinning = false;
const pick = makePicker();
const $ = (id) => document.getElementById(id);

function facts(view) {
  return { temp: view.temp, feels: view.feels, wind: view.windKmh, humidity: view.humidity, pop: context?.pop ?? null, time: view.localTime, city: view.city };
}

function fillReel(reel, finalIcon, seed) {
  const strip = reel.querySelector('.strip');
  const cells = [];
  for (let i = 0; i < CELLS - 1; i++) cells.push(FILLERS[(i * 5 + seed) % FILLERS.length]());
  cells.push(finalIcon);
  strip.innerHTML = cells.map((svg) => `<div class="cell">${svg}</div>`).join('');
  return strip;
}

function spin() {
  if (spinning || !context) return;
  spinning = true;
  const { view, mission } = context;
  const lang = getLang();
  const excuse = pick(excusePool(view, lang, facts(view)));
  const finals = [weatherIcon(view.kind), gearIcon(mission?.gear?.[0]?.id ?? 'umbrella'), gearIcon('sofa')];
  const machine = $('excMachine');
  const out = $('excOut');
  out.hidden = true;
  $('excActions').hidden = true;
  machine.classList.add('spinning');

  const reels = [...document.querySelectorAll('#excMachine .reel')];
  const still = reducedMotion();
  const durations = [900, 1300, 1700];
  reels.forEach((reel, i) => {
    const strip = fillReel(reel, finals[i], Math.floor(Math.random() * 12) + i * 3);
    strip.style.transition = 'none';
    strip.style.transform = 'translateY(0)';
    void strip.offsetHeight;
    const end = `translateY(calc(-${CELLS - 1} * var(--cell)))`;
    if (still) {
      strip.style.transform = end;
    } else {
      strip.style.transition = `transform ${durations[i]}ms cubic-bezier(.15, .6, .25, 1.05)`;
      strip.style.transform = end;
    }
  });

  setTimeout(() => {
    $('excText').textContent = excuse;
    out.hidden = false;
    $('excActions').hidden = false;
    machine.classList.remove('spinning');
    spinning = false;
  }, still ? 0 : durations[2] + 150);
}

async function copyExcuse() {
  const text = $('excText').textContent;
  try {
    await navigator.clipboard.writeText(text);
    toast(t('exc.copied'));
  } catch {
    toast(t('exc.copyFailed'));
  }
}

async function shareExcuse() {
  const text = `«${$('excText').textContent}» — ${t('exc.signature')}`;
  const url = `${window.location.origin}${window.location.pathname}`;
  if (navigator.share) {
    try {
      await navigator.share({ text, url });
    } catch {
      /* the user closed the share sheet: nothing to do */
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    toast(t('exc.copied'));
  } catch {
    toast(t('exc.copyFailed'));
  }
}

/** Wire up the machine. Call once. */
export function initExcusometer() {
  $('excPull').addEventListener('click', spin);
  $('excCopy').addEventListener('click', copyExcuse);
  $('excShare').addEventListener('click', shareExcuse);
  document.querySelectorAll('#excMachine .reel').forEach((reel, i) => {
    const strip = fillReel(reel, [weatherIcon('clear'), gearIcon('umbrella'), gearIcon('sofa')][i], i * 4);
    strip.style.transform = `translateY(calc(-${CELLS - 1} * var(--cell)))`;
  });
}

/** New weather data for the excuses. */
export function updateExcusometer(view, mission, pop) {
  context = { view, mission, pop };
}
