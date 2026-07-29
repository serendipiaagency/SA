const CATEGORY_EMOJI = { culture:'🏙', food:'🍽', nature:'🌿', adventure:'🧗', shopping:'🛍' };
const CATEGORY_LABEL = { culture:'Cultura', food:'Gastronomía', nature:'Naturaleza', adventure:'Aventura', shopping:'Compras' };
const CATEGORY_BG    = { culture:'#EBF4FF', food:'#FFF8E1', nature:'#F0FDF4', adventure:'#FFF3E0', shopping:'#FCE4EC' };
const CATEGORY_FG    = { culture:'#1565C0', food:'#E65100', nature:'#2E7D32', adventure:'#BF360C', shopping:'#880E4F' };

function slotStyle(t) {
  if (t < 1300) return { color: '#F59E0B', line: '#FDE68A', bg: '#FFFBEB' };
  if (t < 2000) return { color: '#F97316', line: '#FDBA74', bg: '#FFF7ED' };
  return { color: '#7C3AED', line: '#C4B5FD', bg: '#F5F3FF' };
}

function Stars({ rating }) {
  const full = Math.floor(rating || 0);
  const half = (rating || 0) - full >= 0.5;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{
          fontSize: 11,
          color: i <= full ? '#F59E0B' : (i === full+1 && half ? '#F59E0B' : '#E0DDD8'),
          opacity: i === full+1 && half ? 0.55 : 1,
        }}>★</span>
      ))}
      <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 700, marginLeft: 3 }}>
        {(rating || 0).toFixed(1)}
      </span>
    </span>
  );
}

function fmt(hhmm) {
  if (hhmm == null) return '--:--';
  return `${String(Math.floor(hhmm/100)).padStart(2,'0')}:${String(hhmm%100).padStart(2,'0')}`;
}

function taxiCost(min) {
  const km = (min/60)*25;
  return Math.round(3 + km*1.2);
}

function mapsDir(aLat, aLon, bLat, bLon, walk) {
  return `https://www.google.com/maps/dir/?api=1&origin=${aLat},${aLon}&destination=${bLat},${bLon}&travelmode=${walk?'walking':'driving'}`;
}

function mapsPlace(lat, lon, name) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&center=${lat},${lon}`;
}

export default function ActivityCard({ item, isFirst, prevActivity, isFav, onToggleFavorite, onShowDetail }) {
  const { activity, start_time, end_time, travel_minutes_from_prev } = item;
  const walk  = travel_minutes_from_prev <= 30;
  const tCost = walk ? 0 : taxiCost(travel_minutes_from_prev);
  const sl    = slotStyle(start_time);

  return (
    <div style={{ marginBottom: 4 }}>
      <style>{`
        .act-heart:hover { transform: scale(1.22) !important; }
        .act-detail:hover { background: #111827 !important; color: #fff !important; border-color: #111827 !important; }
        .act-lnk:hover { background: #E5E7EB !important; }
      `}</style>

      {/* Travel leg */}
      {!isFirst && travel_minutes_from_prev > 0 && (
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ width: 28, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 2, height: 32, background: sl.line }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 7, paddingLeft: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13 }}>{walk ? '🚶' : '🚕'}</span>
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              {walk ? 'A pie' : 'Taxi / bus'} · {travel_minutes_from_prev} min
              {tCost > 0 && <> · <b style={{ color: '#374151' }}>~€{tCost}</b></>}
            </span>
            {prevActivity && (
              <a
                href={mapsDir(prevActivity.lat, prevActivity.lon, activity.lat, activity.lon, walk)}
                target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, fontWeight: 700, color: '#374151', textDecoration: 'none', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 20, padding: '2px 9px' }}
              >
                Cómo llegar ↗
              </a>
            )}
          </div>
        </div>
      )}

      {/* Activity row */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Timeline gutter */}
        <div style={{ width: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 13, flexShrink: 0 }}>
          <div style={{
            width: 11, height: 11, borderRadius: '50%',
            border: `2.5px solid ${sl.color}`, background: '#fff',
            flexShrink: 0, zIndex: 1,
            boxShadow: `0 0 0 3px ${sl.bg}`,
          }} />
          <div style={{ width: 2, flex: 1, background: sl.line, marginTop: 4, minHeight: 28 }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, paddingLeft: 12, paddingBottom: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: sl.color, marginBottom: 6, letterSpacing: 0.1 }}>
            {fmt(start_time)} – {fmt(end_time)}
          </div>

          <div style={{ background: '#F5F6F8', borderRadius: 16, padding: '14px 16px' }}>
            {/* Name + heart */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: activity.description ? 6 : 10 }}>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: '#111827', lineHeight: 1.3, flex: 1, margin: 0 }}>
                {activity.name}
              </h4>
              <button
                className="act-heart"
                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', padding: '2px 0', flexShrink: 0, lineHeight: 1, color: isFav ? '#F43F5E' : '#D1D5DB', transition: 'transform 0.14s ease' }}
                onClick={onToggleFavorite}
                title={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              >
                {isFav ? '♥' : '♡'}
              </button>
            </div>

            {activity.description && (
              <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.55, margin: '0 0 10px' }}>
                {activity.description}
              </p>
            )}

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 5, fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
              <Stars rating={activity.rating} />
              <span style={{ color: '#D1D5DB' }}>·</span>
              <span>⏱ {activity.duration_minutes} min</span>
              {activity.opening_time != null && (
                <>
                  <span style={{ color: '#D1D5DB' }}>·</span>
                  <span>🕐 {fmt(activity.opening_time)}–{fmt(activity.closing_time)}</span>
                </>
              )}
              <span style={{ color: '#D1D5DB' }}>·</span>
              <span style={{ fontWeight: 700, color: activity.price > 0 ? '#374151' : '#2E7D32' }}>
                {activity.price > 0 ? `💶 €${activity.price.toFixed(0)}` : '✓ Gratis'}
              </span>
              <span style={{
                background: CATEGORY_BG[activity.category], color: CATEGORY_FG[activity.category],
                fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 99,
                textTransform: 'uppercase', letterSpacing: 0.3,
              }}>
                {CATEGORY_EMOJI[activity.category]} {CATEGORY_LABEL[activity.category]}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href={mapsPlace(activity.lat, activity.lon, activity.name)}
                target="_blank" rel="noopener noreferrer"
                className="act-lnk"
                style={{ fontSize: 11, fontWeight: 700, color: '#374151', textDecoration: 'none', padding: '4px 10px', borderRadius: 20, border: '1px solid #E5E7EB', background: '#fff', transition: 'background 0.12s' }}
              >
                📍 Mapa
              </a>
              {activity.website && (
                <a
                  href={activity.website} target="_blank" rel="noopener noreferrer"
                  className="act-lnk"
                  style={{ fontSize: 11, fontWeight: 700, color: '#374151', textDecoration: 'none', padding: '4px 10px', borderRadius: 20, border: '1px solid #E5E7EB', background: '#fff', transition: 'background 0.12s' }}
                >
                  🌐 Web
                </a>
              )}
              <button
                className="act-detail"
                onClick={onShowDetail}
                style={{ fontSize: 11, fontWeight: 700, color: '#374151', padding: '4px 10px', borderRadius: 20, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s, color 0.12s, border-color 0.12s' }}
              >
                Ver detalles →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
