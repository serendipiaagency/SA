import ActivityCard from "./ActivityCard.jsx";

const MONTH = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTH[d.getMonth()]} ${d.getFullYear()}`;
}

export default function ItineraryDisplay({ itinerary, onReset }) {
  const totalDays = itinerary.days.length;
  const totalActivities = itinerary.days.reduce((s, d) => s + d.items.length, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <p style={styles.meta}>
            {formatDate(itinerary.start_date)} — {formatDate(itinerary.end_date)}
          </p>
          <h2 style={styles.title}>Your Itinerary</h2>
          <div style={styles.stats}>
            <span>{totalDays} day{totalDays !== 1 ? "s" : ""}</span>
            <span>·</span>
            <span>{totalActivities} activit{totalActivities !== 1 ? "ies" : "y"}</span>
            <span>·</span>
            <span style={styles.cost}>€{itinerary.total_cost.toFixed(0)} total</span>
          </div>
        </div>
        <button onClick={onReset} style={styles.resetBtn}>New plan</button>
      </div>

      {itinerary.days.map((day) => (
        <div key={day.day_number} style={styles.daySection}>
          <h3 style={styles.dayTitle}>
            Day {day.day_number} — {formatDate(day.date)}
          </h3>
          {day.items.length === 0 ? (
            <p style={styles.empty}>No activities fit your budget or schedule for this day.</p>
          ) : (
            day.items.map((item, idx) => (
              <ActivityCard key={item.activity.id} item={item} isFirst={idx === 0} />
            ))
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: 680, width: "100%", margin: "0 auto" },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 32,
  },
  meta: { fontSize: 13, color: "#888", marginBottom: 4 },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 8 },
  stats: { display: "flex", gap: 8, fontSize: 14, color: "#555" },
  cost: { fontWeight: 700, color: "#2c7a4b" },
  resetBtn: {
    padding: "10px 20px", borderRadius: 8, border: "1.5px solid #e0ddd8",
    background: "#faf9f7", cursor: "pointer", fontSize: 14, fontWeight: 600,
    whiteSpace: "nowrap",
  },
  daySection: { marginBottom: 40 },
  dayTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#333" },
  empty: { color: "#888", fontStyle: "italic" },
};
