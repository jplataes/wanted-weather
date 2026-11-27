# Source of truth — Wanted Weather

Use only what is written here for facts. Anything marked PENDING must be asked, not invented.

## Project
- Name: Wanted Weather (same name in Spanish and English)
- Course: AI Maker, Project 2 "App del Tiempo"
- Author links (footer / about): LinkedIn https://www.linkedin.com/in/javierplata/ · GitHub https://github.com/jplataes
- Languages: Spanish (default) and English, ES/EN toggle, choice remembered

## Data
- API: OpenWeatherMap, free tier. Current weather + 5-day forecast.
- API key: provided by the owner privately as an environment variable. Never ask for it in chat or commit it.
- Units: metric. Language of descriptions follows the app language.
- Fallback city if location is refused: Madrid.

## Publishing
- GitHub Pages (or the option recommended and approved in the key-protection decision).

## Delivery requirements on the platform
Delivered as a link (or a zip up to 15 MB). The app must:
1. Consume a real public weather API and show up-to-date data.
2. Let the user search the weather for any city.
3. Handle errors correctly.
4. Keep the API key protected: it must not appear in the code uploaded to GitHub.
5. Be deployed and publicly accessible.
