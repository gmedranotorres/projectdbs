// Read-only: fetches today's and tomorrow's Chicago forecast from Open-Meteo (free, no key).
// Usage: node scripts/weather.mjs
const LAT = 41.7943, LON = -87.5907; // Hyde Park
const url = new URL("https://api.open-meteo.com/v1/forecast");
url.search = new URLSearchParams({
  latitude: LAT, longitude: LON, timezone: "America/Chicago",
  temperature_unit: "celsius", wind_speed_unit: "kmh", precipitation_unit: "mm",
  forecast_days: "2",
  hourly: "temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m",
  daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,weather_code",
}).toString();

const CODES = { 0: "clear", 1: "mostly clear", 2: "partly cloudy", 3: "overcast", 45: "fog", 48: "fog",
  51: "light drizzle", 53: "drizzle", 55: "heavy drizzle", 61: "light rain", 63: "rain", 65: "heavy rain",
  71: "light snow", 73: "snow", 75: "heavy snow", 80: "showers", 81: "showers", 82: "heavy showers",
  95: "thunderstorm" };

const res = await fetch(url);
if (!res.ok) { console.error(`Open-Meteo error ${res.status}`); process.exit(1); }
const w = await res.json();
const out = {
  fetched_at: new Date().toISOString(),
  days: w.daily.time.map((d, i) => ({
    date: d, high_c: w.daily.temperature_2m_max[i], low_c: w.daily.temperature_2m_min[i],
    rain_chance: w.daily.precipitation_probability_max[i], sky: CODES[w.daily.weather_code[i]] ?? `code ${w.daily.weather_code[i]}`,
    sunrise: w.daily.sunrise[i].slice(11), sunset: w.daily.sunset[i].slice(11),
  })),
  hours: w.hourly.time.map((t, i) => ({
    time: t, temp_c: w.hourly.temperature_2m[i], feels_c: w.hourly.apparent_temperature[i],
    rain_chance: w.hourly.precipitation_probability[i], wind_kmh: w.hourly.wind_speed_10m[i],
    sky: CODES[w.hourly.weather_code[i]] ?? `code ${w.hourly.weather_code[i]}`,
  })).filter(h => +h.time.slice(11, 13) >= 7 && +h.time.slice(11, 13) <= 22),
};
console.log(JSON.stringify(out, null, 2));
