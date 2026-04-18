from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    budget = Column(Float, nullable=False)
    interests = Column(String, nullable=False)  # comma-separated categories
    total_cost = Column(Float, default=0.0)
    created_at = Column(DateTime, server_default=func.now())

    destination = relationship("Destination", back_populates="itineraries")
    days = relationship("ItineraryDay", back_populates="itinerary", order_by="ItineraryDay.day_number")


class ItineraryDay(Base):
    __tablename__ = "itinerary_days"

    id = Column(Integer, primary_key=True, index=True)
    itinerary_id = Column(Integer, ForeignKey("itineraries.id"), nullable=False)
    day_number = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)

    itinerary = relationship("Itinerary", back_populates="days")
    items = relationship("ItineraryItem", back_populates="day", order_by="ItineraryItem.order")


class ItineraryItem(Base):
    __tablename__ = "itinerary_items"

    id = Column(Integer, primary_key=True, index=True)
    day_id = Column(Integer, ForeignKey("itinerary_days.id"), nullable=False)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=False)
    order = Column(Integer, nullable=False)
    start_time = Column(Integer, nullable=False)   # HHMM int
    end_time = Column(Integer, nullable=False)     # HHMM int
    travel_minutes_from_prev = Column(Integer, default=0)

    day = relationship("ItineraryDay", back_populates="items")
    activity = relationship("Activity", back_populates="itinerary_items")
