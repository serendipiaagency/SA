from datetime import date


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_list_destinations_empty(client):
    r = client.get("/api/itineraries/destinations")
    assert r.status_code == 200
    assert r.json() == []


def test_list_destinations(client, barcelona):
    r = client.get("/api/itineraries/destinations")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 1
    assert data[0]["name"] == "Barcelona"


def test_create_itinerary_not_found(client):
    r = client.post("/api/itineraries", json={
        "destination_id": 9999,
        "start_date": "2026-06-01",
        "end_date": "2026-06-02",
        "budget": 200,
        "interests": ["culture"],
    })
    assert r.status_code == 404


def test_create_itinerary_success(client, barcelona, activities):
    r = client.post("/api/itineraries", json={
        "destination_id": barcelona.id,
        "start_date": "2026-06-01",
        "end_date": "2026-06-02",
        "budget": 300,
        "interests": ["culture", "food", "nature", "adventure"],
    })
    assert r.status_code == 201
    data = r.json()
    assert data["destination_id"] == barcelona.id
    assert len(data["days"]) == 2
    assert data["total_cost"] <= 300


def test_create_itinerary_invalid_interest(client, barcelona):
    r = client.post("/api/itineraries", json={
        "destination_id": barcelona.id,
        "start_date": "2026-06-01",
        "end_date": "2026-06-01",
        "budget": 200,
        "interests": ["disco"],
    })
    assert r.status_code == 422


def test_create_itinerary_invalid_dates(client, barcelona):
    r = client.post("/api/itineraries", json={
        "destination_id": barcelona.id,
        "start_date": "2026-06-05",
        "end_date": "2026-06-01",
        "budget": 200,
        "interests": ["culture"],
    })
    assert r.status_code == 422


def test_get_itinerary(client, barcelona, activities):
    create = client.post("/api/itineraries", json={
        "destination_id": barcelona.id,
        "start_date": "2026-06-01",
        "end_date": "2026-06-01",
        "budget": 200,
        "interests": ["culture"],
    })
    itinerary_id = create.json()["id"]
    r = client.get(f"/api/itineraries/{itinerary_id}")
    assert r.status_code == 200
    assert r.json()["id"] == itinerary_id


def test_get_itinerary_not_found(client):
    r = client.get("/api/itineraries/99999")
    assert r.status_code == 404
