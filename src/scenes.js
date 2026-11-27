// scenes.js — illustrated scenes drawn in SVG. Shared pieces (skyline, palm, car, cloud, filters)
// live in a hidden <svg> in index.html and are reused here with <use>.
// Phase 1: sun, rain and night. Phase 2 adds clouds, storm, snow, fog and wind.

const sun = `
  <defs>
    <linearGradient id="skySun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff2e8a"/><stop offset=".55" stop-color="#ff7a1a"/><stop offset="1" stop-color="#ffc93c"/></linearGradient>
    <linearGradient id="sunFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3dc"/><stop offset=".6" stop-color="#ffc93c"/></linearGradient>
    <mask id="sunStripes">
      <rect width="400" height="260" fill="#fff"/>
      <rect y="142" width="400" height="3" fill="#000"/><rect y="154" width="400" height="4" fill="#000"/>
      <rect y="166" width="400" height="5" fill="#000"/><rect y="178" width="400" height="6" fill="#000"/>
      <rect y="191" width="400" height="7" fill="#000"/>
    </mask>
  </defs>
  <rect x="-20" y="-20" width="440" height="300" fill="url(#skySun)"/>
  <rect width="400" height="150" fill="url(#dots)" opacity=".14"/>
  <g class="px" data-depth="2">
    <circle class="sun-glow" cx="200" cy="140" r="88" fill="#fff3dc" opacity=".55"/>
    <g mask="url(#sunStripes)"><circle cx="200" cy="140" r="70" fill="url(#sunFill)" stroke="#140a24" stroke-width="5"/></g>
  </g>
  <g class="px" data-depth="5">
    <use href="#skyline" fill="#6e2bc4" stroke="#140a24" stroke-width="4" stroke-linejoin="round"/>
    <rect width="400" height="232" fill="url(#winDay)" clip-path="url(#skyClip)" opacity=".7"/>
  </g>
  <rect x="-20" y="228" width="440" height="40" fill="#2a1250" stroke="#140a24" stroke-width="4"/>
  <path d="M-20 245H420" stroke="#ffc93c" stroke-width="3" stroke-dasharray="18 14"/>
  <g class="px" data-depth="9">
    <g class="sway" style="--trunk:#8a4b2a; --frond:#0e7a66"><use href="#palm" transform="translate(46 232)"/></g>
    <g class="sway slow" style="--trunk:#8a4b2a; --frond:#12a08a"><use href="#palm" transform="translate(352 232) scale(-.85 .85)"/></g>
    <use href="#car" transform="translate(236 212)" fill="#ff2e8a"/>
    <g filter="url(#rimCream)" transform="translate(219 254) rotate(7) scale(1.15)">
      <g fill="#140a24">
        <path d="M9 -32 L8 -3" stroke="#140a24" stroke-width="7" stroke-linecap="round"/>
        <path d="M3 -32 L15 -4" stroke="#140a24" stroke-width="7" stroke-linecap="round"/>
        <ellipse cx="5" cy="-2" rx="6" ry="3"/><ellipse cx="17" cy="-2" rx="6" ry="3"/>
        <path d="M-1 -31 H14 L17 -58 H-2 Z"/>
        <path d="M-2 -57 L-5 -45" stroke="#140a24" stroke-width="6" stroke-linecap="round"/>
        <path d="M17 -57 L20 -45" stroke="#140a24" stroke-width="6" stroke-linecap="round"/>
        <rect x="-6" y="-50" width="28" height="8" rx="4"/>
        <rect x="5" y="-64" width="6" height="7"/>
        <g class="nod">
          <ellipse cx="8" cy="-70" rx="7" ry="8"/>
          <path d="M0 -72 Q0 -86 17 -81 Q12 -79 15 -75 Q8 -78 0 -72Z"/>
        </g>
      </g>
    </g>
    <g transform="translate(219 254) rotate(7) scale(1.15)">
      <path d="M0 -72 H7 V-69 Q3 -66.5 0 -69 Z M8 -72 H14 V-69 Q11 -66.5 8 -69 Z" fill="#16c7b7" stroke="#140a24" stroke-width=".8"/>
      <path class="glint" d="M1.5 -71 L4 -71" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>
    </g>
  </g>`;

const rain = `
  <defs>
    <linearGradient id="skyRain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2846"/><stop offset=".6" stop-color="#3b4a6b"/><stop offset="1" stop-color="#5a3d7a"/></linearGradient>
    <pattern id="rainA" width="36" height="48" patternUnits="userSpaceOnUse">
      <path d="M10 0L6 16M28 24L24 40" stroke="#bfe9ff" stroke-width="2.2" stroke-linecap="round" opacity=".75"/>
      <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="0 48" dur=".55s" repeatCount="indefinite"/>
    </pattern>
    <pattern id="rainB" width="22" height="30" patternUnits="userSpaceOnUse">
      <path d="M6 0L4 9" stroke="#bfe9ff" stroke-width="1.4" stroke-linecap="round" opacity=".5"/>
      <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="0 30" dur=".8s" repeatCount="indefinite"/>
    </pattern>
  </defs>
  <rect x="-20" y="-20" width="440" height="300" fill="url(#skyRain)"/>
  <rect width="400" height="180" fill="url(#dotsLight)" opacity=".06"/>
  <g class="px" data-depth="4">
    <use href="#skyline" fill="#1e1638" stroke="#140a24" stroke-width="4" stroke-linejoin="round"/>
    <rect width="400" height="232" fill="url(#winWarm)" clip-path="url(#skyClip)" opacity=".8"/>
  </g>
  <g class="px" data-depth="2">
    <g style="--cloud:#55648c"><use href="#cloud" transform="translate(-24 2) scale(1.3)"/></g>
    <g style="--cloud:#465479"><use href="#cloud" transform="translate(150 -12) scale(1.45)"/></g>
    <g style="--cloud:#55648c"><use href="#cloud" transform="translate(290 10) scale(1.1)"/></g>
  </g>
  <rect width="400" height="232" fill="url(#rainB)"/>
  <rect x="-20" y="228" width="440" height="40" fill="#1a1230" stroke="#140a24" stroke-width="4"/>
  <path d="M-20 245H420" stroke="#ffc93c" stroke-width="3" stroke-dasharray="18 14" opacity=".6"/>
  <g fill="none" stroke="#bfe9ff" stroke-width="2" opacity=".6">
    <ellipse cx="80" cy="252" rx="18" ry="3"/><ellipse cx="300" cy="250" rx="24" ry="3.5"/><ellipse cx="190" cy="254" rx="12" ry="2"/>
  </g>
  <g class="px" data-depth="9">
    <g class="drive">
      <path d="M110 222L190 210V240Z" fill="#ffc93c" opacity=".35"/>
      <use href="#car" transform="translate(0 210)" fill="#16c7b7"/>
    </g>
    <g class="run">
      <g transform="translate(0 258) scale(1.35)">
        <g class="bob">
          <g filter="url(#rimCream)" fill="#140a24" stroke="#140a24" stroke-linecap="round" stroke-linejoin="round">
            <g class="legA" fill="none" stroke-width="6"><path d="M0 -28 L-7 -15 L-17 -9"/><path d="M3 -28 L12 -17 L18 -3"/></g>
            <g class="legB" fill="none" stroke-width="6"><path d="M0 -28 L-2 -14 L1 -1"/><path d="M3 -28 L10 -18 L2 -11"/></g>
            <path d="M-4 -27 L6 -30 L16 -50 L5 -54 Z" stroke-width="2"/>
            <circle cx="16" cy="-59" r="6.5" stroke-width="0"/>
            <path d="M8 -50 L4 -64 M14 -50 L20 -64" fill="none" stroke-width="4.5"/>
          </g>
          <g transform="rotate(-7 10 -68)">
            <rect x="-7" y="-72" width="34" height="8" fill="#fff3dc" stroke="#140a24" stroke-width="1.8"/>
            <path d="M-4 -69.5 H9 M12 -69.5 H24 M-4 -66.5 H24" stroke="#140a24" stroke-width="1"/>
          </g>
          <path class="blink" d="M-2 -78 L-5 -84 M8 -80 L8 -87 M20 -79 L23 -85" stroke="#bfe9ff" stroke-width="1.6" stroke-linecap="round"/>
        </g>
      </g>
    </g>
  </g>
  <rect width="400" height="260" fill="url(#rainA)" pointer-events="none"/>`;

const night = `
  <defs>
    <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0620"/><stop offset=".55" stop-color="#2a1250"/><stop offset="1" stop-color="#6e2bc4"/></linearGradient>
    <mask id="moonCut"><rect width="400" height="260" fill="#fff"/><circle cx="328" cy="48" r="32" fill="#000"/></mask>
  </defs>
  <rect x="-20" y="-20" width="440" height="300" fill="url(#skyNight)"/>
  <rect width="400" height="260" fill="url(#dotsLight)" opacity=".05"/>
  <g class="px" data-depth="2">
    <g fill="#fff3dc">
      <use class="twinkle" href="#star5" transform="translate(30 24) scale(.5)"/>
      <use class="twinkle" href="#star5" transform="translate(96 54) scale(.35)"/>
      <use class="twinkle" href="#star5" transform="translate(150 18) scale(.45)"/>
      <use class="twinkle" href="#star5" transform="translate(212 60) scale(.3)"/>
      <use class="twinkle" href="#star5" transform="translate(248 26) scale(.4)"/>
      <use class="twinkle" href="#star5" transform="translate(60 90) scale(.3)"/>
      <use class="twinkle" href="#star5" transform="translate(370 96) scale(.35)"/>
    </g>
    <g mask="url(#moonCut)">
      <circle cx="310" cy="58" r="34" fill="#fff3dc" stroke="#140a24" stroke-width="4"/>
      <circle cx="310" cy="58" r="34" fill="url(#dots)" opacity=".12"/>
    </g>
  </g>
  <g class="px" data-depth="4">
    <use href="#skyline" fill="#160c2c" stroke="#ff2e8a" stroke-width="2" stroke-linejoin="round"/>
    <rect width="400" height="232" fill="url(#winNeon)" clip-path="url(#skyClip)" opacity=".85"/>
    <circle class="blink" cx="173" cy="80" r="4" fill="#ff2e8a"/>
    <path d="M173 84V96" stroke="#140a24" stroke-width="3"/>
  </g>
  <rect x="-20" y="228" width="440" height="40" fill="#0d0620" stroke="#140a24" stroke-width="4"/>
  <path d="M-20 245H420" stroke="#ff2e8a" stroke-width="3" stroke-dasharray="18 14" opacity=".7"/>
  <g class="px" data-depth="7">
    <rect x="238" y="178" width="96" height="50" fill="#1e1240" stroke="#140a24" stroke-width="3"/>
    <rect x="246" y="194" width="36" height="28" fill="#ffe9a8" stroke="#140a24" stroke-width="2.5"/>
    <path d="M246 203H282M246 213H282" stroke="#c98a2b" stroke-width="2"/>
    <rect x="292" y="190" width="24" height="38" fill="#fff3dc" stroke="#140a24" stroke-width="2.5"/>
    <path d="M286 228H322L338 262H270Z" fill="#ffc93c" opacity=".22"/>
    <g class="neon">
      <rect x="258" y="156" width="52" height="20" rx="3" fill="#140a24" stroke="#16c7b7" stroke-width="2.5"/>
      <text x="284" y="172" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="15" fill="#16c7b7">24H</text>
    </g>
    <g class="walk">
      <g transform="translate(302 245) scale(1.3)">
        <g class="bob" style="animation-duration:.5s">
          <g filter="url(#rimNeon)" fill="#140a24" stroke="#140a24" stroke-linecap="round" stroke-linejoin="round">
            <g class="legA slowlegs" fill="none" stroke-width="6"><path d="M-1 -26 L-6 -1"/><path d="M3 -26 L8 -1"/></g>
            <g class="legB slowlegs" fill="none" stroke-width="6"><path d="M-1 -26 L1 -1"/><path d="M3 -26 L2 -1"/></g>
            <path d="M-7 -26 H8 L9 -48 Q1 -55 -8 -48 Z" stroke-width="2"/>
            <circle cx="1" cy="-57" r="8.5" stroke-width="0"/>
            <path d="M-6 -46 L-9 -32" fill="none" stroke-width="5"/>
            <path d="M7 -46 L14 -40 L14 -49" fill="none" stroke-width="4.5"/>
          </g>
          <rect x="-15" y="-35" width="11" height="13" rx="1" fill="#e2b87a" stroke="#140a24" stroke-width="1.6"/>
          <path d="M11 -56 H18 L17 -48 H12 Z" fill="#fff3dc" stroke="#140a24" stroke-width="1.4"/>
          <path class="steam" d="M13 -59 q-2 -3 0 -6 t0 -6 M16.5 -59 q-2 -3 0 -6" fill="none" stroke="#fff3dc" stroke-width="1.3" stroke-linecap="round"/>
        </g>
      </g>
    </g>
  </g>
  <g class="px" data-depth="10">
    <g class="sway" style="--trunk:#140a24; --frond:#140a24"><use href="#palm" transform="translate(40 232)"/></g>
    <g class="sway slow" style="--trunk:#140a24; --frond:#140a24"><use href="#palm" transform="translate(380 232) scale(-.9 .9)"/></g>
    <use href="#car" transform="translate(110 212)" fill="#6e2bc4"/>
    <rect x="110" y="222" width="6" height="5" fill="#ff2e8a"/>
  </g>`;

const SCENES = { sun, rain, night };

/** Full SVG markup for a scene, with an accessible description. */
export function sceneSvg(name, label) {
  const body = SCENES[name] ?? SCENES.sun;
  const safe = String(label).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  return `<svg viewBox="0 0 400 260" role="img" aria-label="${safe}" preserveAspectRatio="xMidYMid slice">${body}</svg>`;
}
