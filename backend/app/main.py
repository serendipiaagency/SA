from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import Destination, Activity, Itinerary, ItineraryDay, ItineraryItem  # noqa: F401 — registers models
from app.routers import itineraries

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SA Itinerary API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(itineraries.router)


@app.get("/health")
def health():
    return {"status": "ok"}
