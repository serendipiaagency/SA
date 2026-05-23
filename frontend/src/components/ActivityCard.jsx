const CATEGORY_EMOJI = { culture:'🏙', food:'🍽', nature:'🌿', adventure:'🧗', shopping:'🛍' };
const CATEGORY_LABEL = { culture:'Cultura', food:'Gastronomía', nature:'Naturaleza', adventure:'Aventura', shopping:'Compras' };
const CATEGORY_BG    = { culture:'#EBF4FF', food:'#FFF8E1', nature:'#F0FDF4', adventure:'#FFF3E0', shopping:'#FCE4EC' };
const CATEGORY_FG    = { culture:'#1565C0', food:'#E65100', nature:'#2E7D32', adventure:'#BF360C', shopping:'#880E4F' };
const CATEGORY_PHOTO = {
  culture:   '1564349683136-77e08dba1ef3',
  food:      '1504674900247-0877df9cc836',
  nature:    '1501854140801-50d01698950b',
  adventure: '1551632811-561732d1e306',
  shopping:  '1555529669-e69e7aa0ba9a',
};

function Stars({ rating }) {
  const full = Math.floor(rating || 0);
  const half = (rating || 0) - full >= 0.5;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{
          fontSize: 11,
          color: i <= full ? '#F59E0B' : (i === full + 1 && half ? '#F59E0B' : '#E0DDD8'),
          opacity: i === full + 1 && half ? 0.55 : 1,
        }}>★</span>
      ))}
      <span style={{ fontSize: 11, color: '#666', fontWeight: 700, marginLeft: 3 }}>
        {(rating || 0).toFixed(1)}
      </span>
    </span>
  );
}

function fmt(hhmm) {
  if (hhmm == null) return '--:--';
  return `${String(Math.floor(hhmm / 100)).padStart(2, '0')}:${String(hhmm % 100).padStart(2, '0')}`;
}

function taxiCost(min) {
  const km = (min / 60) * 25;
  return Math.round(3 + km * 1.2);
}

function mapsDir(aLat, aLon, bLat, bLon, walk) {
  return `https://www.google.com/maps/dir/?api=1&origin=${aLat},${aLon}&destination=${bLat},${bLon}&travelmode=${walk ? 'walking' : 'driving'}`;
}

function mapsPlace(lat, lon, name) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&center=${lat},${lon}`;
}

export default function ActivityCard({ item, isFirst, prevActivity }) {
  const { activity, start_time, end_time, travel_minutes_from_prev } = item;
  const walk  = travel_minutes_from_prev <= 30;
  const tCost = walk ? 0 : taxiCost(travel_minutes_from_prev);
  const photo = `https://images.unsplash.com/photo-${CATEGORY_PHOTO[activity.category]}?w=400&auto=format&fit=crop&q=70`;

  return (
    <div style={s.wrapper}>
      <style>{`
        @media (max-width: 500px) {
          .act-img { display: none !important; }
          .act-time { min-width: 46px !important; }
        }
      `}</style>
      {!isFirst && travel_minutes_from_prev > 0 && (
        <div style={s.leg}>
          <div style={s.legLine} />
          <span style={s.legIcon}>{walk ? '🚶' : '🚕'}</span>
          <span style={s.legText}>
            {walk ? 'A pie' : 'Taxi / bus'} · {travel_minutes_from_prev} min
            {tCost > 0 && <> · <b>~€{tCost}</b></>}
          </span>
          {prevActivity && (
            <a href={mapsDir(prevActivity.lat, prevActivity.lon, activity.lat, activity.lon, walk)}
               target="_blank" rel="noopener noreferrer" style={s.dirBtn}>
              Cómo llegar ↗
            </a>
          )}
        </div>
      )}

      <div style={s.card}>
        <div style={s.timeCol} className="act-time">
          <span style={s.t1}>{fmt(start_time)}</span>
          <div style={s.tLine} />
          <span style={s.t2}>{fmt(end_time)}</span>
        </div>

        <div style={s.imgWrap} className="act-img">
          <img src={photo} alt={activity.category} style={s.img}
               onError={e => { e.target.style.display = 'none'; }} />
          <span style={{ ...s.catPill, background: CATEGORY_BG[activity.category], color: CATEGORY_FG[activity.category] }}>
            {CATEGORY_EMOJI[activity.category]} {CATEGORY_LABEL[activity.category]}
          </span>
        </div>

        <div style={s.info}>
          <h4 style={s.name}>{activity.name}</h4>
          {activity.description && <p style={s.desc}>{activity.description}</p>}

          <div style={s.meta}>
            <Stars rating={activity.rating} />
            <span style={s.dot}>·</span>
            <span>⏱ {activity.duration_minutes} min</span>
            {activity.opening_time != null && (
              <>
                <span style={s.dot}>·</span>
                <span>🕐 {fmt(activity.opening_time)}–{fmt(activity.closing_time)}</span>
              </>
            )}
            <span style={s.dot}>·</span>
            <span style={activity.price > 0 ? s.paid : s.free}>
              {activity.price > 0 ? `💶 €${activity.price.toFixed(0)}` : '✓ Gratis'}
            </span>
          </div>

          <div style={s.links}>
            <a href={mapsPlace(activity.lat, activity.lon, activity.name)}
               target="_blank" rel="noopener noreferrer" style={s.lnk}>
              📍 Ver en mapa
            </a>
            {activity.website && (
              <a href={activity.website} target="_blank" rel="noopener noreferrer" style={s.lnk}>
                🌐 Web oficial
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrapper: { marginBottom: 0 },
  leg: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '6px 0 6px 52px' },
  legLine: { width: 2, height: 28, background: '#E0DDD8', flexShrink: 0 },
  legIcon: { fontSize: 16 },
  legText: { fontSize: 13, color: '#666' },
  dirBtn: { fontSize: 11, fontWeight: 700, color: '#0D3B2E', textDecoration: 'none', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 20, padding: '3px 10px' },
  card: { display: 'flex', alignItems: 'stretch', background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1.5px solid #F0EDE8', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' },
  timeCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 52, padding: '14px 0', gap: 2, flexShrink: 0 },
  t1: { fontSize: 12, fontWeight: 800, color: '#0D3B2E' },
  t2: { fontSize: 11, fontWeight: 600, color: '#AAA' },
  tLine: { width: 2, flex: 1, background: '#E8E5E0', minHeight: 16, margin: '3px 0' },
  imgWrap: { width: 110, minWidth: 110, position: 'relative', overflow: 'hidden', flexShrink: 0, background: '#F5F5F0' },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  catPill: { position: 'absolute', bottom: 8, left: 6, right: 6, fontSize: 9, fontWeight: 800, padding: '3px 6px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center' },
  info: { flex: 1, padding: '14px 16px 14px 14px', minWidth: 0 },
  name: { fontSize: 15, fontWeight: 800, color: '#1A1A1A', marginBottom: 5, lineHeight: 1.3 },
  desc: { fontSize: 12, color: '#666', lineHeight: 1.5, marginBottom: 8 },
  meta: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, fontSize: 12, color: '#555', marginBottom: 10 },
  dot: { color: '#DDD' },
  free: { fontWeight: 700, color: '#2E7D32' },
  paid: { fontWeight: 700, color: '#1A1A1A' },
  links: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  lnk: { fontSize: 11, fontWeight: 700, color: '#0D3B2E', textDecoration: 'none', padding: '4px 10px', borderRadius: 20, border: '1.5px solid #E0DDD8', background: '#FAFAF8' },
};
