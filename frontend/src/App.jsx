import { useState } from "react";
import ItineraryForm from "./components/ItineraryForm.jsx";
import ItineraryDisplay from "./components/ItineraryDisplay.jsx";

export default function App() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <span style={styles.logo}>SA</span>
        <span style={styles.tagline}>Serendipia Agency — Itinerary Planner</span>
      </header>

      <main style={styles.main}>
        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Building your itinerary…</p>
          </div>
        )}

        {!loading && !itinerary && (
          <ItineraryForm onResult={setItinerary} onLoading={setLoading} />
        )}

        {!loading && itinerary && (
          <ItineraryDisplay itinerary={itinerary} onReset={() => setItinerary(null)} />
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column" },
  header: {
    padding: "20px 32px", borderBottom: "1px solid #e0ddd8",
    display: "flex", alignItems: "center", gap: 16, background: "#fff",
  },
  logo: { fontSize: 22, fontWeight: 900, letterSpacing: -1 },
  tagline: { fontSize: 14, color: "#888" },
  main: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    padding: "48px 24px",
  },
  loadingOverlay: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
  },
  spinner: {
    width: 48, height: 48, border: "4px solid #e0ddd8",
    borderTopColor: "#1a1a1a", borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { color: "#555", fontSize: 16 },
};
