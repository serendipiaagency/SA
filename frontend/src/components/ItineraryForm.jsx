import { useState, useEffect } from "react";
import { fetchDestinations } from "../api.js";

const INTERESTS = [
  { value: "culture", label: "Culture & History" },
  { value: "food", label: "Food & Drink" },
  { value: "nature", label: "Nature & Parks" },
  { value: "adventure", label: "Adventure & Sports" },
  { value: "shopping", label: "Shopping" },
];

const today = new Date().toISOString().split("T")[0];

export default function ItineraryForm({ onResult, onLoading }) {
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState({
    destination_id: "",
    start_date: today,
    end_date: today,
    budget: 200,
    interests: ["culture", "food"],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDestinations()
      .then(setDestinations)
      .catch(() => setError("Could not load destinations."));
  }, []);

  function toggleInterest(val) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(val)
        ? f.interests.filter((i) => i !== val)
        : [...f.interests, val],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.destination_id) return setError("Please select a destination.");
    if (form.interests.length === 0) return setError("Select at least one interest.");
    if (form.end_date < form.start_date) return setError("End date must be after start date.");

    onLoading(true);
    try {
      const { createItinerary } = await import("../api.js");
      const result = await createItinerary({
        ...form,
        destination_id: parseInt(form.destination_id),
        budget: parseFloat(form.budget),
      });
      onResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      onLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Plan Your Trip</h2>

      <label style={styles.label}>Destination</label>
      <select
        style={styles.input}
        value={form.destination_id}
        onChange={(e) => setForm((f) => ({ ...f, destination_id: e.target.value }))}
      >
        <option value="">Select a destination…</option>
        {destinations.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}, {d.country}
          </option>
        ))}
      </select>

      <div style={styles.row}>
        <div style={styles.col}>
          <label style={styles.label}>Start date</label>
          <input
            type="date"
            style={styles.input}
            value={form.start_date}
            min={today}
            onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
          />
        </div>
        <div style={styles.col}>
          <label style={styles.label}>End date</label>
          <input
            type="date"
            style={styles.input}
            value={form.end_date}
            min={form.start_date}
            onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
          />
        </div>
      </div>

      <label style={styles.label}>Budget (€)</label>
      <div style={styles.budgetRow}>
        <input
          type="range"
          min={50}
          max={2000}
          step={25}
          value={form.budget}
          onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
          style={{ flex: 1 }}
        />
        <span style={styles.budgetValue}>€{form.budget}</span>
      </div>

      <label style={styles.label}>Interests</label>
      <div style={styles.interestGrid}>
        {INTERESTS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => toggleInterest(value)}
            style={{
              ...styles.chip,
              ...(form.interests.includes(value) ? styles.chipActive : {}),
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <button type="submit" style={styles.submit}>
        Generate Itinerary
      </button>
    </form>
  );
}

const styles = {
  form: {
    background: "#fff",
    borderRadius: 16,
    padding: 32,
    maxWidth: 540,
    width: "100%",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  heading: { fontSize: 24, fontWeight: 700, marginBottom: 24, color: "#1a1a1a" },
  label: { display: "block", fontWeight: 600, marginBottom: 6, marginTop: 16, fontSize: 14 },
  input: {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "1.5px solid #e0ddd8", fontSize: 15, background: "#faf9f7",
  },
  row: { display: "flex", gap: 12 },
  col: { flex: 1 },
  budgetRow: { display: "flex", alignItems: "center", gap: 12 },
  budgetValue: { fontWeight: 700, fontSize: 18, minWidth: 60, textAlign: "right" },
  interestGrid: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  chip: {
    padding: "8px 16px", borderRadius: 20, border: "1.5px solid #e0ddd8",
    background: "#faf9f7", cursor: "pointer", fontSize: 13, fontWeight: 500,
    transition: "all 0.15s",
  },
  chipActive: { background: "#1a1a1a", color: "#fff", borderColor: "#1a1a1a" },
  submit: {
    marginTop: 28, width: "100%", padding: "14px 0", borderRadius: 10,
    background: "#1a1a1a", color: "#fff", border: "none", fontSize: 16,
    fontWeight: 700, cursor: "pointer",
  },
  error: { marginTop: 12, color: "#c0392b", fontSize: 14 },
};
