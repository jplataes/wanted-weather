# Wanted Weather

A weather app that plays like an open-world game: real forecasts, wanted-level stars, extreme-weather alerts, daily missions, a car radio, arcade mini-games and a shareable movie poster of the day. Spanish by default, with an ES/EN switch. Built with AI for the AI Maker programme.

**Live:** https://jplataes.github.io/wanted-weather/

> 🚧 Work in progress. See [PLAN.md](PLAN.md) for the phases. Screenshots arrive with the final phase.

## What works now (phases 1–6)
- Real current weather from OpenWeatherMap for your location, with Madrid as the fallback if location is refused.
- City search, ES/EN switch (remembered), last result saved for an instant next visit.
- HUD: city, temperature, condition, feels like, humidity, wind, sunrise/sunset, an illustrated minimap with the real wind direction and a 1–5 star "wanted level".
- Full-screen game-style alert for extreme weather (rain, heat, cold, wind, storm).
- Errors explained in the game's style: city not found, invalid key, quota reached, no connection, service down.
- Mission of the day (objective, real intel and recommended gear) and the next days as "upcoming missions".
- Eight illustrated scenes with their own characters, a "living screen" layer (rain on the glass, snow, fog, gusts, lightning, heat haze, frost) and a daylight countdown.
- Three zones like a game menu: Street (today at a glance), Missions and Arcade.
- A car radio that is always at hand: four fictional stations with music generated live with the Web Audio API and hosts reading real forecast lines (Speech Synthesis). Off by default, with volume and mute.
- The Excuse-o-matic: a slot machine that gives you a cheeky excuse to bail on plans, built from today's real weather, ready to copy or share.
- City Duel: your city against any other in five rounds of real weather (ideal temperature, sky, wind, humidity, daylight), with a stadium scoreboard, cheeky commentary and a shareable result card. Uncle Isobar calls to dare you.
- Fame zone: a movie poster of today's weather (your city, the real scene, a film genre per weather type), in poster or stories format, ready to download as a PNG or share.
- A mission phone call from "Uncle Isobar": the phone rings silently on screen and the voice (Speech Synthesis) only plays when you answer.

## Run it locally
```bash
npm install
cp .env.example .env   # then put your OpenWeatherMap key in VITE_OPENWEATHER_API_KEY
npm run dev
```
Tests: `npm test`.

Test helpers: add `?alerta=storm` (or `rain`, `heat`, `cold`, `wind`) to the URL to see an alert, `?escena=snow` (`sun`, `clouds`, `rain`, `storm`, `snow`, `fog`, `wind`, `night`) to force a scene, `?efecto=rain` (`storm`, `snow`, `fog`, `wind`, `heat`, `cold`, `none`) to force the screen effect and `?llamada=1` to get the phone call again.

## How the API key is protected
The published app never contains the key. It calls a tiny Cloudflare Worker (`worker/`) that adds the key on the server and only answers requests from the app's own website. The key is stored as a secret in Cloudflare and in GitHub Actions, never in the code.

## Structure
- `src/api.js` – requests to the weather service and error handling
- `src/dom.js` – everything drawn on the page
- `src/main.js` – starts the app and connects actions, data and drawing
- `src/weather.js` – game logic: wanted level, scenes, formatting
- `src/forecast.js`, `src/missions.js` – daily forecast summary, mission of the day and gear
- `src/call.js`, `src/fx.js` – the mission phone call and the living-screen effects
- `src/radio.js`, `src/radio-lines.js` – the car radio (Web Audio music) and its hosts
- `src/excuses.js`, `src/excusometer.js` – the Excuse-o-matic
- `src/poster.js`, `src/poster-copy.js`, `src/fama.js` – the movie poster of the day and the Fame zone
- `src/duel.js`, `src/duel-ui.js` – the City Duel
- `src/i18n.js`, `src/copy.js` – texts in Spanish and English
- `src/scenes.js`, `src/minimap.js`, `src/icons.js` – illustrations drawn in SVG
- `src/geo.js`, `src/storage.js` – location and saved data
- `worker/` – the Cloudflare Worker proxy
- `muestra/` – the visual style guide (phase 0)

## Technologies
Vite, plain JavaScript (ES modules), SVG and CSS, OpenWeatherMap API, Cloudflare Workers, GitHub Pages. Fonts: Anton, Bangers and Barlow (SIL Open Font License).

## Credits
Weather data: [OpenWeatherMap](https://openweathermap.org/). Made by [Javier Plata](https://www.linkedin.com/in/javierplata/) · [GitHub](https://github.com/jplataes). Built with AI.
