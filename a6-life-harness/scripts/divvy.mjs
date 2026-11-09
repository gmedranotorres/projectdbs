// Read-only: looks up live bikes and docks at Divvy stations (free GBFS feed, no key).
// Usage:
//   node scripts/divvy.mjs "Ellis Ave" "57th St"        stations whose name contains any of the words
//   node scripts/divvy.mjs --near 41.7905,-87.6025 400  stations within 400 m of a point (here, Crerar) (default 500)
const BASE = "https://gbfs.lyft.com/gbfs/1.1/chi/en";
const args = process.argv.slice(2);
let near = null, terms = [];
if (args[0] === "--near") {
  const [lat, lon] = args[1].split(",").map(Number);
  near = { lat, lon, radius: Number(args[2] ?? 500) };
} else terms = args.map(t => t.toLowerCase());
if (!near && !terms.length) { console.error('Give station names, e.g. "Ellis Ave", or --near lat,lon [meters]'); process.exit(1); }

const get = async (feed) => {
  const r = await fetch(`${BASE}/${feed}.json`);
  if (!r.ok) { console.error(`Divvy ${feed} error ${r.status}`); process.exit(1); }
  return r.json();
};
const meters = (a, b) => {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
};
const [info, status] = await Promise.all([get("station_information"), get("station_status")]);
const byId = new Map(status.data.stations.map(s => [s.station_id, s]));

const stations = info.data.stations
  .map(s => ({ s, dist: near ? meters(near, s) : null }))
  .filter(({ s, dist }) => near ? dist <= near.radius : terms.some(t => s.name.toLowerCase().includes(t)))
  .sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0))
  .map(({ s, dist }) => {
    const st = byId.get(s.station_id) ?? {};
    const ebikes = st.num_ebikes_available ?? 0;
    return {
      name: s.name, ...(dist !== null && { meters_away: dist }), capacity: s.capacity,
      classic_bikes: (st.num_bikes_available ?? 0) - ebikes, ebikes,
      open_docks: st.num_docks_available ?? 0,
      renting: !!st.is_renting, returning: !!st.is_returning,
      reported_at: st.last_reported ? new Date(st.last_reported * 1000).toISOString() : null,
    };
  });
console.log(JSON.stringify({ fetched_at: new Date().toISOString(), feed_updated: new Date(status.last_updated * 1000).toISOString(), stations }, null, 2));
