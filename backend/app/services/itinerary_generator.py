"""
Itinerary generation algorithm — v1: Greedy Nearest-Neighbor.

For each day:
  1. Filter activities by destination, allowed interests, and remaining budget.
  2. Starting from the destination center (lat/lon), repeatedly pick the
     closest unvisited activity that:
       - Is open during the current time slot.
       - Fits within remaining daily time (end by 21:00).
       - Does not exceed the remaining budget.
  3. Compute travel time between activities using Haversine distance and a
     blended speed (walking < 2 km, taxi otherwise).
  4. Store each day as an ordered list of timed items.

See IMPROVEMENTS section at the bottom of this file for v2 ideas.
"""

import math
from datetime import date, timedelta
from typing import List, Set

from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.models.destination import Destination
from app.models.itinerary import Itinerary, ItineraryDay, ItineraryItem

# Constants
DAY_START = 900    # 09:00
DAY_END = 2100     # 21:00
WALKING_SPEED_KMH = 4.5
TAXI_SPEED_KMH = 25.0
TAXI_THRESHOLD_KM = 2.0
TRANSFER_BUFFER_MIN = 5  # fixed buffer added to every travel leg


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


def _travel_minutes(lat1: float, lon1: float, lat2: float, lon2: float) -> int:
    km = _haversine_km(lat1, lon1, lat2, lon2)
    speed = WALKING_SPEED_KMH if km <= TAXI_THRESHOLD_KM else TAXI_SPEED_KMH
    return int(math.ceil(km / speed * 60)) + TRANSFER_BUFFER_MIN


def _hhmm_to_minutes(hhmm: int) -> int:
    return (hhmm // 100) * 60 + (hhmm % 100)


def _minutes_to_hhmm(minutes: int) -> int:
    return (minutes // 60) * 100 + (minutes % 60)


def _is_open(activity: Activity, arrival_minutes: int) -> bool:
    open_m = _hhmm_to_minutes(activity.opening_time)
    close_m = _hhmm_to_minutes(activity.closing_time)
    return open_m <= arrival_minutes and (arrival_minutes + activity.duration_minutes) <= close_m


def generate_itinerary(
    db: Session,
    destination_id: int,
    start_date: date,
    end_date: date,
    budget: float,
    interests: List[str],
) -> Itinerary:
    destination = db.get(Destination, destination_id)
    if not destination:
        raise ValueError(f"Destination {destination_id} not found")

    candidate_activities: List[Activity] = (
        db.query(Activity)
        .filter(
            Activity.destination_id == destination_id,
            Activity.category.in_(interests),
        )
        .order_by(Activity.rating.desc())
        .all()
    )

    if not candidate_activities:
        raise ValueError("No activities found for the selected destination and interests")

    itinerary = Itinerary(
        destination_id=destination_id,
        start_date=start_date,
        end_date=end_date,
        budget=budget,
        interests=",".join(interests),
        total_cost=0.0,
    )
    db.add(itinerary)
    db.flush()

    remaining_budget = budget
    used_activity_ids: Set[int] = set()
    day_count = (end_date - start_date).days + 1

    for day_idx in range(day_count):
        current_date = start_date + timedelta(days=day_idx)
        day = ItineraryDay(
            itinerary_id=itinerary.id,
            day_number=day_idx + 1,
            date=current_date,
        )
        db.add(day)
        db.flush()

        current_lat = destination.lat
        current_lon = destination.lon
        current_minutes = _hhmm_to_minutes(DAY_START)
        day_end_minutes = _hhmm_to_minutes(DAY_END)
        order = 0

        while True:
            best: Activity | None = None
            best_distance = float("inf")
            best_travel = 0

            for act in candidate_activities:
                if act.id in used_activity_ids:
                    continue
                if act.price > remaining_budget:
                    continue

                travel_m = _travel_minutes(current_lat, current_lon, act.lat, act.lon)
                arrival_minutes = current_minutes + travel_m

                if arrival_minutes + act.duration_minutes > day_end_minutes:
                    continue
                if not _is_open(act, arrival_minutes):
                    continue

                dist = _haversine_km(current_lat, current_lon, act.lat, act.lon)
                if dist < best_distance:
                    best_distance = dist
                    best = act
                    best_travel = travel_m

            if best is None:
                break

            arrival_minutes = current_minutes + best_travel
            end_minutes = arrival_minutes + best.duration_minutes

            item = ItineraryItem(
                day_id=day.id,
                activity_id=best.id,
                order=order,
                start_time=_minutes_to_hhmm(arrival_minutes),
                end_time=_minutes_to_hhmm(end_minutes),
                travel_minutes_from_prev=best_travel,
            )
            db.add(item)

            remaining_budget -= best.price
            itinerary.total_cost += best.price
            used_activity_ids.add(best.id)
            current_lat = best.lat
            current_lon = best.lon
            current_minutes = end_minutes
            order += 1

    db.commit()
    db.refresh(itinerary)
    return itinerary


# ---------------------------------------------------------------------------
# IMPROVEMENTS FOR V2
# ---------------------------------------------------------------------------
# 1. Constraint satisfaction / ILP: replace greedy with Google OR-Tools to
#    find the globally optimal activity ordering per day (true TSP variant).
#
# 2. Time-of-day scoring: weight activities by "best time to visit" metadata
#    (e.g. sunrise hike in the morning, restaurants at lunch/dinner).
#
# 3. Meal slots: reserve fixed breakfast / lunch / dinner windows and fill
#    them with food-category activities or restaurant recommendations.
#
# 4. User preferences beyond categories: preferred start time, pace
#    (relaxed / moderate / intense), mobility constraints.
#
# 5. Real travel times: replace Haversine with Google Maps / OSRM API calls
#    to account for roads, transit, and real-time traffic.
#
# 6. Diversity boost: penalise consecutive activities of the same category
#    to produce more varied days.
#
# 7. Multi-day deduplication: when the same city spans many days, spread
#    activities across days instead of front-loading them.
