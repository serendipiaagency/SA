import { useState, useEffect } from 'react';
import { fetchDestinations } from '../api.js';

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

const DEST_THEME = {
  Barcelona:    { gradient:'linear-gradient(135deg,#C53030,#E53E3E)', tags:['Playa','Gaudí','Gastronomía'], tagline:'Arquitectura, mar y vida mediterránea' },
  Lisboa:       { gradient:'linear-gradient(135deg,#B7791F,#D69E2E)', tags:['Fados','Pastéis','Historia'], tagline:'La ciudad de las siete colinas y el Tejo' },
  Asturias:     { gradient:'linear-gradient(135deg,#276749,#2F855A)', tags:['Aventura','Sidra','Picos de Europa'], tagline:'Naturaleza salvaje, sidra y tradición' },
  Madrid:       { gradient:'linear-gradient(135deg,#C53030,#E53E3E)', tags:['Museos','Tapas','Nightlife'], tagline:'El Prado, la Gran Vía y la mejor gastronomía' },
  Sevilla:      { gradient:'linear-gradient(135deg,#C05621,#ED8936)', tags:['Flamenco','Catedral','Tapas'], tagline:'Flamenco, naranjos y arquitectura andaluza' },
  Granada:      { gradient:'linear-gradient(135deg,#702459,#B83280)', tags:['Alhambra','Albaicín','Sierra'], tagline:'La Alhambra, el Albaicín y el alma andaluza' },
  Valencia:     { gradient:'linear-gradient(135deg,#C05621,#F6AD55)', tags:['Paella','Playa','Ciudad de las Artes'], tagline:'Paella, arquitectura futurista y mar azul' },
  'San Sebastián':{ gradient:'linear-gradient(135deg,#276749,#48BB78)', tags:['Pintxos','Surf','Gastronomía'], tagline:'La mejor gastronomía del mundo junto al mar' },
  Toledo:       { gradient:'linear-gradient(135deg,#744210,#D69E2E)', tags:['Ciudad Imperial','El Greco','Murallas'], tagline:'Ciudad de las tres culturas sobre el Tajo' },
  Porto:        { gradient:'linear-gradient(135deg,#702459,#D69E2E)', tags:['Vino del Porto','Azulejos','Ribeira'], tagline:'Barrios históricos, vino y el río Duero' },
  Algarve:      { gradient:'linear-gradient(135deg,#276749,#F6AD55)', tags:['Playas','Acantilados','Golf'], tagline:'Las playas más espectaculares de Europa' },
  Sintra:       { gradient:'linear-gradient(135deg,#1A365D,#4299E1)', tags:['Palacios','Bosques','Misterio'], tagline:'Palacios de cuento entre bosques encantados' },
  Roma:         { gradient:'linear-gradient(135deg,#744210,#F6AD55)', tags:['Coliseo','Vaticano','Gastronomía'], tagline:'Historia, arte y la mejor pasta del mundo' },
  Florencia:    { gradient:'linear-gradient(135deg,#C05621,#F6E05E)', tags:['Uffizi','Duomo','Renacimiento'], tagline:'La cuna del Renacimiento italiano' },
  Venecia:      { gradient:'linear-gradient(135deg,#1A365D,#63B3ED)', tags:['Góndolas','Canales','Arte'], tagline:'La ciudad más única del mundo sobre el agua' },
  'Milán':      { gradient:'linear-gradient(135deg,#2D3748,#718096)', tags:['Moda','Duomo','Aperitivo'], tagline:'Capital de la moda, el diseño y el aperitivo' },
  'Nápoles':    { gradient:'linear-gradient(135deg,#276749,#F6AD55)', tags:['Pizza','Vesubio','Pompeya'], tagline:'La pizza original, el Vesubio y Pompeya' },
  'Sicilia·Palermo':{ gradient:'linear-gradient(135deg,#C05621,#F6E05E)', tags:['Templos griegos','Etna','Arancini'], tagline:'Templos griegos, volcanes y cocina barroca' },
  'Malta·Valletta':{ gradient:'linear-gradient(135deg,#C53030,#F6E05E)', tags:['Historia','Buceo','Blue Lagoon'], tagline:'Caballeros, laguna azul y 7.000 años de historia' },
  Tirana:       { gradient:'linear-gradient(135deg,#C53030,#ED8936)', tags:['Arte urbano','Bunkers','Montañas'], tagline:'La capital más sorprendente de los Balcanes' },
  'Riviera Albanesa·Saranda':{ gradient:'linear-gradient(135deg,#276749,#63B3ED)', tags:['Ksamil','Butrint','Mar Jónico'], tagline:'El Mediterráneo más cristalino y auténtico' },
  Ljubljana:    { gradient:'linear-gradient(135deg,#276749,#9AE6B4)', tags:['Plečnik','Castillo','Cafés'], tagline:'La capital verde y compacta de Eslovenia' },
  Bled:         { gradient:'linear-gradient(135deg,#1A365D,#9AE6B4)', tags:['Lago','Castillo','Triglav'], tagline:'El lago más fotogénico de los Alpes eslovenos' },
};

const DEFAULT_THEME = { gradient:'linear-gradient(135deg,#2D3748,#4A5568)', tags:[], tagline:'Descubre este destino único' };

const COUNTRY_GROUPS = {
  'Todos': null,
  'España': ['Barcelona','Madrid','Sevilla','Granada','Valencia','San Sebastián','Toledo','Asturias'],
  'Portugal': ['Lisboa','Porto','Algarve','Sintra'],
  'Italia': ['Roma','Florencia','Venecia','Milán','Nápoles','Sicilia·Palermo'],
  'Adriático': ['Malta·Valletta','Tirana','Riviera Albanesa·Saranda','Ljubljana','Bled'],
};

const STEPS = [
  { icon:'📍', title:'Elige destino', desc:'Selecciona entre nuestros destinos curados con actividades verificadas.' },
  { icon:'🎯', title:'Define tu viaje', desc:'Fechas, presupuesto, viajeros e intereses: cultura, aventura, gastronomía…' },
  { icon:'✨', title:'Tu itinerario', desc:'Organizamos el mejor orden de visita con tiempos y costes reales.' },
];

export default function HomePage({ onPickDest, onOpenTrip }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('Todos');
  const [showTrips, setShowTrips] = useState(false);
  const [savedTrips] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sa_trips') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    fetchDestinations()
      .then(setDestinations)
      .catch(() => setError('No se pudieron cargar los destinos.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredDests = destinations.filter(d => {
    const q = search.toLowerCase();
    const matchesSearch = !q || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
    const group = COUNTRY_GROUPS[countryFilter];
    const matchesCountry = !group || group.includes(d.name);
    return matchesSearch && matchesCountry;
  });

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 600px) {
          .country-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .trips-panel { left: auto !important; right: 0 !important; width: 280px !important; }
        }
      `}</style>

      <nav style={s.nav}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={s.logo}>SA</span>
          <span style={s.navTag}>Serendipia Agency</span>
        </div>
        {savedTrips.length > 0 && (
          <div style={{ position:'relative' }}>
            <button style={s.tripsBtn} onClick={() => setShowTrips(t => !t)}>
              📋 Mis viajes
              <span style={s.tripsBadge}>{savedTrips.length}</span>
            </button>
            {showTrips && (
              <div style={s.tripsPanel} className="trips-panel">
                <div style={s.tripsPanelHead}>
                  <span style={s.tripsPanelTitle}>Viajes recientes</span>
                  <button style={s.tripsPanelClose} onClick={() => setShowTrips(false)}>✕</button>
                </div>
                {savedTrips.map(trip => {
                  const photoId = DEST_PHOTO[trip.destName];
                  const thumb = photoId
                    ? `https://images.unsplash.com/photo-${photoId}?w=60&auto=format&fit=crop&q=60`
                    : null;
                  return (
                    <button key={trip.id} style={s.tripRow}
                      onClick={() => { setShowTrips(false); onOpenTrip(trip.id); }}>
                      {thumb && (
                        <img src={thumb} alt={trip.destName} style={s.tripThumb}
                          onError={e => { e.target.style.display = 'none'; }} />
                      )}
                      <div style={s.tripInfo}>
                        <div style={s.tripName}>{trip.destName}</div>
                        <div style={s.tripMeta}>{trip.startDate} · €{trip.totalCost}</div>
                      </div>
                      <span style={s.tripArrow}>→</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      <section style={s.hero}>
        <div style={s.heroInner} className="fade-up">
          <h1 style={s.heroTitle}>Tu próxima aventura,<br /><span style={s.heroAccent}>perfectamente planificada</span></h1>
          <p style={s.heroSub}>Elige destino, dinos tus intereses y presupuesto.<br />Construimos el itinerario perfecto para ti.</p>
          <a href="#destinos" style={s.heroCta}>Explorar destinos ↓</a>
        </div>
        <div style={s.heroDecor}>
          {['🏔️','🌊','🦋','🌿','⛵','🎭'].map((e, i) => (
            <span key={i} style={{ ...s.floatEmoji, ...floatPos[i] }}>{e}</span>
          ))}
        </div>
      </section>

      <section id="destinos" style={s.section}>
        <div style={s.sectionHead} className="fade-up">
          <h2 style={s.sectionTitle}>Destinos disponibles</h2>
          <p style={s.sectionSub}>Cada destino incluye actividades curadas y verificadas</p>
        </div>

        <div style={s.filterBar}>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>🔍</span>
            <input
              type="search"
              placeholder="Buscar destino o país…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={s.searchInput}
            />
            {search && (
              <button style={s.searchClear} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <div style={s.tabs} className="country-tabs">
            {Object.keys(COUNTRY_GROUPS).map(g => (
              <button key={g}
                style={{ ...s.tab, ...(countryFilter === g ? s.tabOn : {}) }}
                onClick={() => setCountryFilter(g)}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <>
            <style>{`
              @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
              .sk { background:linear-gradient(90deg,#F5F5F0 25%,#EBEBEA 50%,#F5F5F0 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
            `}</style>
            <div style={s.grid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1.5px solid #F0EDE8', boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
                  <div className="sk" style={{ height: 200 }} />
                  <div style={{ padding:'18px 22px 22px', display:'flex', flexDirection:'column', gap:10 }}>
                    <div className="sk" style={{ height:20, borderRadius:6, width:'55%' }} />
                    <div className="sk" style={{ height:13, borderRadius:6, width:'90%' }} />
                    <div className="sk" style={{ height:13, borderRadius:6, width:'75%' }} />
                    <div style={{ display:'flex', gap:6, marginTop:4 }}>
                      <div className="sk" style={{ height:24, borderRadius:20, width:60 }} />
                      <div className="sk" style={{ height:24, borderRadius:20, width:72 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {error && <p style={s.errorText}>{error}</p>}

        {!loading && filteredDests.length === 0 && (
          <div style={s.emptyState}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ color:'#888', fontSize:15 }}>No hay destinos que coincidan con "{search}"</p>
            <button style={s.clearBtn} onClick={() => { setSearch(''); setCountryFilter('Todos'); }}>
              Ver todos los destinos
            </button>
          </div>
        )}

        <div style={s.grid}>
          {filteredDests.map((dest, i) => {
            const theme = DEST_THEME[dest.name] || DEFAULT_THEME;
            const photoId = DEST_PHOTO[dest.name];
            const photoUrl = photoId
              ? `https://images.unsplash.com/photo-${photoId}?w=700&auto=format&fit=crop&q=75`
              : null;
            return (
              <button key={dest.id} style={{ ...s.card, animationDelay:`${i * 0.04}s` }}
                className="fade-up" onClick={() => onPickDest(dest)}>
                <div style={{ ...s.cardBg, background: theme.gradient }}>
                  {photoUrl && (
                    <img src={photoUrl} alt={dest.name} style={s.cardPhoto}
                      onError={e => { e.target.style.display = 'none'; }} />
                  )}
                  <div style={s.cardOverlay} />
                  <span style={s.cardCountryBadge}>{dest.country}</span>
                </div>
                <div style={s.cardBody}>
                  <h3 style={s.cardTitle}>{dest.name}</h3>
                  <p style={s.cardTagline}>{theme.tagline}</p>
                  <div style={s.tagRow}>{theme.tags.map(t => <span key={t} style={s.tag}>{t}</span>)}</div>
                  <div style={s.cardCta}>Planificar viaje →</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section style={s.howSection}>
        <h2 style={{ ...s.sectionTitle, color:'#fff', marginBottom:8 }}>¿Cómo funciona?</h2>
        <p style={{ ...s.sectionSub, color:'rgba(255,255,255,0.7)', marginBottom:48 }}>En menos de 30 segundos tienes tu plan listo</p>
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

      <footer style={s.footer}>
        <span style={s.logo}>SA</span>
        <span style={{ color:'#999', fontSize:13 }}>© {new Date().getFullYear()} Serendipia Agency · Itinerary Planner</span>
      </footer>
    </div>
  );
}

const floatPos = [
  { top:'15%', left:'8%' }, { top:'25%', right:'10%' },
  { top:'55%', left:'5%' }, { top:'65%', right:'7%' },
  { top:'40%', left:'3%' }, { top:'45%', right:'4%' },
];

const s = {
  page: { minHeight:'100vh', background:'#FFFBF5' },
  nav: {
    position:'fixed', top:0, left:0, right:0, zIndex:100,
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'14px 32px',
    background:'rgba(255,251,245,0.88)', backdropFilter:'blur(12px)',
    borderBottom:'1px solid rgba(0,0,0,0.06)',
  },
  logo: { fontSize:22, fontWeight:900, letterSpacing:-1, color:'#0D3B2E' },
  navTag: { fontSize:13, color:'#999' },

  tripsBtn: {
    display:'flex', alignItems:'center', gap:6,
    background:'#F5F5F0', border:'1.5px solid #E0DDD8',
    borderRadius:20, padding:'7px 14px', fontSize:13, fontWeight:700, color:'#555',
  },
  tripsBadge: {
    background:'#0D3B2E', color:'#fff', fontSize:11, fontWeight:800,
    borderRadius:99, padding:'1px 6px', minWidth:18, textAlign:'center',
  },
  tripsPanel: {
    position:'absolute', top:'calc(100% + 8px)', right:0,
    background:'#fff', borderRadius:16, boxShadow:'0 8px 32px rgba(0,0,0,0.14)',
    border:'1.5px solid #F0EDE8', width:320, zIndex:200, overflow:'hidden',
  },
  tripsPanelHead: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'14px 16px 12px', borderBottom:'1px solid #F0EDE8',
  },
  tripsPanelTitle: { fontSize:14, fontWeight:700, color:'#1A1A1A' },
  tripsPanelClose: {
    background:'none', border:'none', color:'#999', fontSize:16, fontWeight:700, padding:'0 4px',
  },
  tripRow: {
    display:'flex', alignItems:'center', gap:12, width:'100%',
    padding:'12px 16px', background:'none', border:'none', textAlign:'left',
    borderBottom:'1px solid #F8F8F6',
    transition:'background 0.1s',
  },
  tripThumb: { width:40, height:40, borderRadius:10, objectFit:'cover', flexShrink:0 },
  tripInfo: { flex:1, minWidth:0 },
  tripName: { fontSize:14, fontWeight:700, color:'#1A1A1A', marginBottom:2 },
  tripMeta: { fontSize:12, color:'#999' },
  tripArrow: { color:'#CCC', fontSize:16 },

  hero: {
    minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
    background:'linear-gradient(160deg,#0D3B2E 0%,#1B5E42 50%,#276749 100%)',
    position:'relative', overflow:'hidden', paddingTop:80,
  },
  heroInner: { textAlign:'center', padding:'0 24px', maxWidth:720, position:'relative', zIndex:2 },
  heroTitle: { fontSize:'clamp(36px,6vw,72px)', fontWeight:900, lineHeight:1.1, color:'#fff', marginBottom:24, letterSpacing:-1.5 },
  heroAccent: { color:'#F59E0B' },
  heroSub: { fontSize:18, color:'rgba(255,255,255,0.75)', lineHeight:1.7, marginBottom:40, fontWeight:400 },
  heroCta: { display:'inline-block', background:'#F59E0B', color:'#1A1A1A', fontWeight:800, fontSize:16, padding:'16px 36px', borderRadius:50, textDecoration:'none', letterSpacing:0.3 },
  heroDecor: { position:'absolute', inset:0, pointerEvents:'none', zIndex:1 },
  floatEmoji: { position:'absolute', fontSize:32, opacity:0.15, userSelect:'none' },

  section: { padding:'96px 24px', maxWidth:1200, margin:'0 auto' },
  sectionHead: { textAlign:'center', marginBottom:48 },
  sectionTitle: { fontSize:36, fontWeight:800, marginBottom:12, letterSpacing:-0.5 },
  sectionSub: { fontSize:16, color:'#666', lineHeight:1.6 },

  filterBar: {
    display:'flex', flexDirection:'column', gap:14, marginBottom:48,
    background:'#fff', borderRadius:20, padding:'20px 24px',
    boxShadow:'0 2px 16px rgba(0,0,0,0.06)', border:'1.5px solid #F0EDE8',
  },
  searchWrap: {
    display:'flex', alignItems:'center', gap:10,
    background:'#FAFAF8', borderRadius:12, padding:'10px 16px',
    border:'1.5px solid #E8E5E0',
  },
  searchIcon: { fontSize:16, flexShrink:0 },
  searchInput: {
    flex:1, border:'none', background:'transparent', fontSize:15,
    outline:'none', color:'#1A1A1A',
  },
  searchClear: {
    background:'none', border:'none', color:'#BBB', fontSize:14, fontWeight:700, padding:'0 4px',
  },
  tabs: { display:'flex', gap:8, flexWrap:'wrap' },
  tab: {
    padding:'8px 18px', borderRadius:50, border:'1.5px solid #E8E5E0',
    background:'#FAFAF8', fontSize:13, fontWeight:600, color:'#666', flexShrink:0,
  },
  tabOn: { background:'#0D3B2E', color:'#fff', borderColor:'#0D3B2E' },

  errorText: { textAlign:'center', color:'#C53030', fontSize:15 },
  emptyState: { textAlign:'center', padding:'48px 24px' },
  clearBtn: {
    marginTop:16, background:'#0D3B2E', color:'#fff', border:'none',
    padding:'10px 24px', borderRadius:10, fontSize:14, fontWeight:700,
  },

  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:24 },
  card: {
    background:'#fff', borderRadius:20, overflow:'hidden', border:'none',
    textAlign:'left', padding:0, boxShadow:'0 4px 24px rgba(0,0,0,0.08)',
    cursor:'pointer',
  },
  cardBg: { height:200, position:'relative', overflow:'hidden', display:'flex', alignItems:'flex-end', justifyContent:'flex-start' },
  cardPhoto: { position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 },
  cardOverlay: { position:'absolute', inset:0, zIndex:1, background:'linear-gradient(to bottom,rgba(0,0,0,0.04) 0%,rgba(0,0,0,0.42) 100%)' },
  cardCountryBadge: { position:'relative', zIndex:2, margin:'0 0 12px 12px', fontSize:11, fontWeight:700, color:'#fff', letterSpacing:0.5, background:'rgba(0,0,0,0.35)', padding:'4px 10px', borderRadius:20, backdropFilter:'blur(4px)' },
  cardBody: { padding:'18px 22px 22px' },
  cardTitle: { fontSize:20, fontWeight:800, color:'#1A1A1A', marginBottom:6 },
  cardTagline: { fontSize:13, color:'#555', lineHeight:1.5, marginBottom:14 },
  tagRow: { display:'flex', gap:6, flexWrap:'wrap', marginBottom:18 },
  tag: { background:'#F0FDF4', color:'#276749', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, border:'1px solid #BBF7D0' },
  cardCta: { fontSize:13, fontWeight:700, color:'#0D3B2E', borderTop:'1px solid #F0F0EC', paddingTop:14 },

  howSection: { background:'linear-gradient(135deg,#0D3B2E 0%,#276749 100%)', padding:'96px 24px', textAlign:'center' },
  stepsRow: { display:'flex', gap:32, justifyContent:'center', flexWrap:'wrap', maxWidth:900, margin:'0 auto' },
  step: { flex:'1 1 220px', maxWidth:260, background:'rgba(255,255,255,0.08)', borderRadius:20, padding:'32px 24px', border:'1px solid rgba(255,255,255,0.12)' },
  stepIcon: { fontSize:40, marginBottom:16 },
  stepTitle: { fontSize:18, fontWeight:700, color:'#fff', marginBottom:12 },
  stepDesc: { fontSize:14, color:'rgba(255,255,255,0.65)', lineHeight:1.6 },

  footer: { padding:'32px', borderTop:'1px solid #EEE', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#FFFBF5' },
};
