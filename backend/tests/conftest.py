import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.models.destination import Destination
from app.models.activity import Activity

TEST_DATABASE_URL = "sqlite://"  # in-memory


@pytest.fixture(scope="session")
def engine():
    eng = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=eng)
    yield eng
    eng.dispose()


@pytest.fixture()
def db(engine):
    connection = engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection)
    session = Session()
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture()
def client(db):
    app.dependency_overrides[get_db] = lambda: db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def barcelona(db):
    dest = Destination(name="Barcelona", country="Spain", lat=41.3851, lon=2.1734)
    db.add(dest)
    db.flush()
    return dest


@pytest.fixture()
def activities(db, barcelona):
    acts = [
        Activity(destination_id=barcelona.id, name="Sagrada Família", category="culture",
                 lat=41.4036, lon=2.1744, opening_time=900, closing_time=1800,
                 duration_minutes=90, price=26.0, rating=4.9),
        Activity(destination_id=barcelona.id, name="Park Güell", category="nature",
                 lat=41.4145, lon=2.1527, opening_time=800, closing_time=2030,
                 duration_minutes=90, price=10.0, rating=4.6),
        Activity(destination_id=barcelona.id, name="La Boqueria", category="food",
                 lat=41.3818, lon=2.1717, opening_time=800, closing_time=2000,
                 duration_minutes=60, price=15.0, rating=4.4),
        Activity(destination_id=barcelona.id, name="Barceloneta Kayaking", category="adventure",
                 lat=41.3782, lon=2.1922, opening_time=900, closing_time=1800,
                 duration_minutes=120, price=40.0, rating=4.3),
    ]
    db.add_all(acts)
    db.flush()
    return acts
