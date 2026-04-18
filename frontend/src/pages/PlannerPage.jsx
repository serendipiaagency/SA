import { useState } from 'react';
import { createItinerary } from '../api.js';

const INTERESTS = [
  { value: 'culture',   label: 'Cultura',     emoji: '🏛' },
  { value: 'food',      label: 'Gastronomía', emoji: '🍽' },
  { value: 'nature',    label: 'Naturaleza',  emoji: '🌿' },
  { value: 'adventure', label: 'Aventura',    emoji: '🧗' },
  { value: 'shopping',  label: 'Compras',     emoji: '🛍' },
];

const today = new Date().toISOString().split('T')[0];

export default function PlannerPage({ destination, onResult, onBack }) {
  const [form, setForm] = useState({
    start_date: today,
    end_date: today,
    budget: 300,
    interests: ['culture', 'food', 'nature'],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        ...form,
        budget: parseFloat(form.budget),
      });
      onResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const days = Math.max(0, (new Date(form.end_date) - new Date(form.start_date)) / 86400000) + 1;

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <button style={s.back} onClick={onBack}>← Volver</button>
        <span style={s.logo}>SA</span>
      </nav>

      <div style={s.content}>
        <div style={s.left}>
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
                <div style={s.summaryLabel}>Presupuesto</div>
                <div style={s.summaryVal}>€{form.budget}</div>
              </div>
            </div>
            <div style={s.summaryItem}>
              <span style={s.summaryIcon}>🎯</span>
              <div>
                <div style={s.summaryLabel}>Intereses</div>
                <div style={s.summaryVal}>{form.interests.length} seleccionados</div>
              </div>
            </div>
          </div>
        </div>

        <form style={s.form} onSubmit={handleSubmit}>
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
            <label style={s.label}>
              Presupuesto total <strong style={{ color: '#0D3B2E' }}>€{form.budget}</strong>
            </label>
            <input type="range" min={50} max={2000} step={25} value={form.budget}
              style={s.range}
              onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
            <div style={s.rangeLabels}><span>€50</span><span>€2.000</span></div>
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
            {loading
              ? <><span style={s.spinner} /> Generando itinerario…</>
              : '✨ Generar mi itinerario'}
          </button>
        </form>
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
  content: {
    maxWidth: 1000, margin: '0 auto', padding: '100px 24px 64px',
    display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'start',
  },
  left: { paddingTop: 24 },
  destLabel: { fontSize: 13, fontWeight: 700, color: '#888', letterSpacing: 1, textTransform: 'uppercase' },
  destName: { fontSize: 48, fontWeight: 900, letterSpacing: -1.5, color: '#0D3B2E', margin: '8px 0 12px' },
  destSub: { fontSize: 16, color: '#666', lineHeight: 1.6, marginBottom: 40 },
  summaryBox: {
    background: '#fff', borderRadius: 16, padding: '20px 24px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 16,
  },
  summaryItem: { display: 'flex', alignItems: 'center', gap: 16 },
  summaryIcon: { fontSize: 28 },
  summaryLabel: { fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryVal: { fontSize: 18, fontWeight: 700, color: '#1A1A1A' },

  form: {
    background: '#fff', borderRadius: 24, padding: '36px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
  },
  fieldGroup: { marginBottom: 32 },
  label: { display: 'block', fontWeight: 700, fontSize: 15, marginBottom: 12, color: '#1A1A1A' },
  dateRow: { display: 'flex', alignItems: 'center', gap: 12 },
  dateCol: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 },
  dateHint: { fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  dateSep: { fontWeight: 700, color: '#CCC', paddingTop: 20 },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: '1.5px solid #E8E5E0', fontSize: 14, background: '#FAFAF8',
  },
  range: { width: '100%', accentColor: '#0D3B2E' },
  rangeLabels: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999', marginTop: 6 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  chip: {
    padding: '10px 18px', borderRadius: 50, border: '1.5px solid #E8E5E0',
    background: '#FAFAF8', fontSize: 14, fontWeight: 600, color: '#555',
    transition: 'all 0.15s',
  },
  chipOn: { background: '#0D3B2E', color: '#fff', borderColor: '#0D3B2E' },
  error: { color: '#C53030', fontSize: 14, marginBottom: 16 },
  submit: {
    width: '100%', padding: '16px', borderRadius: 12,
    background: '#F59E0B', border: 'none', fontSize: 17, fontWeight: 800,
    color: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  spinner: {
    width: 18, height: 18, border: '2px solid rgba(0,0,0,0.2)',
    borderTopColor: '#1A1A1A', borderRadius: '50%',
    display: 'inline-block', animation: 'spin 0.8s linear infinite',
  },
};
