const BASE = '/api/itineraries';

export async function fetchDestinations() {
  const r = await fetch(`${BASE}/destinations`);
  if (!r.ok) throw new Error('Failed to load destinations');
  return r.json();
}

export async function createItinerary(payload) {
  const r = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create itinerary');
  }
  return r.json();
}

export async function getItinerary(id) {
  const r = await fetch(`${BASE}/${id}`);
  if (!r.ok) throw new Error('Itinerary not found');
  return r.json();
}
