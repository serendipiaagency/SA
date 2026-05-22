export interface Activity {
  id: number;
  destination_id: number;
  name: string;
  category: string;
  lat: number;
  lon: number;
  opening_time: number;
  closing_time: number;
  duration_minutes: number;
  price: number;
  description: string;
  rating: number;
  website: string;
}

export interface ItineraryItem {
  activity: Activity;
  order: number;
  start_time: number;
  end_time: number;
  travel_minutes_from_prev: number;
}

export interface ItineraryDay {
  day_number: number;
  date: string;
  items: ItineraryItem[];
}

const DAY_START = 900;
const DAY_END = 2100;
const WALKING_SPEED_KMH = 4.5;
const TAXI_SPEED_KMH = 25.0;
const TAXI_THRESHOLD_KM = 2.0;
const TRANSFER_BUFFER_MIN = 5;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dphi = ((lat2 - lat1) * Math.PI) / 180;
  const dlambda = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dphi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

function travelMinutes(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const km = haversineKm(lat1, lon1, lat2, lon2);
  const speed = km <= TAXI_THRESHOLD_KM ? WALKING_SPEED_KMH : TAXI_SPEED_KMH;
  return Math.ceil((km / speed) * 60) + TRANSFER_BUFFER_MIN;
}

function hhmmToMinutes(hhmm: number): number {
  return Math.floor(hhmm / 100) * 60 + (hhmm % 100);
}

function minutesToHhmm(minutes: number): number {
  return Math.floor(minutes / 60) * 100 + (minutes % 60);
}

function isOpen(act: Activity, arrivalMinutes: number): boolean {
  const open = hhmmToMinutes(act.opening_time);
  const close = hhmmToMinutes(act.closing_time);
  return open <= arrivalMinutes && arrivalMinutes + act.duration_minutes <= close;
}

export function buildDays(
  activities: Activity[],
  destLat: number,
  destLon: number,
  dates: string[],
  budget: number,
): { days: ItineraryDay[]; totalCost: number } {
  const usedIds = new Set<number>();
  let remainingBudget = budget;
  let totalCost = 0;

  const days: ItineraryDay[] = dates.map((date, idx) => {
    let curLat = destLat;
    let curLon = destLon;
    let curMinutes = hhmmToMinutes(DAY_START);
    const dayEndMinutes = hhmmToMinutes(DAY_END);
    const items: ItineraryItem[] = [];

    while (true) {
      let best: Activity | null = null;
      let bestDist = Infinity;
      let bestTravel = 0;

      for (const act of activities) {
        if (usedIds.has(act.id)) continue;
        if (act.price > remainingBudget) continue;

        const travel = travelMinutes(curLat, curLon, act.lat, act.lon);
        const arrival = curMinutes + travel;
        if (arrival + act.duration_minutes > dayEndMinutes) continue;
        if (!isOpen(act, arrival)) continue;

        const dist = haversineKm(curLat, curLon, act.lat, act.lon);
        if (dist < bestDist) {
          bestDist = dist;
          best = act;
          bestTravel = travel;
        }
      }

      if (!best) break;

      const arrival = curMinutes + bestTravel;
      const end = arrival + best.duration_minutes;

      items.push({
        activity: best,
        order: items.length,
        start_time: minutesToHhmm(arrival),
        end_time: minutesToHhmm(end),
        travel_minutes_from_prev: bestTravel,
      });

      usedIds.add(best.id);
      remainingBudget -= best.price;
      totalCost += best.price;
      curLat = best.lat;
      curLon = best.lon;
      curMinutes = end;
    }

    return { day_number: idx + 1, date, items };
  });

  return { days, totalCost };
}

export function dateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start + 'T00:00:00Z');
  const endDate = new Date(end + 'T00:00:00Z');
  while (cur <= endDate) {
    dates.push(cur.toISOString().split('T')[0]);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}
