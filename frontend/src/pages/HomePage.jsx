import { useState, useEffect } from 'react';
import { fetchDestinations } from '../api.js';

const DEST_THEME = {
  Barcelona: {
    gradient: 'linear-gradient(135deg, #C53030 0%, #E53E3E 60%, #FEB2B2 100%)',
    emoji: '🌊',
    tags: ['Playa', 'Gaudí', 'Gastronomía'],
    tagline: 'Arquitectura, mar y vida mediterránea',
  },
  Lisboa: {
    gradient: 'linear-gradient(135deg, #B7791F 0%, #D69E2E 60%, #F6E05E 100%)',
    emoji: '🚋',
    tags: ['Fados', 'Pastéis', 'Historia'],
    tagline: 'La ciudad de las siete colinas y el Tejo',
  },
  Asturias: {
    gradient: 'linear-gradient(135deg, #276749 0%, #2F855A 60%, #9AE6B4 100%)',
    emoji: '🏔️',
    tags: ['Aventura', 'Sidra', 'Picos de Europa'],
    tagline: 'Naturaleza salvaje, sidra y tradición',
  },
};

const DEFAULT_THEME = {
  gradient: 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)',
  emoji: '🗺️',
  tags: [],
  tagline: 'Descubre este destino',
};

const STEPS = [
  { icon: '📍', title: 'Elige destino', desc: 'Selecciona entre nuestros destinos curados con actividades verificadas.' },
  { icon: '🎯', title: 'Define tu viaje', desc: 'Fechas, presupuesto e intereses: cultura, aventura, gastronomía…' },
  { icon: '✨', title: 'Tu itinerario', desc: 'El algoritmo organiza el mejor orden de visita con tiempos reales.' },
];

export default function HomePage({ onPickDest }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDestinations()
      .then(setDestinations)
      .catch(() => setError('No se pudieron cargar los destinos.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={s.page}>
      {/* NAV */}
      <nav style={s.nav}>
        <span style={s.logo}>SA</span>
        <span style={s.navTag}>Serendipia Agency</span>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroInner} className="fade-up">
          <span style={s.badge}>✦ Itinerarios optimizados por IA</span>
          <h1 style={s.heroTitle}>
            Tu próxima aventura,<br />
            <span style={s.heroAccent}>perfectamente planificada</span>
          </h1>
          <p style={s.heroSub}>
            Elige destino, dinos tus intereses y presupuesto.<br />
            Nosotros construimos el itinerario perfecto para ti.
          </p>
          <a href="#destinos" style={s.heroCta}>
            Explorar destinos ↓
          </a>
        </div>
        <div style={s.heroDecor}>
          {['🏔️', '🌊', '🦋', '🌿', '⛵', '🎭'].map((e, i) => (
            <span key={i} style={{ ...s.floatEmoji, ...floatPos[i] }}>{e}</span>
          ))}
        </div>
      </section>

      {/* DESTINOS */}
      <section id="destinos" style={s.section}>
        <div style={s.sectionHead} className="fade-up">
          <h2 style={s.sectionTitle}>Destinos disponibles</h2>
          <p style={s.sectionSub}>Cada destino incluye actividades curadas y verificadas</p>
        </div>

        {loading && <p style={s.loadingText}>Cargando destinos…</p>}
        {error && <p style={s.errorText}>{error}</p>}

        <div style={s.grid}>
          {destinations.map((dest, i) => {
            const theme = DEST_THEME[dest.name] || DEFAULT_THEME;
            return (
              <button
                key={dest.id}
                style={{ ...s.card, animationDelay: `${i * 0.1}s` }}
                className="fade-up"
                onClick={() => onPickDest(dest)}
              >
                <div style={{ ...s.cardBg, background: theme.gradient }}>
                  <span style={s.cardEmoji}>{theme.emoji}</span>
                  <div style={s.cardOverlay} />
                </div>
                <div style={s.cardBody}>
                  <div style={s.cardMeta}>
                    <h3 style={s.cardTitle}>{dest.name}</h3>
                    <span style={s.cardCountry}>{dest.country}</span>
                  </div>
                  <p style={s.cardTagline}>{theme.tagline}</p>
                  <div style={s.tagRow}>
                    {theme.tags.map(t => (
                      <span key={t} style={s.tag}>{t}</span>
                    ))}
                  </div>
                  <div style={s.cardCta}>Planificar viaje →</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section style={s.howSection}>
        <h2 style={{ ...s.sectionTitle, color: '#fff', marginBottom: 8 }}>¿Cómo funciona?</h2>
        <p style={{ ...s.sectionSub, color: 'rgba(255,255,255,0.7)', marginBottom: 48 }}>
          En menos de 30 segundos tienes tu plan listo
        </p>
        <div style={s.stepsRow}>
          {STEPS.map((step, i) => (
            <div key={i} style={s.step} className="fade-up">
              <div style={s.stepIcon}>{step.icon}</div>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <span style={s.logo}>SA</span>
        <span style={{ color: '#999', fontSize: 13 }}>
          © {new Date().getFullYear()} Serendipia Agency · Itinerary Planner
        </span>
      </footer>
    </div>
  );
}

const floatPos = [
  { top: '15%', left: '8%' },
  { top: '25%', right: '10%' },
  { top: '55%', left: '5%' },
  { top: '65%', right: '7%' },
  { top: '40%', left: '3%' },
  { top: '45%', right: '4%' },
];

const s = {
  page: { minHeight: '100vh', background: '#FFFBF5' },
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '16px 32px',
    background: 'rgba(255,251,245,0.85)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  },
  logo: { fontSize: 22, fontWeight: 900, letterSpacing: -1, color: '#0D3B2E' },
  navTag: { fontSize: 13, color: '#999' },

  hero: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(160deg, #0D3B2E 0%, #1B5E42 50%, #276749 100%)',
    position: 'relative', overflow: 'hidden', paddingTop: 80,
  },
  heroInner: {
    textAlign: 'center', padding: '0 24px', maxWidth: 720, position: 'relative', zIndex: 2,
  },
  badge: {
    display: 'inline-block', background: 'rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600,
    padding: '6px 16px', borderRadius: 20, marginBottom: 24,
    border: '1px solid rgba(255,255,255,0.2)', letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.1,
    color: '#fff', marginBottom: 24, letterSpacing: -1.5,
  },
  heroAccent: { color: '#F59E0B' },
  heroSub: {
    fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7,
    marginBottom: 40, fontWeight: 400,
  },
  heroCta: {
    display: 'inline-block', background: '#F59E0B', color: '#1A1A1A',
    fontWeight: 800, fontSize: 16, padding: '16px 36px', borderRadius: 50,
    textDecoration: 'none', letterSpacing: 0.3,
  },
  heroDecor: { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 },
  floatEmoji: {
    position: 'absolute', fontSize: 32, opacity: 0.15, userSelect: 'none',
  },

  section: { padding: '96px 24px', maxWidth: 1100, margin: '0 auto' },
  sectionHead: { textAlign: 'center', marginBottom: 56 },
  sectionTitle: { fontSize: 36, fontWeight: 800, marginBottom: 12, letterSpacing: -0.5 },
  sectionSub: { fontSize: 16, color: '#666', lineHeight: 1.6 },
  loadingText: { textAlign: 'center', color: '#888', fontSize: 16, padding: 48 },
  errorText: { textAlign: 'center', color: '#C53030', fontSize: 15 },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 24,
  },
  card: {
    background: '#fff', borderRadius: 20, overflow: 'hidden',
    border: 'none', textAlign: 'left', padding: 0,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  cardBg: {
    height: 180, position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  cardEmoji: { fontSize: 64, position: 'relative', zIndex: 2 },
  cardOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.15) 100%)',
  },
  cardBody: { padding: '20px 24px 24px' },
  cardMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  cardTitle: { fontSize: 22, fontWeight: 800 },
  cardCountry: { fontSize: 13, color: '#888', fontWeight: 500 },
  cardTagline: { fontSize: 14, color: '#555', lineHeight: 1.5, marginBottom: 16 },
  tagRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  tag: {
    background: '#F0FDF4', color: '#276749', fontSize: 12,
    fontWeight: 600, padding: '4px 10px', borderRadius: 20,
    border: '1px solid #BBF7D0',
  },
  cardCta: {
    fontSize: 14, fontWeight: 700, color: '#0D3B2E',
    borderTop: '1px solid #F0F0EC', paddingTop: 16,
  },

  howSection: {
    background: 'linear-gradient(135deg, #0D3B2E 0%, #276749 100%)',
    padding: '96px 24px', textAlign: 'center',
  },
  stepsRow: {
    display: 'flex', gap: 32, justifyContent: 'center',
    flexWrap: 'wrap', maxWidth: 900, margin: '0 auto',
  },
  step: {
    flex: '1 1 220px', maxWidth: 260,
    background: 'rgba(255,255,255,0.08)', borderRadius: 20,
    padding: '32px 24px', border: '1px solid rgba(255,255,255,0.12)',
  },
  stepIcon: { fontSize: 40, marginBottom: 16 },
  stepTitle: { fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 12 },
  stepDesc: { fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 },

  footer: {
    padding: '32px', borderTop: '1px solid #EEE',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#FFFBF5',
  },
};
