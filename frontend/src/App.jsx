import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import PlannerPage from './pages/PlannerPage.jsx';
import ItineraryPage from './pages/ItineraryPage.jsx';
import { getItinerary } from './api.js';

export default function App() {
  const [view, setView] = useState('home');
  const [selectedDest, setSelectedDest] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loadingShared, setLoadingShared] = useState(false);

  // Load shared itinerary from ?id= URL param
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) {
      setLoadingShared(true);
      getItinerary(id)
        .then(itin => { setItinerary(itin); setView('itinerary'); })
        .catch(() => {})
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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFBF5' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🗺️</div>
            <p style={{ color: '#666', fontSize: 16 }}>Cargando itinerario…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {view === 'home' && <HomePage onPickDest={handlePickDest} />}
      {view === 'planner' && (
        <PlannerPage destination={selectedDest} onResult={handleItinerary} onBack={() => setView('home')} />
      )}
      {view === 'itinerary' && (
        <ItineraryPage itinerary={itinerary} onReset={handleReset} />
      )}
    </>
  );
}

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
