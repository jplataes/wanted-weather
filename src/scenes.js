// scenes.js — illustrated scenes drawn in SVG. Shared pieces (skyline, palm, car, cloud, filters)
// live in a hidden <svg> in index.html and are reused here with <use>.
// Eight scenes: sun, clouds, rain, storm, snow, fog, wind and night. Daytime scenes get darker at night.

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

const clouds = `
  <defs>
    <linearGradient id="skyClouds" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a7fd8"/><stop offset=".6" stop-color="#c3a6e6"/><stop offset="1" stop-color="#ffb38a"/></linearGradient>
  </defs>
  <rect x="-20" y="-20" width="440" height="300" fill="url(#skyClouds)"/>
  <rect width="400" height="160" fill="url(#dotsLight)" opacity=".08"/>
  <g class="px" data-depth="2">
    <circle cx="300" cy="86" r="38" fill="#ffc93c" stroke="#140a24" stroke-width="4"/>
    <g class="drift"><g style="--cloud:#f3ecff"><use href="#cloud" transform="translate(236 46) scale(1.15)"/></g></g>
    <g class="drift slow"><g style="--cloud:#e2d8fb"><use href="#cloud" transform="translate(-20 14) scale(1.1)"/></g></g>
    <g class="drift"><g style="--cloud:#d7cbf7"><use href="#cloud" transform="translate(110 64) scale(.85)"/></g></g>
  </g>
  <g class="px" data-depth="5">
    <use href="#skyline" fill="#5b3fa8" stroke="#140a24" stroke-width="4" stroke-linejoin="round"/>
    <rect width="400" height="232" fill="url(#winDay)" clip-path="url(#skyClip)" opacity=".7"/>
  </g>
  <rect x="-20" y="228" width="440" height="40" fill="#2a1250" stroke="#140a24" stroke-width="4"/>
  <path d="M-20 245H420" stroke="#ffc93c" stroke-width="3" stroke-dasharray="18 14"/>
  <g class="px" data-depth="9">
    <g class="sway" style="--trunk:#8a4b2a; --frond:#0e7a66"><use href="#palm" transform="translate(30 232) scale(.95)"/></g>
    <use href="#car" transform="translate(262 212)" fill="#16c7b7"/>
    <path d="M372 232V150Q372 140 362 140H352" fill="none" stroke="#140a24" stroke-width="6" stroke-linecap="round"/>
    <rect x="340" y="137" width="16" height="8" rx="2" fill="#ffc93c" stroke="#140a24" stroke-width="2"/>
    <g class="walk2">
      <g transform="translate(78 252) scale(1.25)">
        <g filter="url(#rimCream)" fill="#140a24" stroke="#140a24" stroke-linecap="round" stroke-linejoin="round">
          <g class="legA slowlegs" fill="none" stroke-width="6"><path d="M-1 -26 L-6 -1"/><path d="M3 -26 L8 -1"/></g>
          <g class="legB slowlegs" fill="none" stroke-width="6"><path d="M-1 -26 L1 -1"/><path d="M3 -26 L2 -1"/></g>
          <path d="M-7 -26 H7 L8 -48 Q0 -53 -7 -48 Z" stroke-width="2"/>
          <circle cx="0" cy="-56" r="7" stroke-width="0"/>
          <path d="M5 -44 L14 -34" fill="none" stroke-width="4.5"/>
          <g class="legA slowlegs" fill="none" stroke-width="2.4"><path d="M33 -6 L31 0 M37 -6 L39 0 M43 -6 L41 0 M47 -6 L49 0"/></g>
          <g class="legB slowlegs" fill="none" stroke-width="2.4"><path d="M33 -6 L35 0 M37 -6 L35 0 M43 -6 L45 0 M47 -6 L45 0"/></g>
          <ellipse cx="40" cy="-9" rx="10" ry="5" stroke-width="0"/>
          <circle cx="50" cy="-15" r="4.5" stroke-width="0"/>
          <ellipse cx="54.5" cy="-14" rx="3" ry="2" stroke-width="0"/>
          <path d="M48 -18 L46 -23 L51 -19 Z" stroke-width="1"/>
          <path class="wag" d="M30 -11 Q25 -18 27 -22" fill="none" stroke-width="2.4"/>
        </g>
        <path d="M-2 -63 Q0 -70 6 -63 Z" fill="#ff2e8a" stroke="#140a24" stroke-width="1.2"/>
        <path d="M14 -34 Q26 -18 46 -13" fill="none" stroke="#ff2e8a" stroke-width="1.6"/>
      </g>
    </g>
  </g>`;

const storm = `
  <defs>
    <linearGradient id="skyStorm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0620"/><stop offset=".6" stop-color="#241a48"/><stop offset="1" stop-color="#3b2f63"/></linearGradient>
    <pattern id="sRainA" width="30" height="40" patternUnits="userSpaceOnUse">
      <path d="M12 0L4 18M27 20L19 38" stroke="#bfe9ff" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>
      <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="-8 40" dur=".35s" repeatCount="indefinite"/>
    </pattern>
  </defs>
  <rect x="-20" y="-20" width="440" height="300" fill="url(#skyStorm)"/>
  <g class="px" data-depth="4">
    <use href="#skyline" fill="#1a1236" stroke="#140a24" stroke-width="4" stroke-linejoin="round"/>
    <rect width="400" height="232" fill="url(#winWarm)" clip-path="url(#skyClip)" opacity=".55"/>
  </g>
  <path class="bolt" d="M168 58L146 116H164L136 182L192 98H170L188 58Z" fill="#ffc93c" stroke="#140a24" stroke-width="3" stroke-linejoin="round"/>
  <g class="px" data-depth="2">
    <g style="--cloud:#2f3557"><use href="#cloud" transform="translate(-30 -10) scale(1.5)"/></g>
    <g style="--cloud:#3a4068"><use href="#cloud" transform="translate(130 -24) scale(1.6)"/></g>
    <g style="--cloud:#2f3557"><use href="#cloud" transform="translate(280 -6) scale(1.3)"/></g>
  </g>
  <rect x="-20" y="228" width="440" height="40" fill="#120b26" stroke="#140a24" stroke-width="4"/>
  <path d="M-20 245H420" stroke="#ffc93c" stroke-width="3" stroke-dasharray="18 14" opacity=".5"/>
  <g fill="none" stroke="#bfe9ff" stroke-width="2" opacity=".6"><ellipse cx="90" cy="252" rx="22" ry="3"/><ellipse cx="320" cy="250" rx="26" ry="3.5"/></g>
  <g class="px" data-depth="9">
    <g class="sway" style="--trunk:#140a24; --frond:#140a24"><use href="#palm" transform="translate(40 232) rotate(-6)"/></g>
    <g transform="translate(246 254) scale(1.3)">
      <g class="brace">
        <g filter="url(#rimCream)" fill="#140a24" stroke="#140a24" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-8)">
          <path d="M-1 -26 L-9 -1 M3 -26 L9 -1" fill="none" stroke-width="6"/>
          <path d="M-7 -26 H7 L9 -50 Q1 -55 -8 -50 Z" stroke-width="2"/>
          <circle cx="1" cy="-58" r="7" stroke-width="0"/>
          <path d="M-5 -48 L4 -74 M7 -48 L8 -74" fill="none" stroke-width="4.2"/>
        </g>
        <g class="flap" transform="rotate(-8)">
          <path d="M6 -74 V-84" stroke="#140a24" stroke-width="2.4"/>
          <path d="M-14 -102 L6 -84 L26 -102 Q16 -94 6 -98 Q-4 -94 -14 -102 Z" fill="#ff2e8a" stroke="#140a24" stroke-width="2.2" stroke-linejoin="round"/>
          <path d="M6 -84 L-4 -97 M6 -84 L16 -97" stroke="#140a24" stroke-width="1.2"/>
        </g>
      </g>
    </g>
  </g>
  <rect width="400" height="260" fill="url(#sRainA)" pointer-events="none"/>
  <rect class="flash" x="-20" y="-20" width="440" height="300" fill="#fff3dc" opacity="0" pointer-events="none"/>`;

const snow = `
  <defs>
    <linearGradient id="skySnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d8fd0"/><stop offset=".6" stop-color="#b9c6ef"/><stop offset="1" stop-color="#e9eeff"/></linearGradient>
    <pattern id="snowA" width="40" height="60" patternUnits="userSpaceOnUse">
      <circle cx="8" cy="10" r="2.2" fill="#fff"/><circle cx="28" cy="38" r="1.8" fill="#fff"/><circle cx="20" cy="54" r="1.4" fill="#fff"/>
      <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="6 60" dur="3.2s" repeatCount="indefinite"/>
    </pattern>
    <pattern id="snowB" width="26" height="34" patternUnits="userSpaceOnUse">
      <circle cx="6" cy="6" r="1.2" fill="#fff" opacity=".8"/><circle cx="19" cy="22" r="1" fill="#fff" opacity=".8"/>
      <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="-4 34" dur="4.5s" repeatCount="indefinite"/>
    </pattern>
  </defs>
  <rect x="-20" y="-20" width="440" height="300" fill="url(#skySnow)"/>
  <g class="px" data-depth="4">
    <use href="#skyline" fill="#6a58b0" stroke="#140a24" stroke-width="4" stroke-linejoin="round"/>
    <use href="#skyline" fill="none" stroke="#f4f7ff" stroke-width="2.5" stroke-linejoin="round"/>
    <rect width="400" height="232" fill="url(#winWarm)" clip-path="url(#skyClip)" opacity=".75"/>
  </g>
  <rect width="400" height="232" fill="url(#snowB)"/>
  <rect x="-20" y="228" width="440" height="40" fill="#eef3ff" stroke="#140a24" stroke-width="4"/>
  <path d="M-20 244H420M-20 250H420" stroke="#c9d3f0" stroke-width="2"/>
  <g class="px" data-depth="9">
    <g class="sway" style="--trunk:#8a4b2a; --frond:#dfe9ff"><use href="#palm" transform="translate(44 232)"/></g>
    <use href="#car" transform="translate(262 212)" fill="#ff2e8a"/>
    <path d="M300 217Q318 207 336 217Z" fill="#fff" stroke="#140a24" stroke-width="1.6"/>
    <g transform="translate(160 0)">
      <g fill="#fff" stroke="#140a24" stroke-width="3">
        <circle cx="0" cy="234" r="19"/><circle cx="0" cy="206" r="14"/><circle cx="0" cy="184" r="11"/>
      </g>
      <path d="M-13 200 Q0 206 13 200 L13 205 Q0 211 -13 205 Z" fill="#ff2e8a" stroke="#140a24" stroke-width="1.6"/>
      <path d="M7 204 L10 216 L15 215 L12 203" fill="#ff2e8a" stroke="#140a24" stroke-width="1.6"/>
      <path d="M-8 181 H-1 V184 Q-4.5 186.5 -8 184 Z M1 181 H8 V184 Q4.5 186.5 1 184 Z" fill="#140a24"/>
      <path d="M-9 181 H9" stroke="#140a24" stroke-width="1.4"/>
      <path class="glint" d="M-6.5 182 H-4" stroke="#fff" stroke-width="1"/>
      <path d="M0 187 L11 189 L0 190 Z" fill="#ff7a1a" stroke="#140a24" stroke-width="1"/>
      <circle cx="0" cy="212" r="1.6" fill="#140a24"/><circle cx="0" cy="226" r="1.6" fill="#140a24"/><circle cx="0" cy="236" r="1.6" fill="#140a24"/>
      <path d="M-13 206 L-30 196 M-26 198 L-30 192" stroke="#8a4b2a" stroke-width="2.6" stroke-linecap="round" fill="none"/>
      <g class="wave"><path d="M13 206 L28 192 M24 196 L29 199" stroke="#8a4b2a" stroke-width="2.6" stroke-linecap="round" fill="none"/></g>
    </g>
  </g>
  <rect width="400" height="260" fill="url(#snowA)" pointer-events="none"/>`;

const fog = `
  <defs>
    <linearGradient id="skyFog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3f63"/><stop offset=".6" stop-color="#7d7294"/><stop offset="1" stop-color="#a297b5"/></linearGradient>
    <radialGradient id="lampGlow"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".9"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>
    <filter id="fogBlur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
  </defs>
  <rect x="-20" y="-20" width="440" height="300" fill="url(#skyFog)"/>
  <g class="px" data-depth="3" opacity=".55">
    <use href="#skyline" fill="#5d5277" stroke="#3a3150" stroke-width="3" stroke-linejoin="round"/>
    <rect width="400" height="232" fill="url(#winWarm)" clip-path="url(#skyClip)" opacity=".35"/>
  </g>
  <g filter="url(#fogBlur)" fill="#e8e2f5">
    <rect class="drift slow" x="-40" y="120" width="300" height="34" rx="17" opacity=".55"/>
    <rect class="drift" x="160" y="168" width="320" height="30" rx="15" opacity=".5"/>
  </g>
  <rect x="-20" y="228" width="440" height="40" fill="#3a3150" stroke="#140a24" stroke-width="4"/>
  <path d="M-20 245H420" stroke="#ffc93c" stroke-width="3" stroke-dasharray="18 14" opacity=".4"/>
  <g class="px" data-depth="8">
    <circle class="neon" cx="112" cy="146" r="46" fill="url(#lampGlow)"/>
    <path d="M128 232V152Q128 142 118 142H108" fill="none" stroke="#140a24" stroke-width="6" stroke-linecap="round"/>
    <rect x="96" y="139" width="16" height="8" rx="2" fill="#ffe9a8" stroke="#140a24" stroke-width="2"/>
    <path d="M104 147 L84 230 H130 Z" fill="#ffe9a8" opacity=".18"/>
    <g filter="url(#rimCream)" fill="#140a24" stroke="#140a24" stroke-linecap="round" stroke-linejoin="round" transform="translate(104 252) scale(1.3)">
      <path d="M-3 -16 L-4 -1 M3 -16 L4 -1" fill="none" stroke-width="5"/>
      <path d="M-9 -14 L-7 -46 Q0 -51 7 -46 L10 -14 Z" stroke-width="1.5"/>
      <path d="M-7 -46 L-4 -52 L4 -52 L7 -46" stroke-width="1.5"/>
      <circle cx="0" cy="-56" r="6" stroke-width="0"/>
      <ellipse cx="0" cy="-60" rx="11" ry="2.6" stroke-width="0"/>
      <path d="M-6 -60 L-5 -68 H5 L6 -60 Z" stroke-width="0"/>
    </g>
    <use href="#car" transform="translate(236 212)" fill="#6e2bc4"/>
    <path d="M346 220L420 198V250Z" fill="#fff3dc" opacity=".3"/>
  </g>
  <g filter="url(#fogBlur)" fill="#f1ecfa" pointer-events="none">
    <rect class="drift" x="-60" y="200" width="380" height="36" rx="18" opacity=".55"/>
  </g>`;

const wind = `
  <defs>
    <linearGradient id="skyWind" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#19a6c4"/><stop offset=".6" stop-color="#7fd6d0"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>
  </defs>
  <rect x="-20" y="-20" width="440" height="300" fill="url(#skyWind)"/>
  <rect width="400" height="160" fill="url(#dots)" opacity=".08"/>
  <g class="px" data-depth="2">
    <g class="zoom"><g style="--cloud:#f3ecff"><use href="#cloud" transform="translate(0 20) scale(.7)"/></g></g>
    <g class="zoom late"><g style="--cloud:#e2f6f4"><use href="#cloud" transform="translate(0 66) scale(.55)"/></g></g>
  </g>
  <g class="px" data-depth="5">
    <use href="#skyline" fill="#3f2a8c" stroke="#140a24" stroke-width="4" stroke-linejoin="round"/>
    <rect width="400" height="232" fill="url(#winDay)" clip-path="url(#skyClip)" opacity=".7"/>
  </g>
  <g fill="none" stroke="#fff3dc" stroke-width="2.5" stroke-linecap="round" opacity=".75">
    <path class="streak" d="M20 60H90M40 100H130M10 150H70"/>
    <path class="streak late" d="M200 40H280M240 120H320M180 180H240"/>
  </g>
  <rect x="-20" y="228" width="440" height="40" fill="#2a1250" stroke="#140a24" stroke-width="4"/>
  <path d="M-20 245H420" stroke="#ffc93c" stroke-width="3" stroke-dasharray="18 14"/>
  <g class="px" data-depth="9">
    <g class="gale" style="--trunk:#8a4b2a; --frond:#0e7a66"><use href="#palm" transform="translate(40 232)"/></g>
    <g class="gale slow" style="--trunk:#8a4b2a; --frond:#12a08a"><use href="#palm" transform="translate(340 232) scale(.9)"/></g>
    <g class="fly"><path d="M0 0l10-3 4 8-10 3z" transform="translate(60 120)" fill="#fff3dc" stroke="#140a24" stroke-width="1.5"/></g>
    <g class="fly late"><path d="M0 0q6-8 12 0q-6 8-12 0z" transform="translate(30 170)" fill="#0e7a66" stroke="#140a24" stroke-width="1.5"/></g>
    <g class="fly later"><path d="M0 0q6-8 12 0q-6 8-12 0z" transform="translate(90 90)" fill="#ff7a1a" stroke="#140a24" stroke-width="1.5"/></g>
    <g transform="translate(190 256) scale(1.3)">
      <g class="bob">
        <g filter="url(#rimCream)" fill="#140a24" stroke="#140a24" stroke-linecap="round" stroke-linejoin="round">
          <g class="legA" fill="none" stroke-width="6"><path d="M0 -28 L-7 -15 L-17 -9"/><path d="M3 -28 L12 -17 L18 -3"/></g>
          <g class="legB" fill="none" stroke-width="6"><path d="M0 -28 L-2 -14 L1 -1"/><path d="M3 -28 L10 -18 L2 -11"/></g>
          <path d="M-4 -27 L6 -30 L16 -50 L5 -54 Z" stroke-width="2"/>
          <circle cx="16" cy="-59" r="6.5" stroke-width="0"/>
          <path d="M14 -48 L30 -56 M7 -48 L-4 -38" fill="none" stroke-width="4.5"/>
        </g>
      </g>
      <g class="capfly"><path d="M30 -70 q0 -9 9 -9 q9 0 9 9 z M39 -70 h13 q0 3 -6 3 h-7 z" fill="#ff2e8a" stroke="#140a24" stroke-width="1.8" stroke-linejoin="round"/></g>
    </g>
  </g>`;

const SCENES = { sun, clouds, rain, storm, snow, fog, wind, night };

/** The inside of a scene (no <svg> wrapper), with the night veil when needed. Used by the poster. */
export function sceneBody(name, night = false) {
  const base = SCENES[name] ?? SCENES.sun;
  return night && name !== 'night' ? `${base}<rect x="-20" y="-20" width="440" height="300" fill="#0d0620" opacity=".42"/>` : base;
}

/** Full SVG markup for a scene, with an accessible description. */
export function sceneSvg(name, label, night = false) {
  const base = SCENES[name] ?? SCENES.sun;
  // At night, any scene except "night" gets a dark-blue veil so the whole interface follows the hour
  const body = night && name !== 'night' ? `${base}<rect x="-20" y="-20" width="440" height="300" fill="#0d0620" opacity=".42" pointer-events="none"/>` : base;
  const safe = String(label).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  return `<svg viewBox="0 0 400 260" role="img" aria-label="${safe}" preserveAspectRatio="xMidYMid slice">${body}</svg>`;
}
