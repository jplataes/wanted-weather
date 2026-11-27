// icons.js — small original icons drawn in SVG: weather types (for upcoming missions) and gear.
const INK = '#140a24';

const CLOUD = 'M13 34h22a7 7 0 0 0 0-14 10 10 0 0 0-19-3 8.5 8.5 0 0 0-3 17z';

const WEATHER = {
  clear: `<circle cx="24" cy="24" r="9" fill="#ffc93c" stroke="${INK}" stroke-width="2.5"/>
    <g stroke="${INK}" stroke-width="2.5" stroke-linecap="round"><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.6 10.6l4.2 4.2M33.2 33.2l4.2 4.2M10.6 37.4l4.2-4.2M33.2 14.8l4.2-4.2"/></g>`,
  clouds: `<circle cx="32" cy="16" r="7" fill="#ffc93c" stroke="${INK}" stroke-width="2.2"/><path d="${CLOUD}" fill="#e2d8fb" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
  rain: `<path d="${CLOUD}" transform="translate(0 -6)" fill="#8fa0c8" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <g stroke="#16c7b7" stroke-width="3" stroke-linecap="round"><path d="M16 34l-2 6M25 34l-2 6M34 34l-2 6"/></g>`,
  storm: `<path d="${CLOUD}" transform="translate(0 -6)" fill="#4b4f7a" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M25 26l-6 10h5l-3 9 9-12h-5l3-7z" fill="#ffc93c" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`,
  snow: `<path d="${CLOUD}" transform="translate(0 -6)" fill="#eef3ff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <g fill="#bfe9ff" stroke="${INK}" stroke-width="1.5"><circle cx="16" cy="37" r="2.6"/><circle cx="25" cy="41" r="2.6"/><circle cx="34" cy="37" r="2.6"/></g>`,
  fog: `<g stroke="${INK}" stroke-width="3.2" stroke-linecap="round"><path d="M8 16h26M12 24h30M6 32h28M14 40h22"/></g>
    <g stroke="#c9b8e8" stroke-width="1.6" stroke-linecap="round"><path d="M8 16h26M12 24h30M6 32h28M14 40h22"/></g>`,
  wind: `<g fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"><path d="M6 18h22a5 5 0 1 0-5-5M6 26h32a5 5 0 1 1-5 5M10 34h14"/></g>`,
};

const GEAR = {
  umbrella: `<path d="M5 21Q20 1 35 21Z" fill="#ff2e8a"/><path d="M5 21Q20 1 35 21Q30 17 25 21Q20 17 15 21Q10 17 5 21Z" fill="#ff2e8a" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M20 21v12q0 3-3 3t-3-3" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`,
  boots: `<path d="M11 5h11v19h8q5 0 5 5v4H11z" fill="#16c7b7" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M11 29h24" stroke="${INK}" stroke-width="2"/>`,
  coat: `<path d="M13 6l7 5 7-5 7 6-3 6v17H9V18l-3-6z" fill="#6e2bc4" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M20 11v24" stroke="${INK}" stroke-width="2"/><circle cx="17" cy="20" r="1.3" fill="${INK}"/><circle cx="17" cy="27" r="1.3" fill="${INK}"/>`,
  scarf: `<path d="M7 11q13 7 26 0v6q-13 7-26 0z" fill="#ff2e8a" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M25 18v15h6V16" fill="#ff2e8a" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M26 33v3M30 33v3" stroke="${INK}" stroke-width="1.6"/>`,
  hoodie: `<path d="M14 9q6-7 12 0l8 4-3 6v16H9V19l-3-6z" fill="#ff7a1a" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M14 9q6 6 12 0M17 13v6M23 13v6M14 28h12" fill="none" stroke="${INK}" stroke-width="1.8"/>`,
  windbreaker: `<path d="M13 6l7 5 7-5 7 6-3 6v17H9V18l-3-6z" fill="#16c7b7" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M20 11v24" stroke="${INK}" stroke-width="2"/><path d="M1 22h6M2 27h5" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
  sunglasses: `<path d="M3 15h34" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M5 15h12v5q0 6-6 6t-6-6z M23 15h12v5q0 6-6 6t-6-6z" fill="#16c7b7" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M8 18l3 3M26 18l3 3" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`,
  sunscreen: `<rect x="12" y="11" width="16" height="25" rx="4" fill="#ff7a1a" stroke="${INK}" stroke-width="2.2"/><rect x="15" y="4" width="10" height="7" rx="1.5" fill="#fff3dc" stroke="${INK}" stroke-width="2"/><circle cx="20" cy="23" r="4" fill="#ffc93c" stroke="${INK}" stroke-width="1.6"/>`,
  cap: `<path d="M7 25q0-15 13-15t13 15z" fill="#ff2e8a" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M20 25h17q0 5-8 5h-9z" fill="#ff2e8a" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="20" cy="10" r="1.6" fill="${INK}"/>`,
  water: `<path d="M15 9h10v4q5 2 5 7v14q0 3-3 3H13q-3 0-3-3V20q0-5 5-7z" fill="#bfe9ff" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><rect x="14" y="3" width="12" height="6" rx="1.5" fill="#16c7b7" stroke="${INK}" stroke-width="2"/><path d="M10 24h20" stroke="${INK}" stroke-width="1.6"/>`,
  sofa: `<path d="M5 18q0-4 4-4h22q4 0 4 4v4H5z" fill="#6e2bc4" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M3 21q0-3 3-3t3 3v4h22v-4q0-3 3-3t3 3v9H3z" fill="#ff2e8a" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M7 30v4M33 30v4" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M14 25h12" stroke="${INK}" stroke-width="1.6"/>`,
  tshirt: `<path d="M8 12l7-5q5 4 10 0l7 5-3 7-3-2v17H14V17l-3 2z" fill="#ffc93c" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`,
};

export const weatherIcon = (kind) => `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">${WEATHER[kind] ?? WEATHER.clouds}</svg>`;
export const gearIcon = (id) => `<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">${GEAR[id] ?? ''}</svg>`;
export const phoneIcon = () => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor"/></svg>`;
