# Data sources

All three are read-only. If one fails, plan without it and say what's missing.

## data/courses.json (from the three syllabi)

- Classes, TA sessions, office hours, weekly cycles, deadlines and rules for DBS, Micro and Clinic.
- Can't see: grades, Canvas announcements, changed rooms, new assignments, how far along she is. Ask her, and keep the answers in `notes/state.md`.
- Clinic deadlines have `estimated: true`. The clinic gives week numbers only, and Canvas has the real dates.
- A hook blocks every edit to this folder. If something here is wrong, tell Gabriela what to change. Don't change it yourself.

## scripts/weather.mjs (Open-Meteo, free, no key)

- Returns `days` (high_c, low_c, rain_chance, sky, sunrise, sunset) for today and tomorrow, and `hours` from 07:00 to 22:00 (temp_c, feels_c, rain_chance, wind_kmh, sky).
- Location: Hyde Park. Forecasts change; quote them as "forecast," not fact.

## scripts/divvy.mjs (Divvy GBFS feed, free, no key)

- `node scripts/divvy.mjs "<name part>" ...` matches station names. `--near lat,lon meters` lists stations near a point.
- Returns classic_bikes, ebikes, open_docks, renting/returning, and when each station last reported.
- The feed updates about every minute. Counts at 8:00 can be different by 9:00. Say when you checked.
- If `reported_at` is more than 30 minutes old, treat that station as unknown.
