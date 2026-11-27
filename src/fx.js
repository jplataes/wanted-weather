// fx.js — "living screen": a light layer over the whole interface that follows the real weather.
// Rain drops slide down the glass, snow falls, fog drifts, gusts cross, lightning flashes,
// heat shimmers and frost creeps in from the corners. It never blocks clicks.
import { reducedMotion } from './dom.js';

const rand = (a, b) => a + Math.random() * (b - a);

function make(cls, styles) {
  const i = document.createElement('i');
  i.className = cls;
  Object.entries(styles).forEach(([k, v]) => i.style.setProperty(k, v));
  return i;
}

/** @param {'storm'|'rain'|'snow'|'fog'|'wind'|'heat'|'cold'|'none'} type */
export function setScreenFx(type) {
  const layer = document.getElementById('screenfx');
  if (!layer) return;
  document.body.dataset.fx = type;
  layer.replaceChildren();
  const still = reducedMotion();
  const add = (node) => layer.appendChild(node);

  if (type === 'rain' || type === 'storm') {
    const count = still ? 10 : type === 'storm' ? 26 : 18;
    for (let n = 0; n < count; n++) {
      const size = rand(6, 14);
      add(make('drop', { '--x': `${rand(0, 100)}vw`, '--y': `${rand(-10, 70)}vh`, '--s': `${size}px`, '--d': `${rand(3, 7)}s`, '--delay': `${rand(-7, 0)}s` }));
    }
    if (type === 'storm' && !still) add(make('lightning', {}));
  } else if (type === 'snow' && !still) {
    for (let n = 0; n < 36; n++) {
      add(make('flake', { '--x': `${rand(0, 100)}vw`, '--s': `${rand(3, 7)}px`, '--d': `${rand(7, 14)}s`, '--delay': `${rand(-14, 0)}s`, '--sway': `${rand(-30, 30)}px` }));
    }
  } else if (type === 'fog') {
    for (let n = 0; n < 3; n++) add(make('fogband', { '--y': `${20 + n * 28}vh`, '--d': `${rand(28, 44)}s`, '--delay': `${rand(-40, 0)}s` }));
  } else if (type === 'wind' && !still) {
    for (let n = 0; n < 7; n++) add(make('gust', { '--y': `${rand(5, 95)}vh`, '--w': `${rand(80, 220)}px`, '--d': `${rand(1.2, 2.4)}s`, '--delay': `${rand(-3, 0)}s` }));
    for (let n = 0; n < 4; n++) add(make('leaf', { '--y': `${rand(10, 90)}vh`, '--d': `${rand(3, 6)}s`, '--delay': `${rand(-6, 0)}s` }));
  } else if (type === 'heat') {
    add(make('heatwave', {}));
  } else if (type === 'cold') {
    add(make('frost', {}));
  }
}
