import math
from datetime import date

import pytest

from app.services.itinerary_generator import (
    _haversine_km,
    _hhmm_to_minutes,
    _minutes_to_hhmm,
    _travel_minutes,
    _is_open,
    generate_itinerary,
)
from app.models.activity import Activity


# --- Unit tests for helper functions ---

def test_haversine_same_point():
    assert _haversine_km(41.38, 2.17, 41.38, 2.17) == pytest.approx(0.0, abs=1e-6)


def test_haversine_known_distance():
    # Barcelona Sagrada Família to Park Güell ≈ 2.2 km
    km = _haversine_km(41.4036, 2.1744, 41.4145, 2.1527)
    assert 1.5 < km < 3.0


def test_hhmm_conversions():
    assert _hhmm_to_minutes(900) == 540
    assert _hhmm_to_minutes(1330) == 810
    assert _minutes_to_hhmm(540) == 900
    assert _minutes_to_hhmm(810) == 1330


def test_travel_minutes_short_distance_walking():
    # < 2 km should use walking speed
    mins = _travel_minutes(41.38, 2.17, 41.385, 2.175)
    assert mins > 0
    assert mins < 30  # short walk


def test_travel_minutes_long_distance_taxi():
    # > 2 km should use taxi speed → faster per km
    short = _travel_minutes(41.38, 2.17, 41.395, 2.18)   # ~1.8 km
    long_ = _travel_minutes(41.38, 2.17, 41.42, 2.20)    # ~5 km
    # long distance uses taxi so minutes/km ratio should be lower
    short_km = _haversine_km(41.38, 2.17, 41.395, 2.18)
    long_km = _haversine_km(41.38, 2.17, 41.42, 2.20)
    assert (long_ - 5) / long_km < (short - 5) / short_km  # taxi faster per km


def test_is_open_within_window():
    act = Activity(opening_time=900, closing_time=1800, duration_minutes=90)
    assert _is_open(act, _hhmm_to_minutes(1000))  # arrives 10:00, ends 11:30 ✓
    assert not _is_open(act, _hhmm_to_minutes(1700))  # arrives 17:00, ends 18:30 ✗
    assert not _is_open(act, _hhmm_to_minutes(830))   # arrives before opening ✗


# --- Integration tests for generate_itinerary ---

def test_generate_single_day(db, barcelona, activities):
    itinerary = generate_itinerary(
        db=db,
        destination_id=barcelona.id,
        start_date=date(2026, 6, 1),
        end_date=date(2026, 6, 1),
        budget=200.0,
        interests=["culture", "food", "nature", "adventure"],
    )
    assert itinerary.id is not None
    assert len(itinerary.days) == 1
    day = itinerary.days[0]
    assert day.day_number == 1
    assert len(day.items) > 0


def test_generate_multi_day_no_repeat(db, barcelona, activities):
    itinerary = generate_itinerary(
        db=db,
        destination_id=barcelona.id,
        start_date=date(2026, 6, 1),
        end_date=date(2026, 6, 3),
        budget=500.0,
        interests=["culture", "food", "nature", "adventure"],
    )
    assert len(itinerary.days) == 3
    all_activity_ids = [item.activity_id for day in itinerary.days for item in day.items]
    # Each activity used at most once across all days
    assert len(all_activity_ids) == len(set(all_activity_ids))


def test_budget_respected(db, barcelona, activities):
    itinerary = generate_itinerary(
        db=db,
        destination_id=barcelona.id,
        start_date=date(2026, 6, 1),
        end_date=date(2026, 6, 2),
        budget=30.0,
        interests=["culture", "food", "nature", "adventure"],
    )
    assert itinerary.total_cost <= 30.0


def test_interests_filter(db, barcelona, activities):
    itinerary = generate_itinerary(
        db=db,
        destination_id=barcelona.id,
        start_date=date(2026, 6, 1),
        end_date=date(2026, 6, 1),
        budget=200.0,
        interests=["food"],
    )
    for day in itinerary.days:
        for item in day.items:
            assert item.activity.category == "food"


def test_item_times_are_ordered(db, barcelona, activities):
    itinerary = generate_itinerary(
        db=db,
        destination_id=barcelona.id,
        start_date=date(2026, 6, 1),
        end_date=date(2026, 6, 1),
        budget=200.0,
        interests=["culture", "food", "nature", "adventure"],
    )
    for day in itinerary.days:
        times = [(item.start_time, item.end_time) for item in day.items]
        for i in range(1, len(times)):
            assert times[i][0] >= times[i - 1][1]


def test_invalid_destination_raises(db):
    with pytest.raises(ValueError, match="not found"):
        generate_itinerary(
            db=db,
            destination_id=9999,
            start_date=date(2026, 6, 1),
            end_date=date(2026, 6, 1),
            budget=200.0,
            interests=["culture"],
        )
