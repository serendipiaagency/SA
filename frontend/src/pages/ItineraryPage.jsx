import { useState } from 'react';
import ActivityCard from '../components/ActivityCard.jsx';
import MapView from '../components/MapView.jsx';

const MONTHS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

const DEST_PHOTO = {
  'Barcelona':'1583422409516-2895a77efded', 'Lisboa':'1548707309-dcebeab9ea9b',
  'Asturias':'1567359430882-fa16c5b9cbad', 'Madrid':'1543785734-4b6e564642f8',
  'Sevilla':'1559570278-eb8d71d06403', 'Granada':'1555881400-74d7acaacd8b',
  'Valencia':'1529610787-6a6a0c8bb7c4', 'San Sebastián':'1558618666-fcd25c85cd64',
  'Toledo':'1576293602-edd15751b5ac', 'Porto':'1548515173-2b8ed7e7e2f0',
  'Algarve':'1552083974-8f8b1e5f4e9a', 'Sintra':'1559956083-1dde6d77f2c6',
  'Roma':'1552832230-c0197dd311b5', 'Florencia':'1541701494-8de81fc1b6f3',
  'Venecia':'1514890547363-07b40f36e3cc', 'Milán':'1520175480921-4edfa2a4f39c',
  'Nápoles':'1548710149-0a1a2e5c5a24', 'Sicilia·Palermo':'1504512485-e5cd0628b52a',
  'Malta·Valletta':'1559494896-e634a7b4c76c', 'Tirana':'1570831978-c9b39d5db1e5',
  'Riviera Albanesa·Saranda':'1548815867-f7c0a213dd28', 'Ljubljana':'1571406384-2a4b3b23e5c6',
  'Bled':'1501854140801-50d01698950b',
};

const CAT_LABEL = { culture:'Cultura', food:'Gastronomía', nature:'Naturaleza', adventure:'Aventura', shopping:'Compras' };
const CAT_FG    = { culture:'#1565C0', food:'#E65100', nature:'#2E7D32', adventure:'#BF360C', shopping:'#880E4F' };

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function shareItinerary(id) {
  const url = `${window.location.origin}?id=${id}`;
  if (navigator.share) {
    navigator.share({ title: 'Mi itinerario', url });
  } else {
    navigator.clipboard.writeText(url).then(() => alert('¡Enlace copiado!'));
  }
}

export default function ItineraryPage({ itinerary, onReset }) {
  const [mapDays, setMapDays] = useState({});
  const dest = itinerary.destination || {};
  const photoId = DEST_PHOTO[dest.name];
  const heroImg = photoId
    ? `https://images.unsplash.com/photo-${photoId}?w=1400&auto=format&fit=crop&q=80`
    : null;

  function toggleMap(dayNum) {
    setMapDays(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  }

  // Budget calculations
  const catTotals = {};
  const dayTotals = itinerary.days.map(day => {
    let dayCost = 0;
    day.items.forEach(item => {
      const p = item.activity.price || 0;
      const c = item.activity.category;
      catTotals[c] = (catTotals[c] || 0) + p;
      dayCost += p;
    });
    return { day_number: day.day_number, cost: dayCost };
  });

  const totalActivities = itinerary.days.reduce((s, d) => s + d.items.length, 0);
  const days = itinerary.days.length;
  const budgetUsed = itinerary.total_cost;
  const budgetPct = Math.min(100, (budgetUsed / itinerary.budget) * 100);
  const maxCat = Math.max(...Object.values(catTotals), 1);
  const maxDay = Math.max(...dayTotals.map(d => d.cost), 1);

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 640px) {
          .dash-cols { grid-template-columns: 1fr !important; gap: 20px !important; }
          .itin-hero { padding: 80px 16px 36px !important; }
          .itin-title { font-size: 26px !important; }
          .itin-body { padding: 28px 14px 60px !important; }
          .itin-dashboard { padding: 20px 16px !important; }
        }
        @media print {
          .no-print { display: none !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .itin-hero {
            position: static !important;
            padding: 32px 24px 28px !important;
            min-height: auto !important;
          }
          .itin-body { padding: 24px !important; }
          .itin-dashboard { box-shadow: none !important; }
          .day-block { page-break-inside: avoid; margin-bottom: 20px !important; }
          .leaflet-container { display: none !important; }
        }
      `}</style>

      <nav style={s.nav} className="no-print">
        <button style={s.back} onClick={onReset}>← Nuevo plan</button>
        <span style={s.logo}>SA</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={s.printBtn} onClick={() => window.print()}>🖨️ PDF</button>
          <button style={s.shareBtn} onClick={() => shareItinerary(itinerary.id)}>
            🔗 Compartir
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={s.heroStrip} className="itin-hero">
        {heroImg && (
          <img src={heroImg} alt={dest.name} style={s.heroBg}
               onError={e => { e.target.style.display = 'none'; }} />
        )}
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <div style={s.pills}>
            <span style={s.pill}>📅 {fmtDate(itinerary.start_date)} → {fmtDate(itinerary.end_date)}</span>
            <span style={s.pill}>🗓 {days} día{days !== 1 ? 's' : ''}</span>
            <span style={s.pill}>📍 {totalActivities} actividades</span>
            <span style={{ ...s.pill, background: '#F59E0B', color: '#1A1A1A', fontWeight: 700 }}>
              💶 €{budgetUsed.toFixed(0)} total
            </span>
          </div>
          <h1 style={s.title} className="itin-title">
            {dest.name ? `Tu itinerario en ${dest.name}` : 'Tu itinerario está listo'}
          </h1>
          <p style={s.sub}>Ordenado por proximidad, horarios y presupuesto</p>
        </div>
      </div>

      <div style={s.body} className="itin-body">
        {/* Budget dashboard */}
        <div style={s.dashboard} className="itin-dashboard">
          <h2 style={s.dashTitle}>Resumen de presupuesto</h2>
          <div style={s.totalSection}>
            <div style={s.totalRow}>
              <span style={s.totalLabel}>Actividades</span>
              <span style={s.totalAmt}>€{budgetUsed.toFixed(0)} de €{itinerary.budget}</span>
            </div>
            <div style={s.barTrack}>
              <div style={{ ...s.barFill, width: `${budgetPct}%`, background: budgetPct > 90 ? '#E53E3E' : '#0D3B2E' }} />
            </div>
            <span style={s.totalSub}>
              Disponible: <strong>€{Math.max(0, itinerary.budget - budgetUsed).toFixed(0)}</strong>
            </span>
          </div>
          <div style={s.dashCols} className="dash-cols">
            <div>
              <div style={s.colHead}>Por categoría</div>
              {Object.entries(catTotals).sort((a, b) => b[1] - a[1]).map(([cat, cost]) => (
                <div key={cat} style={s.miniRow}>
                  <span style={{ ...s.miniLabel, color: CAT_FG[cat] }}>{CAT_LABEL[cat] || cat}</span>
                  <div style={s.miniTrack}>
                    <div style={{ ...s.miniFill, width: `${(cost / maxCat) * 100}%`, background: CAT_FG[cat] }} />
                  </div>
                  <span style={s.miniAmt}>€{cost.toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={s.colHead}>Por día</div>
              {dayTotals.map(d => (
                <div key={d.day_number} style={s.miniRow}>
                  <span style={s.miniLabel}>Día {d.day_number}</span>
                  <div style={s.miniTrack}>
                    <div style={{ ...s.miniFill, width: `${(d.cost / maxDay) * 100}%`, background: '#276749' }} />
                  </div>
                  <span style={s.miniAmt}>€{d.cost.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Day blocks */}
        {itinerary.days.map(day => {
          const dayCost = dayTotals.find(d => d.day_number === day.day_number)?.cost || 0;
          const showMap = !!mapDays[day.day_number];
          return (
            <div key={day.day_number} style={s.dayBlock} className="day-block">
              <div style={s.dayHeader}>
                <span style={s.dayNumber}>Día {day.day_number}</span>
                <span style={s.dayDate}>{fmtDate(day.date)}</span>
                <span style={s.dayCost}>€{dayCost.toFixed(0)}</span>
                <span style={s.dayCount}>
                  {day.items.length} actividad{day.items.length !== 1 ? 'es' : ''}
                </span>
                {day.items.length > 0 && (
                  <button
                    className="no-print"
                    style={{ ...s.viewToggle, ...(showMap ? s.viewToggleOn : {}) }}
                    onClick={() => toggleMap(day.day_number)}>
                    {showMap ? '📋 Lista' : '🗺️ Mapa'}
                  </button>
                )}
              </div>

              {day.items.length === 0 ? (
                <p style={s.empty}>Sin actividades para este día con el presupuesto restante.</p>
              ) : showMap ? (
                <div className="no-print">
                  <MapView key={day.day_number} items={day.items} />
                </div>
              ) : (
                day.items.map((item, idx) => (
                  <ActivityCard
                    key={item.activity.id}
                    item={item}
                    isFirst={idx === 0}
                    prevActivity={idx > 0 ? day.items[idx - 1].activity : null}
                  />
                ))
              )}
            </div>
          );
        })}

        <div style={s.cta} className="no-print">
          <button style={s.printCtaBtn} onClick={() => window.print()}>🖨️ Imprimir PDF</button>
          <button style={s.shareCtaBtn} onClick={() => shareItinerary(itinerary.id)}>
            🔗 Compartir itinerario
          </button>
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
    padding: '14px 24px',
    background: 'rgba(255,251,245,0.92)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  },
  back: {
    background: 'none', border: '1.5px solid #E0DDD8', borderRadius: 8,
    padding: '7px 14px', fontSize: 13, fontWeight: 600, color: '#555',
  },
  logo: { fontSize: 20, fontWeight: 900, color: '#0D3B2E' },
  printBtn: {
    background: '#F5F5F0', border: '1.5px solid #E0DDD8', borderRadius: 8,
    padding: '7px 12px', fontSize: 13, fontWeight: 700, color: '#555',
  },
  shareBtn: {
    background: '#F59E0B', border: 'none', borderRadius: 8,
    padding: '7px 14px', fontSize: 13, fontWeight: 700, color: '#1A1A1A',
  },

  heroStrip: {
    background: 'linear-gradient(135deg, #0D3B2E 0%, #276749 100%)',
    padding: '100px 24px 56px', position: 'relative', overflow: 'hidden', minHeight: 300,
  },
  heroBg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 },
  heroOverlay: {
    position: 'absolute', inset: 0, zIndex: 1,
    background: 'linear-gradient(135deg, rgba(13,59,46,0.82) 0%, rgba(39,103,73,0.72) 100%)',
  },
  heroContent: { maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 2 },
  pills: { display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  pill: {
    background: 'rgba(255,255,255,0.15)', color: '#fff',
    fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.2)',
  },
  title: { fontSize: 34, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 10, lineHeight: 1.2 },
  sub: { fontSize: 15, color: 'rgba(255,255,255,0.65)' },

  body: { maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' },

  dashboard: {
    background: '#fff', borderRadius: 20, padding: '28px 32px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)', marginBottom: 48,
    border: '1.5px solid #F0EDE8',
  },
  dashTitle: { fontSize: 17, fontWeight: 800, color: '#0D3B2E', marginBottom: 20 },
  totalSection: { marginBottom: 24 },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 13, fontWeight: 600, color: '#666' },
  totalAmt: { fontSize: 14, fontWeight: 800, color: '#1A1A1A' },
  barTrack: { height: 10, background: '#F0EDE8', borderRadius: 99, overflow: 'hidden', marginBottom: 4 },
  barFill: { height: '100%', borderRadius: 99 },
  totalSub: { fontSize: 12, color: '#999' },
  dashCols: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 },
  colHead: { fontSize: 11, fontWeight: 700, color: '#AAA', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  miniRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  miniLabel: { fontSize: 12, fontWeight: 600, minWidth: 82, color: '#555' },
  miniTrack: { flex: 1, height: 6, background: '#F5F5F0', borderRadius: 99, overflow: 'hidden' },
  miniFill: { height: '100%', borderRadius: 99 },
  miniAmt: { fontSize: 12, fontWeight: 700, color: '#1A1A1A', minWidth: 34, textAlign: 'right' },

  dayBlock: { marginBottom: 48 },
  dayHeader: {
    display: 'flex', alignItems: 'center', gap: 10,
    marginBottom: 20, paddingBottom: 14, borderBottom: '2px solid #F0EDE8', flexWrap: 'wrap',
  },
  dayNumber: { fontSize: 18, fontWeight: 800, color: '#0D3B2E' },
  dayDate: { fontSize: 13, color: '#888', background: '#F5F5F0', padding: '3px 12px', borderRadius: 20 },
  dayCost: {
    fontSize: 12, fontWeight: 700, color: '#92400E',
    background: '#FEF3C7', border: '1px solid #FCD34D', padding: '3px 10px', borderRadius: 20,
  },
  dayCount: { fontSize: 12, color: '#999', marginLeft: 'auto' },
  viewToggle: {
    fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 20,
    border: '1.5px solid #E0DDD8', background: '#FAFAF8', color: '#555',
  },
  viewToggleOn: { background: '#0D3B2E', color: '#fff', borderColor: '#0D3B2E' },
  empty: { color: '#AAA', fontStyle: 'italic', padding: '16px 0' },

  cta: {
    textAlign: 'center', padding: '48px 0 0', borderTop: '1px solid #EEE',
    display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
  },
  printCtaBtn: {
    background: '#F5F5F0', color: '#555', border: '1.5px solid #E0DDD8',
    padding: '14px 24px', borderRadius: 12, fontSize: 15, fontWeight: 700,
  },
  shareCtaBtn: {
    background: '#F59E0B', color: '#1A1A1A', border: 'none',
    padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700,
  },
  ctaBtn: {
    background: '#0D3B2E', color: '#fff', border: 'none',
    padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700,
  },
};
