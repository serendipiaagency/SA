import { useState, useEffect, useRef } from 'react';
import ActivityCard from '../components/ActivityCard.jsx';
import MapView from '../components/MapView.jsx';
import FullRouteMap from '../components/FullRouteMap.jsx';
import WeatherStrip from '../components/WeatherStrip.jsx';
import PackingList from '../components/PackingList.jsx';

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

const DEST_INFO = {
  'Barcelona':    { lang:'Español / Catalán', currency:'€ Euro', tz:'CET +1', transport:'Metro · Bus · Bicing', tip:'La T-Casual (10 viajes, ~€11) cubre metro y bus. Cómprala en máquinas del metro.' },
  'Lisboa':       { lang:'Portugués', currency:'€ Euro', tz:'WET +0', transport:'Metro · Tranvía · Tuk-tuk', tip:'El Viva Viagem recargable sirve para metro, tranvía y ferry. Válido en toda la red.' },
  'Asturias':     { lang:'Español', currency:'€ Euro', tz:'CET +1', transport:'ALSA · FEVE · Coche', tip:'Alquila coche: es la única forma de llegar a los Picos de Europa y las playas ocultas.' },
  'Madrid':       { lang:'Español', currency:'€ Euro', tz:'CET +1', transport:'Metro · EMT · Cercanías', tip:'El Abono Turístico A da viajes ilimitados en metro durante 1-7 días.' },
  'Sevilla':      { lang:'Español', currency:'€ Euro', tz:'CET +1', transport:'Metro · Tussam · Sevici', tip:'La ciudad es plana y ciclable. Sevici (bici pública) tiene tarifa diaria de €1,33.' },
  'Granada':      { lang:'Español', currency:'€ Euro', tz:'CET +1', transport:'Autobus · Taxi', tip:'Reserva la Alhambra online con semanas de antelación: las entradas se agotan siempre.' },
  'Valencia':     { lang:'Español / Valenciano', currency:'€ Euro', tz:'CET +1', transport:'Metro · EMT · Valenbisi', tip:'El abono 24h (~€4) da acceso ilimitado a metro, tranvía y bus EMT.' },
  'San Sebastián':{ lang:'Español / Euskera', currency:'€ Euro', tz:'CET +1', transport:'Dbus · Renfe Cercanías', tip:'El centro histórico y La Concha se recorren perfectamente a pie. Ciudad muy compacta.' },
  'Toledo':       { lang:'Español', currency:'€ Euro', tz:'CET +1', transport:'ALSA · Taxi', tip:'Casco histórico 100% peatonal. Está a solo 30 min de Madrid en AVE o 1h en bus.' },
  'Porto':        { lang:'Portugués', currency:'€ Euro', tz:'WET +0', transport:'Metro · Tranvía · Tuk-tuk', tip:'Baja a pie por la Ribeira. El tranvía histórico es bonito pero lento y caro.' },
  'Algarve':      { lang:'Portugués', currency:'€ Euro', tz:'WET +0', transport:'EVA Bus · Coche de alquiler', tip:'Sin coche propio es difícil acceder a las mejores calas y acantilados del litoral.' },
  'Sintra':       { lang:'Portugués', currency:'€ Euro', tz:'WET +0', transport:'Tren desde Lisboa · Bus 434', tip:'Llega antes de las 9h. Las colas a los palacios se disparan a partir de las 10h.' },
  'Roma':         { lang:'Italiano', currency:'€ Euro', tz:'CET +1', transport:'Metro A y B · Bus · Tram', tip:'El Rome Pass (48/72h) incluye museos y transporte. Reserva el Coliseo con antelación.' },
  'Florencia':    { lang:'Italiano', currency:'€ Euro', tz:'CET +1', transport:'ATAF · A pie', tip:'Los Uffizi requieren reserva previa; sin ella las colas superan las 2-3 horas fácilmente.' },
  'Venecia':      { lang:'Italiano', currency:'€ Euro', tz:'CET +1', transport:'Vaporetto · A pie', tip:'El Vaporetto pass de 24h (~€25) es la forma más eficiente de moverse por los canales.' },
  'Milán':        { lang:'Italiano', currency:'€ Euro', tz:'CET +1', transport:'Metro · Tranvía · ATM', tip:'El abono urbano de 24h (~€7) incluye metro, tranvía y autobús ATM.' },
  'Nápoles':      { lang:'Italiano', currency:'€ Euro', tz:'CET +1', transport:'Metro · Funicular · Ferry', tip:'El UnicoNapoli integra metro, funicular y bus urbano. Ideal para varios días.' },
  'Sicilia·Palermo':{ lang:'Italiano', currency:'€ Euro', tz:'CET +1', transport:'AMAT · Coche de alquiler', tip:'Con coche puedes combinar Palermo, el Valle de los Templos y el Etna en pocos días.' },
  'Malta·Valletta':{ lang:'Maltés / Inglés', currency:'€ Euro', tz:'CET +1', transport:'Bus Malta Public Transport · Ferry', tip:'El abono de 7 días (€21) cubre todos los buses; el ferry incluye el viaje a Gozo.' },
  'Tirana':       { lang:'Albanés', currency:'Lek albanés / €', tz:'CET +1', transport:'Taxi · Furgon · Alquiler', tip:'La mayoría de restaurantes y hoteles aceptan euros. Lleva también algunos leks.' },
  'Riviera Albanesa·Saranda':{ lang:'Albanés', currency:'Lek albanés / €', tz:'CET +1', transport:'Furgon · Ferry a Corfú · Taxi', tip:'El ferry a la Isla de Ksamil dura 10 min. En verano es imprescindible reservar.' },
  'Ljubljana':    { lang:'Esloveno', currency:'€ Euro', tz:'CET +1', transport:'A pie · Bicicleta · Bus Urbana', tip:'El centro es peatonal. Las bicis de Bicikelj son gratuitas los primeros 60 minutos.' },
  'Bled':         { lang:'Esloveno', currency:'€ Euro', tz:'CET +1', transport:'Bus desde Ljubljana · Coche · Bici', tip:'Alquila una barca de remos para ir a la Isla del Lago: la experiencia definitiva de Bled.' },
};

const CAT_LABEL = { culture:'Cultura', food:'Gastronomía', nature:'Naturaleza', adventure:'Aventura', shopping:'Compras' };
const CAT_FG    = { culture:'#1565C0', food:'#E65100', nature:'#2E7D32', adventure:'#BF360C', shopping:'#880E4F' };

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function exportICS(itinerary) {
  const dest = itinerary.destination?.name || 'Viaje';
  const slug = dest.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0',
    'PRODID:-//Serendipia Agency//Itinerary//ES', 'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${dest} · Serendipia`,
  ];
  itinerary.days.forEach(day => {
    day.items.forEach((item, idx) => {
      const { activity, start_time, end_time } = item;
      const d = day.date.replace(/-/g, '');
      const sh = String(Math.floor(start_time / 100)).padStart(2, '0');
      const sm = String(start_time % 100).padStart(2, '0');
      const eh = String(Math.floor(end_time / 100)).padStart(2, '0');
      const em = String(end_time % 100).padStart(2, '0');
      const desc = activity.description
        ? activity.description.replace(/\n/g, '\\n').replace(/[,;]/g, '\\$&') : '';
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${itinerary.id}-${day.day_number}-${idx}@serendipiaagency.com`);
      lines.push(`DTSTART:${d}T${sh}${sm}00`);
      lines.push(`DTEND:${d}T${eh}${em}00`);
      lines.push(`SUMMARY:${activity.name}`);
      if (desc) lines.push(`DESCRIPTION:${desc}`);
      if (activity.lat && activity.lon) lines.push(`GEO:${activity.lat};${activity.lon}`);
      lines.push('END:VEVENT');
    });
  });
  lines.push('END:VCALENDAR');
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `serendipia-${slug}.ics`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

export default function ItineraryPage({ itinerary, onReset }) {
  const [mapDays, setMapDays] = useState({});
  const [showFullRoute, setShowFullRoute] = useState(false);
  const [collapsedDays, setCollapsedDays] = useState({});
  const [showPacking, setShowPacking] = useState(false);
  const [toast, setToast] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [hiddenCats, setHiddenCats] = useState(new Set());
  const [note, setNote] = useState(() => {
    try { return localStorage.getItem(`sa_note_${itinerary.id}`) || ''; } catch { return ''; }
  });
  const toastTimer = useRef(null);

  const dest = itinerary.destination || {};
  const photoId = DEST_PHOTO[dest.name];
  const heroImg = photoId
    ? `https://images.unsplash.com/photo-${photoId}?w=1400&auto=format&fit=crop&q=80`
    : null;
  const destInfo = DEST_INFO[dest.name] || null;

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? Math.min(100, (scrollTop / docH) * 100) : 0);
      setShowScrollTop(scrollTop > 450);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function showToastMsg(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  }

  function shareItinerary() {
    const url = `${window.location.origin}?id=${itinerary.id}`;
    if (navigator.share) {
      navigator.share({ title: `Itinerario en ${dest.name || 'Serendipia'}`, url });
    } else {
      navigator.clipboard.writeText(url)
        .then(() => showToastMsg('¡Enlace copiado al portapapeles!'))
        .catch(() => showToastMsg('Copia este enlace: ' + url));
    }
  }

  function toggleMap(dayNum) {
    setMapDays(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  }

  function toggleCollapse(dayNum) {
    setCollapsedDays(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  }

  function toggleCat(cat) {
    setHiddenCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  }

  function handleNoteChange(e) {
    setNote(e.target.value);
    try { localStorage.setItem(`sa_note_${itinerary.id}`, e.target.value); } catch {}
  }

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

  const allItems = itinerary.days.flatMap(d => d.items);
  const presentCats = [...new Set(allItems.map(i => i.activity.category))];
  const freeCount = allItems.filter(i => i.activity.price === 0).length;
  const paidCount = allItems.filter(i => i.activity.price > 0).length;
  const avgRating = allItems.length > 0
    ? allItems.reduce((s, i) => s + (i.activity.rating || 0), 0) / allItems.length : 0;
  const totalDurH = Math.round(allItems.reduce((s, i) => s + (i.activity.duration_minutes || 0), 0) / 60);
  const totalActivities = allItems.length;
  const days = itinerary.days.length;
  const budgetUsed = itinerary.total_cost;
  const budgetPct = Math.min(100, (budgetUsed / itinerary.budget) * 100);
  const maxCat = Math.max(...Object.values(catTotals), 1);
  const maxDay = Math.max(...dayTotals.map(d => d.cost), 1);
  const hiddenCount = hiddenCats.size > 0
    ? allItems.filter(i => hiddenCats.has(i.activity.category)).length : 0;

  return (
    <div style={s.page}>
      <style>{`
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(12px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
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
          .itin-hero { position: static !important; padding: 32px 24px 28px !important; min-height: auto !important; }
          .itin-body { padding: 24px !important; }
          .itin-dashboard { box-shadow: none !important; }
          .day-block { page-break-inside: avoid; margin-bottom: 20px !important; }
          .leaflet-container { display: none !important; }
        }
        .day-hdr:hover { background: #FAFAF8 !important; }
        .collapse-chevron { transition: transform 0.2s ease; }
        .cat-pill-btn { transition: background 0.14s, color 0.14s, border-color 0.14s; }
        .notes-area:focus { outline: none; border-color: #F59E0B !important; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); }
      `}</style>

      {/* Scroll progress bar */}
      <div style={{ ...s.progressBar, width: `${scrollPct}%` }} className="no-print" />

      {/* Toast */}
      {toast && (
        <div style={s.toast} className="no-print">
          <span style={s.toastIcon}>✓</span> {toast}
        </div>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          className="no-print"
          style={s.scrollTopBtn}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Volver arriba"
        >
          ↑
        </button>
      )}

      {showPacking && (
        <PackingList itinerary={itinerary} onClose={() => setShowPacking(false)} />
      )}

      <nav style={s.nav} className="no-print">
        <button style={s.back} onClick={onReset}>← Nuevo plan</button>
        <span style={s.logo}>SA</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button style={s.printBtn} onClick={() => window.print()}>🖨️ PDF</button>
          <button style={s.packBtn} onClick={() => setShowPacking(true)}>🧳 Equipaje</button>
          <button style={s.calBtn} onClick={() => exportICS(itinerary)}>📅 Calendario</button>
          <button style={s.shareBtn} onClick={shareItinerary}>🔗 Compartir</button>
        </div>
      </nav>

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

        {destInfo && (
          <div style={s.tipsCard}>
            <div style={s.tipsRow}>
              <span style={s.tipItem}><span style={s.tipIcon}>🌍</span> {destInfo.lang}</span>
              <span style={s.tipSep} />
              <span style={s.tipItem}><span style={s.tipIcon}>💶</span> {destInfo.currency}</span>
              <span style={s.tipSep} />
              <span style={s.tipItem}><span style={s.tipIcon}>🕐</span> {destInfo.tz}</span>
              <span style={s.tipSep} />
              <span style={s.tipItem}><span style={s.tipIcon}>🚌</span> {destInfo.transport}</span>
            </div>
            <div style={s.tipHighlight}>
              <span style={s.tipBulb}>💡</span>
              <span style={s.tipText}>{destInfo.tip}</span>
            </div>
          </div>
        )}

        <div style={s.statsBar} className="no-print">
          <div style={s.statItem}>
            <span style={s.statNum}>★ {avgRating.toFixed(1)}</span>
            <span style={s.statLbl}>promedio</span>
          </div>
          <div style={s.statSep} />
          <div style={s.statItem}>
            <span style={s.statNum}>{freeCount}</span>
            <span style={s.statLbl}>gratis</span>
          </div>
          <div style={s.statSep} />
          <div style={s.statItem}>
            <span style={s.statNum}>{paidCount}</span>
            <span style={s.statLbl}>de pago</span>
          </div>
          <div style={s.statSep} />
          <div style={s.statItem}>
            <span style={s.statNum}>~{totalDurH}h</span>
            <span style={s.statLbl}>actividades</span>
          </div>
          <button style={s.routeBtn} onClick={() => setShowFullRoute(true)}>
            🗺️ Ruta completa
          </button>
        </div>

        {showFullRoute && (
          <FullRouteMap days={itinerary.days} onClose={() => setShowFullRoute(false)} />
        )}

        <WeatherStrip
          lat={dest.lat} lon={dest.lon}
          startDate={itinerary.start_date} endDate={itinerary.end_date}
        />

        {/* Category filter */}
        {presentCats.length > 1 && (
          <div style={s.catFilter} className="no-print">
            <span style={s.catFilterLabel}>Filtrar:</span>
            {presentCats.map(cat => {
              const active = !hiddenCats.has(cat);
              return (
                <button
                  key={cat}
                  className="cat-pill-btn"
                  style={{
                    ...s.catPill,
                    ...(active ? { background: CAT_FG[cat], color: '#fff', borderColor: CAT_FG[cat] } : {}),
                  }}
                  onClick={() => toggleCat(cat)}
                >
                  {CAT_LABEL[cat]}
                </button>
              );
            })}
            {hiddenCats.size > 0 && (
              <span style={s.catHiddenNote}>
                {hiddenCount} oculta{hiddenCount !== 1 ? 's' : ''} ·{' '}
                <button style={s.catClearBtn} onClick={() => setHiddenCats(new Set())}>
                  Ver todo
                </button>
              </span>
            )}
          </div>
        )}

        {/* Trip notes */}
        <div style={s.notesCard} className="no-print">
          <div style={s.notesHead}>
            <span style={s.notesIcon}>📝</span>
            <span style={s.notesTitle}>Mis notas del viaje</span>
            {note && <span style={s.notesSaved}>Guardado ✓</span>}
          </div>
          <textarea
            className="notes-area"
            style={s.notesArea}
            placeholder="Apunta aquí lo que quieras: reservas pendientes, alergias, contactos, ideas…"
            value={note}
            onChange={handleNoteChange}
            rows={3}
          />
        </div>

        {itinerary.days.map(day => {
          const dayCost = dayTotals.find(d => d.day_number === day.day_number)?.cost || 0;
          const showMap = !!mapDays[day.day_number];
          const isCollapsed = !!collapsedDays[day.day_number];
          const visibleItems = hiddenCats.size === 0
            ? day.items
            : day.items.filter(item => !hiddenCats.has(item.activity.category));
          return (
            <div key={day.day_number} style={s.dayBlock} className="day-block">
              <div
                style={s.dayHeader}
                className="day-hdr"
                onClick={() => toggleCollapse(day.day_number)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleCollapse(day.day_number); }}
              >
                <span
                  className="collapse-chevron"
                  style={{ ...s.chevron, transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                >
                  ▾
                </span>
                <span style={s.dayNumber}>Día {day.day_number}</span>
                <span style={s.dayDate}>{fmtDate(day.date)}</span>
                <span style={s.dayCost}>€{dayCost.toFixed(0)}</span>
                <span style={s.dayCount}>
                  {visibleItems.length !== day.items.length
                    ? `${visibleItems.length}/${day.items.length} actividades`
                    : `${day.items.length} actividad${day.items.length !== 1 ? 'es' : ''}`}
                </span>
                {day.items.length > 0 && !isCollapsed && (
                  <button
                    className="no-print"
                    style={{ ...s.viewToggle, ...(showMap ? s.viewToggleOn : {}) }}
                    onClick={e => { e.stopPropagation(); toggleMap(day.day_number); }}
                  >
                    {showMap ? '📋 Lista' : '🗺️ Mapa'}
                  </button>
                )}
              </div>

              {!isCollapsed && (
                <>
                  {visibleItems.length === 0 && hiddenCats.size > 0 ? (
                    <p style={s.filteredMsg}>
                      Todas las actividades de este día están filtradas.{' '}
                      <button style={s.filteredClearBtn} onClick={() => setHiddenCats(new Set())}>
                        Mostrar todo
                      </button>
                    </p>
                  ) : day.items.length === 0 ? (
                    <p style={s.empty}>Sin actividades para este día con el presupuesto restante.</p>
                  ) : showMap ? (
                    <div className="no-print">
                      <MapView key={day.day_number} items={day.items} />
                    </div>
                  ) : (
                    visibleItems.map((item, idx) => (
                      <ActivityCard
                        key={item.activity.id}
                        item={item}
                        isFirst={idx === 0}
                        prevActivity={idx > 0 ? visibleItems[idx - 1].activity : null}
                      />
                    ))
                  )}
                </>
              )}
            </div>
          );
        })}

        <div style={s.cta} className="no-print">
          <button style={s.printCtaBtn} onClick={() => window.print()}>🖨️ Imprimir PDF</button>
          <button style={s.packCtaBtn} onClick={() => setShowPacking(true)}>🧳 Lista de equipaje</button>
          <button style={s.calCtaBtn} onClick={() => exportICS(itinerary)}>📅 Exportar al calendario</button>
          <button style={s.shareCtaBtn} onClick={shareItinerary}>🔗 Compartir</button>
          <button style={s.ctaBtn} onClick={onReset}>Planificar nuevo viaje →</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#FFFBF5' },

  progressBar: {
    position: 'fixed', top: 0, left: 0, zIndex: 600,
    height: 3, background: 'linear-gradient(90deg, #0D3B2E, #4ADE80)',
    transition: 'width 0.08s linear', pointerEvents: 'none',
  },

  toast: {
    position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
    background: '#0D3B2E', color: '#fff', borderRadius: 40,
    padding: '12px 24px', fontSize: 14, fontWeight: 700,
    boxShadow: '0 8px 32px rgba(0,0,0,0.22)', zIndex: 500,
    display: 'flex', alignItems: 'center', gap: 8,
    animation: 'toastIn 0.25s ease', whiteSpace: 'nowrap',
  },
  toastIcon: { fontSize: 16, color: '#4ADE80' },

  scrollTopBtn: {
    position: 'fixed', bottom: 28, right: 24, zIndex: 200,
    width: 44, height: 44, borderRadius: '50%',
    background: '#0D3B2E', color: '#fff', border: 'none',
    fontSize: 20, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

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
  packBtn: {
    background: '#FFF8E1', border: '1.5px solid #FCD34D', borderRadius: 8,
    padding: '7px 12px', fontSize: 13, fontWeight: 700, color: '#92400E',
  },
  calBtn: {
    background: '#EBF4FF', border: '1.5px solid #BFD7F8', borderRadius: 8,
    padding: '7px 12px', fontSize: 13, fontWeight: 700, color: '#1565C0',
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
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)', marginBottom: 24,
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

  tipsCard: {
    background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: 16,
    padding: '16px 20px', marginBottom: 32,
  },
  tipsRow: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tipItem: { fontSize: 12, color: '#374151', display: 'flex', alignItems: 'center', gap: 4 },
  tipIcon: { fontSize: 13 },
  tipSep: { width: 1, height: 14, background: '#BBF7D0', flexShrink: 0 },
  tipHighlight: {
    display: 'flex', alignItems: 'flex-start', gap: 8,
    background: 'rgba(255,255,255,0.65)', borderRadius: 10, padding: '10px 14px',
  },
  tipBulb: { fontSize: 16, flexShrink: 0 },
  tipText: { fontSize: 13, color: '#065F46', lineHeight: 1.5, fontWeight: 500 },

  statsBar: {
    display: 'flex', alignItems: 'center', background: '#fff',
    borderRadius: 16, marginBottom: 40, border: '1.5px solid #F0EDE8',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden', flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '16px 20px', flex: '1 1 auto',
  },
  statNum: { fontSize: 20, fontWeight: 800, color: '#0D3B2E' },
  statLbl: { fontSize: 10, color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  statSep: { width: 1, height: 40, background: '#F0EDE8', flexShrink: 0 },
  routeBtn: {
    background: '#0D3B2E', color: '#fff', border: 'none',
    padding: '12px 18px', fontSize: 13, fontWeight: 700,
    margin: 10, borderRadius: 12, flexShrink: 0,
  },

  catFilter: {
    display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
    marginBottom: 24, padding: '12px 16px',
    background: '#fff', borderRadius: 12, border: '1.5px solid #F0EDE8',
  },
  catFilterLabel: { fontSize: 11, fontWeight: 700, color: '#AAA', textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0 },
  catPill: {
    padding: '5px 14px', borderRadius: 20, border: '1.5px solid #E0DDD8',
    background: '#F5F5F0', fontSize: 12, fontWeight: 700, color: '#888', cursor: 'pointer',
  },
  catHiddenNote: { fontSize: 11, color: '#BBB', marginLeft: 'auto' },
  catClearBtn: {
    background: 'none', border: 'none', color: '#0D3B2E', fontWeight: 700,
    fontSize: 11, cursor: 'pointer', padding: 0, textDecoration: 'underline',
  },

  notesCard: {
    background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: 16,
    padding: '16px 20px', marginBottom: 40,
  },
  notesHead: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  notesIcon: { fontSize: 16 },
  notesTitle: { fontSize: 13, fontWeight: 800, color: '#92400E' },
  notesSaved: { fontSize: 11, color: '#D97706', marginLeft: 'auto', fontWeight: 600 },
  notesArea: {
    width: '100%', border: '1.5px solid #FDE68A', borderRadius: 10,
    background: 'rgba(255,255,255,0.75)', padding: '12px 14px',
    fontSize: 14, color: '#374151', lineHeight: 1.6, resize: 'vertical',
    fontFamily: 'inherit',
  },

  filteredMsg: { color: '#AAA', fontStyle: 'italic', padding: '12px 0', fontSize: 13 },
  filteredClearBtn: {
    background: 'none', border: 'none', color: '#0D3B2E', fontWeight: 700,
    fontSize: 13, cursor: 'pointer', padding: 0, textDecoration: 'underline',
  },

  dayBlock: { marginBottom: 48 },
  dayHeader: {
    display: 'flex', alignItems: 'center', gap: 10,
    marginBottom: 20, borderBottom: '2px solid #F0EDE8',
    flexWrap: 'wrap', cursor: 'pointer', borderRadius: 8, padding: '8px 4px 14px',
    userSelect: 'none',
  },
  chevron: { fontSize: 16, color: '#CCC', flexShrink: 0, lineHeight: 1 },
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
    display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap',
  },
  printCtaBtn: {
    background: '#F5F5F0', color: '#555', border: '1.5px solid #E0DDD8',
    padding: '13px 20px', borderRadius: 12, fontSize: 14, fontWeight: 700,
  },
  packCtaBtn: {
    background: '#FFF8E1', color: '#92400E', border: '1.5px solid #FCD34D',
    padding: '13px 20px', borderRadius: 12, fontSize: 14, fontWeight: 700,
  },
  calCtaBtn: {
    background: '#EBF4FF', color: '#1565C0', border: '1.5px solid #BFD7F8',
    padding: '13px 20px', borderRadius: 12, fontSize: 14, fontWeight: 700,
  },
  shareCtaBtn: {
    background: '#F59E0B', color: '#1A1A1A', border: 'none',
    padding: '13px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700,
  },
  ctaBtn: {
    background: '#0D3B2E', color: '#fff', border: 'none',
    padding: '13px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700,
  },
};
