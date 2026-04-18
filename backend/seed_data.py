"""Seed database with sample destinations and activities for testing."""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, Base, engine
from app.models import Destination, Activity

Base.metadata.create_all(bind=engine)

db = SessionLocal()

if db.query(Destination).count() > 0:
    print("Database already seeded.")
    db.close()
    sys.exit(0)

barcelona = Destination(name="Barcelona", country="Spain", lat=41.3851, lon=2.1734, timezone="Europe/Madrid")
lisbon = Destination(name="Lisbon", country="Portugal", lat=38.7169, lon=-9.1395, timezone="Europe/Lisbon")
db.add_all([barcelona, lisbon])
db.flush()

activities = [
    # Barcelona - culture
    Activity(destination_id=barcelona.id, name="Sagrada Família", category="culture",
             lat=41.4036, lon=2.1744, opening_time=900, closing_time=1800,
             duration_minutes=90, price=26.0, rating=4.9,
             description="Gaudí's iconic basilica, a UNESCO World Heritage Site."),
    Activity(destination_id=barcelona.id, name="Museu Picasso", category="culture",
             lat=41.3851, lon=2.1808, opening_time=1000, closing_time=1900,
             duration_minutes=75, price=14.0, rating=4.5,
             description="Extensive collection of Picasso's early works."),
    Activity(destination_id=barcelona.id, name="Palau de la Música Catalana", category="culture",
             lat=41.3875, lon=2.1752, opening_time=1000, closing_time=1530,
             duration_minutes=60, price=20.0, rating=4.7,
             description="Stunning modernista concert hall by Lluís Domènech i Montaner."),
    # Barcelona - food
    Activity(destination_id=barcelona.id, name="La Boqueria Market", category="food",
             lat=41.3818, lon=2.1717, opening_time=800, closing_time=2000,
             duration_minutes=60, price=15.0, rating=4.4,
             description="Vibrant public market with fresh produce and tapas."),
    Activity(destination_id=barcelona.id, name="El Nacional Food Hall", category="food",
             lat=41.3912, lon=2.1651, opening_time=1200, closing_time=2300,
             duration_minutes=90, price=35.0, rating=4.6,
             description="Four restaurants and four bars under one roof."),
    # Barcelona - nature
    Activity(destination_id=barcelona.id, name="Park Güell", category="nature",
             lat=41.4145, lon=2.1527, opening_time=800, closing_time=2030,
             duration_minutes=90, price=10.0, rating=4.6,
             description="Gaudí's colorful park with panoramic city views."),
    Activity(destination_id=barcelona.id, name="Montjuïc Hill & Gardens", category="nature",
             lat=41.3641, lon=2.1598, opening_time=1000, closing_time=1900,
             duration_minutes=120, price=0.0, rating=4.5,
             description="Gardens, castle, and Olympic facilities with sea views."),
    # Barcelona - adventure
    Activity(destination_id=barcelona.id, name="Barceloneta Beach Kayaking", category="adventure",
             lat=41.3782, lon=2.1922, opening_time=900, closing_time=1800,
             duration_minutes=120, price=40.0, rating=4.3,
             description="Sea kayaking along the Barcelona coastline."),
    # Barcelona - shopping
    Activity(destination_id=barcelona.id, name="Passeig de Gràcia Shopping", category="shopping",
             lat=41.3917, lon=2.1650, opening_time=1000, closing_time=2100,
             duration_minutes=90, price=0.0, rating=4.4,
             description="Barcelona's premier luxury shopping boulevard."),
    Activity(destination_id=barcelona.id, name="El Born Boutiques", category="shopping",
             lat=41.3848, lon=2.1819, opening_time=1100, closing_time=2000,
             duration_minutes=60, price=0.0, rating=4.3,
             description="Independent shops, vintage stores, and local designers."),

    # Lisbon - culture
    Activity(destination_id=lisbon.id, name="Museu Nacional do Azulejo", category="culture",
             lat=38.7246, lon=-9.1170, opening_time=1000, closing_time=1800,
             duration_minutes=75, price=5.0, rating=4.7,
             description="Stunning collection of Portuguese tilework in a historic convent."),
    Activity(destination_id=lisbon.id, name="Jerónimos Monastery", category="culture",
             lat=38.6979, lon=-9.2067, opening_time=1000, closing_time=1730,
             duration_minutes=90, price=10.0, rating=4.8,
             description="UNESCO Manueline masterpiece in Belém."),
    # Lisbon - food
    Activity(destination_id=lisbon.id, name="Pastéis de Belém", category="food",
             lat=38.6972, lon=-9.2033, opening_time=800, closing_time=2300,
             duration_minutes=45, price=8.0, rating=4.8,
             description="The original custard tart bakery since 1837."),
    Activity(destination_id=lisbon.id, name="Time Out Market Lisboa", category="food",
             lat=38.7065, lon=-9.1455, opening_time=1000, closing_time=2400,
             duration_minutes=75, price=20.0, rating=4.5,
             description="Best Lisbon chefs under one roof at the iconic Mercado da Ribeira."),
    # Lisbon - nature
    Activity(destination_id=lisbon.id, name="Sintra Palace Day Trip", category="nature",
             lat=38.7978, lon=-9.3903, opening_time=930, closing_time=1800,
             duration_minutes=240, price=20.0, rating=4.9,
             description="Fairy-tale palaces and lush forests in the UNESCO Sintra hills."),
    # Lisbon - adventure
    Activity(destination_id=lisbon.id, name="Tejo River Sailing", category="adventure",
             lat=38.7076, lon=-9.1393, opening_time=1000, closing_time=1800,
             duration_minutes=150, price=55.0, rating=4.5,
             description="Sail on the Tagus with views of the 25 de Abril Bridge."),
    # Lisbon - shopping
    Activity(destination_id=lisbon.id, name="Feira da Ladra Flea Market", category="shopping",
             lat=38.7172, lon=-9.1283, opening_time=900, closing_time=1700,
             duration_minutes=90, price=0.0, rating=4.2,
             description="Lisbon's historic outdoor flea market in Alfama."),
]

db.add_all(activities)
db.commit()
db.close()
print("Database seeded with 2 destinations and activities.")
