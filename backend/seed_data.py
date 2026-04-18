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
db.flush()

asturias = Destination(name="Asturias", country="Spain", lat=43.3614, lon=-5.8593, timezone="Europe/Madrid")
db.add(asturias)
db.flush()

asturias_activities = [
    # Aventura (Naturaller)
    Activity(destination_id=asturias.id, name="Descenso de Barrancos Nivel 1 · Naturaller", category="adventure",
             lat=43.2506, lon=-6.0127, opening_time=900, closing_time=1700,
             duration_minutes=120, price=38.0, rating=4.7,
             description="Iniciación al barranquismo en los cañones de Proaza. 4 rápeles, equipo técnico, seguro y guía oficial AEGM incluidos. Apto desde 10 años."),
    Activity(destination_id=asturias.id, name="Descenso de Barrancos Nivel 2 · Naturaller", category="adventure",
             lat=43.2506, lon=-6.0127, opening_time=900, closing_time=1700,
             duration_minutes=180, price=45.0, rating=4.7,
             description="Nivel fácil: 5 rápeles en barrancos de Oviedo y Proaza. Grupos reducidos, guía certificado, seguro incluido."),
    Activity(destination_id=asturias.id, name="Descenso de Barrancos Nivel 3 · Naturaller", category="adventure",
             lat=43.2506, lon=-6.0127, opening_time=900, closing_time=1700,
             duration_minutes=240, price=53.0, rating=4.8,
             description="Nivel medio: 6 rápeles, 3,5-4 h de aventura en los mejores barrancos de Asturias."),
    Activity(destination_id=asturias.id, name="Kayak Río Nalón · Naturaller", category="adventure",
             lat=43.3287, lon=-5.9871, opening_time=900, closing_time=1800,
             duration_minutes=105, price=35.0, rating=4.6,
             description="Descenso en canoa por el Nalón entre Las Caldas y Trubia. Apto desde 8 años y saber nadar."),
    Activity(destination_id=asturias.id, name="Mountain Bike Guiado · Naturaller", category="adventure",
             lat=43.3614, lon=-5.8593, opening_time=900, closing_time=1800,
             duration_minutes=240, price=45.0, rating=4.5,
             description="Ruta en BTT guiada por la Cordillera Cantábrica. Transfer, mecánico en ruta y GPS incluidos."),
    Activity(destination_id=asturias.id, name="Raquetas de Nieve Nivel Iniciación · Naturaller", category="adventure",
             lat=43.0406, lon=-5.5628, opening_time=1100, closing_time=1500,
             duration_minutes=120, price=25.0, rating=4.5,
             description="Ruta en raquetas de nieve en Puerto San Isidro. Guía, seguro, raquetas y caldo caliente incluidos."),
    Activity(destination_id=asturias.id, name="Ruta Nocturna Raquetas de Nieve · Naturaller", category="adventure",
             lat=43.0281, lon=-5.7822, opening_time=1800, closing_time=2200,
             duration_minutes=150, price=32.0, rating=4.8,
             description="Sube en telecabina a Cuitu Nigru (1.862 m) y camina bajo la luna llena en Pajares. Vistas del Pico Ubiña y el Faro de Cabo Peñas."),
    # Naturaleza
    Activity(destination_id=asturias.id, name="Trekking Picos de Europa · Naturaller", category="nature",
             lat=43.1734, lon=-4.8536, opening_time=800, closing_time=2000,
             duration_minutes=480, price=240.0, rating=4.9,
             description="Travesía 2 días por el macizo central: Torrecerredo, Naranjo de Bulnes y Cabrones. Alojamiento, guía y seguro incluidos."),
    Activity(destination_id=asturias.id, name="Senderismo con Niños · Naturaller", category="nature",
             lat=43.3614, lon=-5.8593, opening_time=1000, closing_time=1700,
             duration_minutes=180, price=20.0, rating=4.6,
             description="Rutas temáticas guiadas para niños: orientación, flora y fauna. Apto desde 4 años."),
    Activity(destination_id=asturias.id, name="Lago Enol y Lago Ercina · Covadonga", category="nature",
             lat=43.2744, lon=-4.9839, opening_time=900, closing_time=2000,
             duration_minutes=150, price=0.0, rating=4.8,
             description="Lagos glaciares en el corazón de los Picos de Europa. Rutas fáciles y vistas a los picos nevados."),
    Activity(destination_id=asturias.id, name="Playa de Rodiles", category="nature",
             lat=43.4975, lon=-5.3564, opening_time=800, closing_time=2100,
             duration_minutes=120, price=0.0, rating=4.7,
             description="Una de las mejores playas de Asturias: extensa, virgen, con bosques y el estuario de Villaviciosa."),
    Activity(destination_id=asturias.id, name="Playa de Torimbia", category="nature",
             lat=43.4571, lon=-4.5254, opening_time=900, closing_time=2000,
             duration_minutes=120, price=0.0, rating=4.6,
             description="Cala natural semivirgen en Llanes, rodeada de acantilados verdes. Acceso a pie por camino de montaña."),
    Activity(destination_id=asturias.id, name="Ruta del Alba · Senda Fluvial", category="nature",
             lat=43.3287, lon=-6.1832, opening_time=900, closing_time=1900,
             duration_minutes=180, price=0.0, rating=4.7,
             description="Paseo junto al río Alba entre bosques atlánticos, molinos medievales y cascadas. 12 km sin desnivel."),
    # Cultura
    Activity(destination_id=asturias.id, name="Catedral de Oviedo y Cámara Santa", category="culture",
             lat=43.3622, lon=-5.8449, opening_time=1000, closing_time=1900,
             duration_minutes=60, price=5.0, rating=4.8,
             description="La Cámara Santa guarda la Cruz de los Ángeles y la de la Victoria. Patrimonio UNESCO."),
    Activity(destination_id=asturias.id, name="Prerrománico Asturiano: Naranco", category="culture",
             lat=43.3787, lon=-5.8749, opening_time=930, closing_time=1800,
             duration_minutes=90, price=3.0, rating=4.7,
             description="Santa María del Naranco y San Miguel de Lillo, joyas del arte asturiano del s. IX. UNESCO."),
    Activity(destination_id=asturias.id, name="Basílica de Covadonga", category="culture",
             lat=43.3030, lon=-4.9993, opening_time=900, closing_time=2100,
             duration_minutes=60, price=0.0, rating=4.7,
             description="Santuario neorrománico en plena montaña asturiana, inicio simbólico de la Reconquista."),
    Activity(destination_id=asturias.id, name="Casco Histórico de Oviedo", category="culture",
             lat=43.3614, lon=-5.8449, opening_time=1000, closing_time=2100,
             duration_minutes=90, price=0.0, rating=4.5,
             description="Paseo por la Plaza de la Catedral, El Fontán y las esculturas de Botero repartidas por la ciudad."),
    # Gastronomía
    Activity(destination_id=asturias.id, name="Sidrería El Gaitero · Oviedo", category="food",
             lat=43.3618, lon=-5.8455, opening_time=1330, closing_time=2300,
             duration_minutes=90, price=25.0, rating=4.6,
             description="Sidra natural escanciada y tabla de quesos DOP: Cabrales, Gamonéu y Afuega'l Pitu."),
    Activity(destination_id=asturias.id, name="Mercado El Fontán · Oviedo", category="food",
             lat=43.3607, lon=-5.8470, opening_time=900, closing_time=1400,
             duration_minutes=60, price=15.0, rating=4.5,
             description="El mercado más antiguo de Oviedo (s. XVII): embutidos, quesos artesanos y conservas del Principado."),
    Activity(destination_id=asturias.id, name="Fabada Asturiana en Casa Fermín", category="food",
             lat=43.3618, lon=-5.8455, opening_time=1400, closing_time=1600,
             duration_minutes=90, price=35.0, rating=4.8,
             description="La fabada más famosa de Oviedo: fabes con compango (chorizo, morcilla y lacón). Desde 1924."),
    Activity(destination_id=asturias.id, name="Cachopo y Queso Cabrales", category="food",
             lat=43.3614, lon=-5.8593, opening_time=1330, closing_time=2200,
             duration_minutes=75, price=28.0, rating=4.5,
             description="Cachopo (filete empanado relleno) y tabla de quesos asturianos con sidra natural. El plato estrella de Asturias."),
]

db.add_all(asturias_activities)
db.commit()
db.close()
print("Database seeded with 3 destinations and activities.")
