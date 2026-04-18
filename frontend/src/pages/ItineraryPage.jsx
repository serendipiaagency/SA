import ActivityCard from '../components/ActivityCard.jsx';

const MONTHS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export default function ItineraryPage({ itinerary, onReset }) {
  const totalActivities = itinerary.days.reduce((s, d) => s + d.items.length, 0);
  const days = itinerary.days.length;

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <button style={s.back} onClick={onReset}>← Nuevo plan</button>
        <span style={s.logo}>SA</span>
      </nav>

      <div style={s.heroStrip}>
        <div style={s.heroContent}>
          <div style={s.pills}>
            <span style={s.pill}>📅 {fmtDate(itinerary.start_date)} → {fmtDate(itinerary.end_date)}</span>
            <span style={s.pill}>🗓 {days} día{days !== 1 ? 's' : ''}</span>
            <span style={s.pill}>📍 {totalActivities} actividades</span>
            <span style={{ ...s.pill, background: '#F59E0B', color: '#1A1A1A', fontWeight: 700 }}>
              💶 €{itinerary.total_cost.toFixed(0)} total
            </span>
          </div>
          <h1 style={s.title}>Tu itinerario está listo</h1>
          <p style={s.sub}>Optimizado por proximidad, horarios y presupuesto</p>
        </div>
      </div>

      <div style={s.body}>
        {itinerary.days.map(day => (
          <div key={day.day_number} style={s.dayBlock}>
            <div style={s.dayHeader}>
              <span style={s.dayNumber}>Día {day.day_number}</span>
              <span style={s.dayDate}>{fmtDate(day.date)}</span>
              <span style={s.dayCount}>{day.items.length} actividade{day.items.length !== 1 ? 's' : ''}</span>
            </div>

            {day.items.length === 0
              ? <p style={s.empty}>Sin actividades para este día con el presupuesto restante.</p>
              : day.items.map((item, idx) => (
                  <ActivityCard key={item.activity.id} item={item} isFirst={idx === 0} />
                ))
            }
          </div>
        ))}

        <div style={s.cta}>
          <p style={s.ctaSub}>¿Te gusta? Compártelo o planifica otro viaje</p>
          <button style={s.ctaBtn} onClick={onReset}>Planificar nuevo viaje →</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#FFFBF5' },
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 32px',
    background: 'rgba(255,251,245,0.9)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  },
  back: {
    background: 'none', border: '1.5px solid #E0DDD8', borderRadius: 8,
    padding: '8px 16px', fontSize: 14, fontWeight: 600, color: '#555',
  },
  logo: { fontSize: 20, fontWeight: 900, color: '#0D3B2E' },
  heroStrip: {
    background: 'linear-gradient(135deg, #0D3B2E 0%, #276749 100%)',
    padding: '100px 24px 56px',
  },
  heroContent: { maxWidth: 760, margin: '0 auto' },
  pills: { display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  pill: {
    background: 'rgba(255,255,255,0.15)', color: '#fff',
    fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.2)',
  },
  title: { fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 10 },
  sub: { fontSize: 15, color: 'rgba(255,255,255,0.65)' },

  body: { maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' },
  dayBlock: { marginBottom: 56 },
  dayHeader: {
    display: 'flex', alignItems: 'center', gap: 12,
    marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #F0EDE8',
  },
  dayNumber: { fontSize: 20, fontWeight: 800, color: '#0D3B2E' },
  dayDate: {
    fontSize: 14, color: '#888', background: '#F5F5F0',
    padding: '4px 12px', borderRadius: 20,
  },
  dayCount: { fontSize: 13, color: '#999', marginLeft: 'auto' },
  empty: { color: '#AAA', fontStyle: 'italic', padding: '16px 0' },

  cta: {
    textAlign: 'center', padding: '48px 0 0',
    borderTop: '1px solid #EEE',
  },
  ctaSub: { color: '#888', fontSize: 15, marginBottom: 20 },
  ctaBtn: {
    background: '#0D3B2E', color: '#fff', border: 'none',
    padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700,
  },
};
