from datetime import date
from typing import List
from pydantic import BaseModel, field_validator


VALID_INTERESTS = {"culture", "food", "nature", "adventure", "shopping"}


class ItineraryRequest(BaseModel):
    destination_id: int
    start_date: date
    end_date: date
    budget: float
    interests: List[str]

    @field_validator("interests")
    @classmethod
    def validate_interests(cls, v):
        invalid = set(v) - VALID_INTERESTS
        if invalid:
            raise ValueError(f"Invalid interests: {invalid}. Valid: {VALID_INTERESTS}")
        if not v:
            raise ValueError("At least one interest required")
        return v

    @field_validator("end_date")
    @classmethod
    def end_after_start(cls, v, info):
        if "start_date" in info.data and v < info.data["start_date"]:
            raise ValueError("end_date must be >= start_date")
        return v

    @field_validator("budget")
    @classmethod
    def positive_budget(cls, v):
        if v <= 0:
            raise ValueError("budget must be positive")
        return v


class ActivityOut(BaseModel):
    id: int
    name: str
    category: str
    description: str
    price: float
    rating: float
    duration_minutes: int
    lat: float
    lon: float

    model_config = {"from_attributes": True}


class ItineraryItemOut(BaseModel):
    order: int
    start_time: int
    end_time: int
    travel_minutes_from_prev: int
    activity: ActivityOut

    model_config = {"from_attributes": True}


class ItineraryDayOut(BaseModel):
    day_number: int
    date: date
    items: List[ItineraryItemOut]

    model_config = {"from_attributes": True}


class ItineraryOut(BaseModel):
    id: int
    destination_id: int
    start_date: date
    end_date: date
    budget: float
    interests: str
    total_cost: float
    days: List[ItineraryDayOut]

    model_config = {"from_attributes": True}


class DestinationOut(BaseModel):
    id: int
    name: str
    country: str

    model_config = {"from_attributes": True}
