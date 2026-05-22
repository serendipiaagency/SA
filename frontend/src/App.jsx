import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import PlannerPage from './pages/PlannerPage.jsx';
import ItineraryPage from './pages/ItineraryPage.jsx';
import { getItinerary } from './api.js';

const SITE = 'Serendipia Agency';

export default function App() {
  const [view, setView] = useState('home');
  const [selectedDest, setSelectedDest] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loadingShared, setLoadingShared] = useState(false);
  const [sharedError, setSharedError] = useState(false);

  // Dynamic document title
  useEffect(() => {
    if (view === 'itinerary' && itinerary?.destination?.name) {
      document.title = `Itinerario en ${itinerary.destination.name} · ${SITE}`;
    } else if (view === 'planner' && selectedDest?.name) {
      document.title = `Planificar en ${selectedDest.name} · ${SITE}`;
    } else {
      document.title = `Planifica tu viaje · ${SITE}`;
    }
  }, [view, selectedDest, itinerary]);

  // Load shared itinerary from ?id= URL param
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) {
      setLoadingShared(true);
      getItinerary(id)
        .then(itin => { setItinerary(itin); setView('itinerary'); })
        .catch(() => setSharedError(true))
        .finally(() => setLoadingShared(false));
    }
  }, []);

  function handlePickDest(dest) {
    setSelectedDest(dest);
    setView('planner');
  }

  function handleItinerary(itin) {
    setItinerary(itin);
    setView('itinerary');
    window.history.pushState({}, '', `?id=${itin.id}`);
    try {
      const dest = itin.destination || {};
      const saved = JSON.parse(localStorage.getItem('sa_trips') || '[]');
      const entry = {
        id: itin.id, destName: dest.name, country: dest.country,
        startDate: itin.start_date, endDate: itin.end_date,
        totalCost: Math.round(itin.total_cost), savedAt: Date.now(),
      };
      localStorage.setItem('sa_trips', JSON.stringify(
        [entry, ...saved.filter(t => t.id !== itin.id)].slice(0, 10)
      ));
    } catch {}
  }

  async function handleOpenTrip(id) {
    setLoadingShared(true);
    try {
      const itin = await getItinerary(id);
      setItinerary(itin);
      setView('itinerary');
      window.history.pushState({}, '', `?id=${id}`);
    } catch {
      setSharedError(true);
    } finally {
      setLoadingShared(false);
    }
  }

  function handleReset() {
    setItinerary(null);
    setSelectedDest(null);
    setView('home');
    window.history.pushState({}, '', '/');
  }

  if (loadingShared) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div style={splash}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🗺️</div>
          <p style={{ color: '#666', fontSize: 16 }}>Cargando itinerario…</p>
        </div>
      </>
    );
  }

  if (sharedError) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div style={splash}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 8 }}>
            Itinerario no encontrado
          </h2>
          <p style={{ color: '#666', marginBottom: 28, fontSize: 15 }}>
            El enlace puede haber expirado o ser incorrecto.
          </p>
          <button
            onClick={() => { setSharedError(false); window.history.pushState({}, '', '/'); }}
            style={{ background: '#0D3B2E', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700 }}>
            Volver al inicio
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {view === 'home' && <HomePage onPickDest={handlePickDest} onOpenTrip={handleOpenTrip} />}
      {view === 'planner' && (
        <PlannerPage destination={selectedDest} onResult={handleItinerary} onBack={() => setView('home')} />
      )}
      {view === 'itinerary' && (
        <ItineraryPage itinerary={itinerary} onReset={handleReset} />
      )}
    </>
  );
}

const splash = {
  minHeight: '100vh', display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  background: '#FFFBF5', textAlign: 'center', padding: 40,
};

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #FFFBF5; color: #1A1A1A; }
  button { font-family: inherit; cursor: pointer; }
  input, select { font-family: inherit; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-up { animation: fadeUp 0.5s ease both; }
  .leaflet-container { font-family: 'Segoe UI', system-ui, sans-serif !important; }
`;
