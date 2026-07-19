/** Approximate city centers for map placement when a hotel has no coordinates. */
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.209 },
  "new delhi": { lat: 28.6139, lng: 77.209 },
  london: { lat: 51.5074, lng: -0.1278 },
  toronto: { lat: 43.6532, lng: -79.3832 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  paris: { lat: 48.8566, lng: 2.3522 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
  "new york": { lat: 40.7128, lng: -74.006 },
  zurich: { lat: 47.3769, lng: 8.5417 },
  interlaken: { lat: 46.6863, lng: 7.8632 },
  sydney: { lat: -33.8688, lng: 151.2093 },
  jakarta: { lat: -6.2088, lng: 106.8456 },
  bali: { lat: -8.4095, lng: 115.1889 },
  denpasar: { lat: -8.6705, lng: 115.2126 },
  bandung: { lat: -6.9175, lng: 107.6191 },
  surabaya: { lat: -7.2575, lng: 112.7521 },
  yogyakarta: { lat: -7.7956, lng: 110.3695 },
};

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Deterministic offset so multiple hotels in one city don't stack on the same pin. */
function offsetFromId(id: string): { lat: number; lng: number } {
  const hash = hashId(id);
  const latOffset = ((hash % 200) - 100) / 2500;
  const lngOffset = (((hash >> 8) % 200) - 100) / 2500;
  return { lat: latOffset, lng: lngOffset };
}

function findCityCenter(city: string): { lat: number; lng: number } | null {
  const cityKey = city.trim().toLowerCase();
  if (!cityKey) return null;
  if (CITY_COORDINATES[cityKey]) return CITY_COORDINATES[cityKey];

  const matchedKey = Object.keys(CITY_COORDINATES).find(
    (key) => cityKey.includes(key) || key.includes(cityKey)
  );
  return matchedKey ? CITY_COORDINATES[matchedKey] : null;
}

export function resolvePropertyCoordinates(property: {
  id: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
}): { lat: number; lng: number } | null {
  if (
    property.latitude != null &&
    property.longitude != null &&
    !(property.latitude === 0 && property.longitude === 0)
  ) {
    return { lat: property.latitude, lng: property.longitude };
  }

  const center = findCityCenter(property.city);
  if (!center) return null;

  const offset = offsetFromId(property.id);
  return {
    lat: center.lat + offset.lat,
    lng: center.lng + offset.lng,
  };
}
