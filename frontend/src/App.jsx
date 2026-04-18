import { useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import PlannerPage from './pages/PlannerPage.jsx';
import ItineraryPage from './pages/ItineraryPage.jsx';

export default function App() {
  const [view, setView] = useState('home'); // home | planner | itinerary
  const [selectedDest, setSelectedDest] = useState(null);
  const [itinerary, setItinerary] = useState(null);

  function handlePickDest(dest) {
    setSelectedDest(dest);
    setView('planner');
  }

  function handleItinerary(itin) {
    setItinerary(itin);
    setView('itinerary');
  }

  function handleReset() {
    setItinerary(null);
    setSelectedDest(null);
    setView('home');
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {view === 'home' && <HomePage onPickDest={handlePickDest} />}
      {view === 'planner' && (
        <PlannerPage
          destination={selectedDest}
          onResult={handleItinerary}
          onBack={() => setView('home')}
        />
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
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-up { animation: fadeUp 0.5s ease both; }
`;
