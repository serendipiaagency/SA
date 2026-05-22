import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { buildDays, dateRange, Activity } from './algorithm';

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({ origin: '*' }));

app.get('/health', (c) => c.json({ status: 'ok' }));

// GET /api/itineraries/destinations
app.get('/api/itineraries/destinations', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT id, name, country FROM itin_destinations ORDER BY name'
  ).all();
  return c.json(results);
});

// POST /api/itineraries
app.post('/api/itineraries', async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ detail: 'Invalid JSON' }, 400);
  }

  const { destination_id, start_date, end_date, budget, interests } = body;

  if (!destination_id || !start_date || !end_date || !budget || !interests?.length) {
    return c.json({ detail: 'Missing required fields' }, 422);
  }

  const validInterests = new Set(['culture', 'food', 'nature', 'adventure', 'shopping']);
  for (const i of interests) {
    if (!validInterests.has(i)) return c.json({ detail: `Invalid interest: ${i}` }, 422);
  }

  if (end_date < start_date) {
    return c.json({ detail: 'end_date must be >= start_date' }, 422);
  }
  if (budget <= 0) {
    return c.json({ detail: 'budget must be positive' }, 422);
  }

  const dest = await c.env.DB.prepare(
    'SELECT * FROM itin_destinations WHERE id = ?'
  ).bind(destination_id).first<{ id: number; name: string; country: string; lat: number; lon: number }>();

  if (!dest) return c.json({ detail: 'Destination not found' }, 404);

  const placeholders = interests.map(() => '?').join(',');
  const { results: activities } = await c.env.DB.prepare(
    `SELECT * FROM itin_activities WHERE destination_id = ? AND category IN (${placeholders}) ORDER BY rating DESC`
  ).bind(destination_id, ...interests).all<Activity>();

  if (!activities.length) {
    return c.json({ detail: 'No activities found for selected interests' }, 422);
  }

  const dates = dateRange(start_date, end_date);
  const { days, totalCost } = buildDays(activities, dest.lat, dest.lon, dates, budget);

  // Persist itinerary
  const itin = await c.env.DB.prepare(
    `INSERT INTO itin_itineraries (destination_id, start_date, end_date, budget, interests, total_cost)
     VALUES (?, ?, ?, ?, ?, ?) RETURNING *`
  ).bind(destination_id, start_date, end_date, budget, interests.join(','), totalCost).first<any>();

  const savedDays = [];
  for (const day of days) {
    const savedDay = await c.env.DB.prepare(
      `INSERT INTO itin_days (itinerary_id, day_number, date) VALUES (?, ?, ?) RETURNING *`
    ).bind(itin.id, day.day_number, day.date).first<any>();

    const savedItems = [];
    for (const item of day.items) {
      await c.env.DB.prepare(
        `INSERT INTO itin_items (day_id, activity_id, item_order, start_time, end_time, travel_minutes_from_prev)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(savedDay.id, item.activity.id, item.order, item.start_time, item.end_time, item.travel_minutes_from_prev).run();
      savedItems.push(item);
    }

    savedDays.push({ ...savedDay, items: savedItems });
  }

  return c.json({
    id: itin.id,
    destination_id: itin.destination_id,
    destination: { id: dest.id, name: dest.name, country: dest.country, lat: dest.lat, lon: dest.lon },
    start_date: itin.start_date,
    end_date: itin.end_date,
    budget: itin.budget,
    interests: itin.interests,
    total_cost: itin.total_cost,
    days: savedDays.map((d) => ({
      day_number: d.day_number,
      date: d.date,
      items: d.items.map((item: any) => ({
        order: item.order,
        start_time: item.start_time,
        end_time: item.end_time,
        travel_minutes_from_prev: item.travel_minutes_from_prev,
        activity: item.activity,
      })),
    })),
  }, 201);
});

// GET /api/itineraries/:id
app.get('/api/itineraries/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const itin = await c.env.DB.prepare('SELECT * FROM itin_itineraries WHERE id = ?').bind(id).first<any>();
  if (!itin) return c.json({ detail: 'Itinerary not found' }, 404);

  const dest = await c.env.DB.prepare(
    'SELECT id, name, country, lat, lon FROM itin_destinations WHERE id = ?'
  ).bind(itin.destination_id).first<any>();

  const { results: days } = await c.env.DB.prepare(
    'SELECT * FROM itin_days WHERE itinerary_id = ? ORDER BY day_number'
  ).bind(id).all<any>();

  const fullDays = await Promise.all(days.map(async (day: any) => {
    const { results: items } = await c.env.DB.prepare(
      `SELECT i.*, a.name, a.category, a.description, a.price, a.rating,
              a.duration_minutes, a.lat, a.lon, a.opening_time, a.closing_time, a.website
       FROM itin_items i JOIN itin_activities a ON a.id = i.activity_id
       WHERE i.day_id = ? ORDER BY i.item_order`
    ).bind(day.id).all<any>();

    return {
      day_number: day.day_number,
      date: day.date,
      items: items.map((item: any) => ({
        order: item.item_order,
        start_time: item.start_time,
        end_time: item.end_time,
        travel_minutes_from_prev: item.travel_minutes_from_prev,
        activity: {
          id: item.activity_id,
          name: item.name,
          category: item.category,
          description: item.description,
          price: item.price,
          rating: item.rating,
          duration_minutes: item.duration_minutes,
          lat: item.lat,
          lon: item.lon,
          opening_time: item.opening_time,
          closing_time: item.closing_time,
          website: item.website,
        },
      })),
    };
  }));

  return c.json({ ...itin, destination: dest, days: fullDays });
});

// Serve static frontend assets for all other routes
app.all('*', async (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
