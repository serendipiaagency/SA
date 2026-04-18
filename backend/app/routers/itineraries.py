from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.destination import Destination
from app.schemas.itinerary import DestinationOut, ItineraryOut, ItineraryRequest
from app.services.itinerary_generator import generate_itinerary

router = APIRouter(prefix="/api/itineraries", tags=["itineraries"])


@router.get("/destinations", response_model=list[DestinationOut])
def list_destinations(db: Session = Depends(get_db)):
    return db.query(Destination).all()


@router.post("", response_model=ItineraryOut, status_code=201)
def create_itinerary(payload: ItineraryRequest, db: Session = Depends(get_db)):
    dest = db.get(Destination, payload.destination_id)
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")

    try:
        itinerary = generate_itinerary(
            db=db,
            destination_id=payload.destination_id,
            start_date=payload.start_date,
            end_date=payload.end_date,
            budget=payload.budget,
            interests=payload.interests,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    return itinerary


@router.get("/{itinerary_id}", response_model=ItineraryOut)
def get_itinerary(itinerary_id: int, db: Session = Depends(get_db)):
    from app.models.itinerary import Itinerary

    itinerary = db.get(Itinerary, itinerary_id)
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return itinerary
