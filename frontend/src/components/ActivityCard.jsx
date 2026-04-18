const CATEGORY_EMOJI = {
  culture: "🏛",
  food: "🍽",
  nature: "🌿",
  adventure: "🧗",
  shopping: "🛍",
};

function formatTime(hhmm) {
  const h = Math.floor(hhmm / 100);
  const m = hhmm % 100;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function ActivityCard({ item, isFirst }) {
  const { activity, start_time, end_time, travel_minutes_from_prev } = item;

  return (
    <div style={styles.card}>
      {!isFirst && travel_minutes_from_prev > 0 && (
        <div style={styles.travel}>
          {travel_minutes_from_prev} min travel
        </div>
      )}
      <div style={styles.inner}>
        <div style={styles.timeCol}>
          <span style={styles.time}>{formatTime(start_time)}</span>
          <div style={styles.timeLine} />
          <span style={styles.time}>{formatTime(end_time)}</span>
        </div>
        <div style={styles.content}>
          <div style={styles.categoryBadge}>
            {CATEGORY_EMOJI[activity.category]} {activity.category}
          </div>
          <h4 style={styles.name}>{activity.name}</h4>
          {activity.description && (
            <p style={styles.description}>{activity.description}</p>
          )}
          <div style={styles.meta}>
            <span style={styles.rating}>★ {activity.rating.toFixed(1)}</span>
            <span style={styles.duration}>{activity.duration_minutes} min</span>
            <span style={styles.price}>
              {activity.price > 0 ? `€${activity.price.toFixed(0)}` : "Free"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { marginBottom: 4 },
  travel: {
    textAlign: "center", fontSize: 12, color: "#888", padding: "4px 0",
    borderLeft: "2px dashed #e0ddd8", marginLeft: 48,
  },
  inner: { display: "flex", gap: 16, alignItems: "flex-start" },
  timeCol: {
    display: "flex", flexDirection: "column", alignItems: "center",
    minWidth: 44, paddingTop: 4,
  },
  time: { fontSize: 12, fontWeight: 700, color: "#555" },
  timeLine: { flex: 1, width: 2, background: "#e0ddd8", margin: "4px 0", minHeight: 24 },
  content: {
    flex: 1, background: "#fff", borderRadius: 12, padding: "14px 16px",
    border: "1.5px solid #f0ede8",
  },
  categoryBadge: { fontSize: 11, color: "#888", textTransform: "uppercase", marginBottom: 4 },
  name: { fontSize: 16, fontWeight: 700, marginBottom: 6 },
  description: { fontSize: 13, color: "#555", lineHeight: 1.5, marginBottom: 8 },
  meta: { display: "flex", gap: 12, fontSize: 13 },
  rating: { color: "#e0a500", fontWeight: 600 },
  duration: { color: "#666" },
  price: { fontWeight: 600, color: "#2c7a4b" },
};
