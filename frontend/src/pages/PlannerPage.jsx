import { useState, useEffect } from 'react';
import { createItinerary } from '../api.js';

const LOADING_STEPS = [
  '🗺️ Analizando destino…',
  '⭐ Seleccionando las mejores actividades…',
  '📍 Optimizando la ruta…',
  '✨ Casi listo…',
];

const INTERESTS = [
  { value: 'culture',   label: 'Cultura',     emoji: '🏛' },
  { value: 'food',      label: 'Gastronomía', emoji: '🍽' },
  { value: 'nature',    label: 'Naturaleza',  emoji: '🌿' },
  { value: 'adventure', label: 'Aventura',    emoji: '🧗' },
  { value: 'shopping',  label: 'Compras',     emoji: '🛍' },
];

const DEST_PHOTO = {
  'Barcelona':'1583422409516-2895a77efded','Lisboa':'1548707309-dcebeab9ea9b',
  'Asturias':'1567359430882-fa16c5b9cbad','Madrid':'1543785734-4b6e564642f8',
  'Sevilla':'1559570278-eb8d71d06403','Granada':'1555881400-74d7acaacd8b',
  'Valencia':'1529610787-6a6a0c8bb7c4','San Sebastián':'1558618666-fcd25c85cd64',
  'Toledo':'1576293602-edd15751b5ac','Porto':'1548515173-2b8ed7e7e2f0',
  'Algarve':'1552083974-8f8b1e5f4e9a','Sintra':'1559956083-1dde6d77f2c6',
  'Roma':'1552832230-c0197dd311b5','Florencia':'1541701494-8de81fc1b6f3',
  'Venecia':'1514890547363-07b40f36e3cc','Milán':'1520175480921-4edfa2a4f39c',
  'Nápoles':'1548710149-0a1a2e5c5a24','Sicilia·Palermo':'1504512485-e5cd0628b52a',
  'Malta·Valletta':'1559494896-e634a7b4c76c','Tirana':'1570831978-c9b39d5db1e5',
  'Riviera Albanesa·Saranda':'1548815867-f7c0a213dd28','Ljubljana':'1571406384-2a4b3b23e5c6',
  'Bled':'1501854140801-50d01698950b',
};

const today = new Date().toISOString().split('T')[0];

export default function PlannerPage({ destination, onResult, onBack }) {
  const [form, setForm] = useState({
    start_date: today,
    end_date: today,
    budget: 300,
    interests: ['culture', 'food', 'nature'],
    travelers: 2,
  });
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading) { setLoadingStep(0); return; }
    const t = setInterval(() => setLoadingStep(s => (s + 1) % LOADING_STEPS.length), 900);
    return () => clearInterval(t);
  }, [loading]);

  function toggleInterest(val) {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(val)
        ? f.interests.filter(i => i !== val)
        : [...f.interests, val],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.interests.length === 0) return setError('Selecciona al menos un interés.');
    setError('');
    setLoading(true);
    try {
      const result = await createItinerary({
        destination_id: destination.id,
        start_date: form.start_date,
        end_date: form.end_date,
        budget: form.budget * form.travelers,
        interests: form.interests,
      });
      onResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const days = Math.max(0, (new Date(form.end_date) - new Date(form.start_date)) / 86400000) + 1;
  const totalBudget = form.budget * form.travelers;
  const photoId = DEST_PHOTO[destination.name];
  const heroImg = photoId
    ? `https://images.unsplash.com/photo-${photoId}?w=900&auto=format&fit=crop&q=75`
    : null;

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 768px) {
          .planner-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            padding: 64px 0 0 !important;
            max-width: 100% !important;
          }
          .planner-left { min-height: 260px !important; border-radius: 0 !important; }
          .planner-form { border-radius: 0 !important; box-shadow: none !important; border-top: 2px solid #F0EDE8 !important; }
        }
      `}</style>

      <nav style={s.nav}>
        <button style={s.back} onClick={onBack}>← Volver</button>
        <span style={s.logo}>SA</span>
      </nav>

      <div style={s.content} className="planner-grid">
        {/* Left: destination hero */}
        <div
          className="planner-left"
          style={{
            ...s.left,
            ...(heroImg ? { backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
          }}
        >
          <div style={s.leftOverlay}>
            <span style={s.destLabel}>{destination.country}</span>
            <h1 style={s.destName}>{destination.name}</h1>
            <p style={s.destSub}>Personaliza tu viaje y generamos el itinerario optimizado</p>
            <div style={s.summaryBox}>
              <div style={s.summaryItem}>
                <span style={s.summaryIcon}>📅</span>
                <div>
                  <div style={s.summaryLabel}>Duración</div>
                  <div style={s.summaryVal}>{days} día{days !== 1 ? 's' : ''}</div>
                </div>
              </div>
              <div style={s.summaryItem}>
                <span style={s.summaryIcon}>💶</span>
                <div>
                  <div style={s.summaryLabel}>Presupuesto total</div>
                  <div style={s.summaryVal}>
                    €{totalBudget}
                    {form.travelers > 1 && <span style={s.summaryHint}>&nbsp;·&nbsp;€{form.budget}/persona</span>}
                  </div>
                </div>
              </div>
              <div style={s.summaryItem}>
                <span style={s.summaryIcon}>👥</span>
                <div>
                  <div style={s.summaryLabel}>Viajeros</div>
                  <div style={s.summaryVal}>{form.travelers} {form.travelers === 1 ? 'persona' : 'personas'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <form style={s.form} className="planner-form" onSubmit={handleSubmit}>
          <div style={s.fieldGroup}>
            <label style={s.label}>¿Cuándo viajas?</label>
            <div style={s.dateRow}>
              <div style={s.dateCol}>
                <span style={s.dateHint}>Llegada</span>
                <input type="date" style={s.input} value={form.start_date} min={today}
                  onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div style={s.dateSep}>→</div>
              <div style={s.dateCol}>
                <span style={s.dateHint}>Salida</span>
                <input type="date" style={s.input} value={form.end_date} min={form.start_date}
                  onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
              </div>
            </div>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Número de viajeros</label>
            <div style={s.travelerRow}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <button key={n} type="button"
                  style={{ ...s.travBtn, ...(form.travelers === n ? s.travBtnOn : {}) }}
                  onClick={() => setForm(f => ({ ...f, travelers: n }))}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>
              Presupuesto por persona&nbsp;
              <strong style={{ color: '#0D3B2E' }}>€{form.budget}</strong>
              {form.travelers > 1 && (
                <span style={s.budgetTotal}>&nbsp;· €{totalBudget} total</span>
              )}
            </label>
            <input type="range" min={50} max={1000} step={25} value={form.budget}
              style={s.range}
              onChange={e => setForm(f => ({ ...f, budget: Number(e.target.value) }))} />
            <div style={s.rangeLabels}><span>€50</span><span>€1.000</span></div>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>¿Qué quieres hacer?</label>
            <div style={s.chips}>
              {INTERESTS.map(({ value, label, emoji }) => {
                const active = form.interests.includes(value);
                return (
                  <button key={value} type="button"
                    style={{ ...s.chip, ...(active ? s.chipOn : {}) }}
                    onClick={() => toggleInterest(value)}>
                    {emoji} {label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p style={s.error}>{error}</p>}

          <button type="submit" style={s.submit} disabled={loading}>
            ✨ Generar mi itinerario
          </button>
        </form>
      </div>

      {/* Full-screen loading overlay */}
      {loading && (
        <div style={s.overlay}>
          {heroImg && (
            <img src={heroImg} alt="" style={s.overlayBg} />
          )}
          <div style={s.overlayDark} />
          <div style={s.overlayCard}>
            <div style={s.overlaySpinner} />
            <div style={s.overlayCountry}>{destination.country}</div>
            <h3 style={s.overlayDest}>{destination.name}</h3>
            <p style={s.overlayStep}>{LOADING_STEPS[loadingStep]}</p>
          </div>
        </div>
      )}
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

  content: {
    maxWidth: 1100, margin: '0 auto', padding: '80px 24px 64px',
    display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 0, alignItems: 'stretch',
  },

  left: {
    background: 'linear-gradient(135deg, #0D3B2E 0%, #276749 100%)',
    borderRadius: '20px 0 0 20px',
    overflow: 'hidden',
    position: 'relative',
    minHeight: 540,
  },
  leftOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(160deg, rgba(13,59,46,0.55) 0%, rgba(13,59,46,0.92) 60%)',
    padding: '40px 36px',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
  },
  destLabel: {
    fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8,
  },
  destName: { fontSize: 42, fontWeight: 900, letterSpacing: -1.5, color: '#fff', margin: '0 0 10px' },
  destSub: { fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: 28 },
  summaryBox: {
    background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
    borderRadius: 16, padding: '18px 22px',
    border: '1px solid rgba(255,255,255,0.15)',
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  summaryItem: { display: 'flex', alignItems: 'center', gap: 14 },
  summaryIcon: { fontSize: 22 },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryVal: { fontSize: 16, fontWeight: 700, color: '#fff' },
  summaryHint: { fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.55)' },

  form: {
    background: '#fff', borderRadius: '0 20px 20px 0', padding: '40px',
    boxShadow: '8px 0 40px rgba(0,0,0,0.06)',
  },
  fieldGroup: { marginBottom: 28 },
  label: { display: 'block', fontWeight: 700, fontSize: 14, marginBottom: 10, color: '#1A1A1A' },
  budgetTotal: { fontWeight: 400, color: '#888', fontSize: 13 },
  dateRow: { display: 'flex', alignItems: 'center', gap: 12 },
  dateCol: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 },
  dateHint: { fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  dateSep: { fontWeight: 700, color: '#CCC', paddingTop: 20 },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: '1.5px solid #E8E5E0', fontSize: 14, background: '#FAFAF8',
  },
  travelerRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  travBtn: {
    width: 42, height: 42, borderRadius: 10, border: '1.5px solid #E8E5E0',
    background: '#FAFAF8', fontSize: 15, fontWeight: 700, color: '#555',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  travBtnOn: { background: '#0D3B2E', color: '#fff', borderColor: '#0D3B2E' },
  range: { width: '100%', accentColor: '#0D3B2E' },
  rangeLabels: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999', marginTop: 6 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  chip: {
    padding: '10px 18px', borderRadius: 50, border: '1.5px solid #E8E5E0',
    background: '#FAFAF8', fontSize: 14, fontWeight: 600, color: '#555',
  },
  chipOn: { background: '#0D3B2E', color: '#fff', borderColor: '#0D3B2E' },
  error: { color: '#C53030', fontSize: 14, marginBottom: 16 },
  submit: {
    width: '100%', padding: '16px', borderRadius: 12,
    background: '#F59E0B', border: 'none', fontSize: 17, fontWeight: 800,
    color: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  },

  overlay: {
    position: 'fixed', inset: 0, zIndex: 300,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  overlayBg: {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover', filter: 'blur(18px) brightness(0.45)', transform: 'scale(1.08)',
  },
  overlayDark: {
    position: 'absolute', inset: 0,
    background: 'rgba(13,59,46,0.55)',
  },
  overlayCard: {
    position: 'relative', zIndex: 1,
    background: '#fff', borderRadius: 24, padding: '48px 52px',
    textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
    maxWidth: 380, width: '90%',
  },
  overlaySpinner: {
    width: 52, height: 52, borderRadius: '50%',
    border: '4px solid #F0EDE8', borderTopColor: '#0D3B2E',
    animation: 'spin 0.9s linear infinite',
    margin: '0 auto 28px',
  },
  overlayCountry: {
    fontSize: 12, fontWeight: 700, color: '#999',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6,
  },
  overlayDest: {
    fontSize: 26, fontWeight: 900, color: '#0D3B2E', marginBottom: 20, letterSpacing: -0.5,
  },
  overlayStep: {
    fontSize: 15, color: '#666', minHeight: 24,
  },
};
