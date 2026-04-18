from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # culture, food, nature, adventure, shopping
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    opening_time = Column(Integer, default=900)   # HHMM int, e.g. 900 = 09:00
    closing_time = Column(Integer, default=2100)  # HHMM int, e.g. 2100 = 21:00
    duration_minutes = Column(Integer, default=60)
    price = Column(Float, default=0.0)
    description = Column(String, default="")
    rating = Column(Float, default=4.0)

    destination = relationship("Destination", back_populates="activities")
    itinerary_items = relationship("ItineraryItem", back_populates="activity")
