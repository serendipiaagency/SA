const CATEGORY_EMOJI = { culture:'🏛', food:'🍽', nature:'🌿', adventure:'🧗', shopping:'🛍' };
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
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{
          fontSize: 18,
          color: i <= full ? '#F59E0B' : (i === full + 1 && half ? '#F59E0B' : '#E0DDD8'),
          opacity: i === full + 1 && half ? 0.55 : 1,
        }}>★</span>
      ))}
      <span style={{ fontSize: 14, color: '#666', fontWeight: 700, marginLeft: 5 }}>
        {(rating || 0).toFixed(1)}
      </span>
    </span>
  );
}

function fmt(hhmm) {
  if (hhmm == null) return '--:--';
  return `${String(Math.floor(hhmm / 100)).padStart(2, '0')}:${String(hhmm % 100).padStart(2, '0')}`;
}

export default function ActivityDetailModal({ activity, isFav, onToggleFavorite, onClose }) {
  const photo = `https://images.unsplash.com/photo-${CATEGORY_PHOTO[activity.category]}?w=800&auto=format&fit=crop&q=80`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.name)}&center=${activity.lat},${activity.lon}`;

  return (
    <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(14px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        .adm-fav-btn:hover { transform: scale(1.18) !important; }
        .adm-map-btn:hover { opacity: 0.88 !important; }
      `}</style>
      <div style={s.modal}>
        <div style={s.imgWrap}>
          <img src={photo} alt={activity.category} style={s.img}
               onError={e => { e.target.style.display = 'none'; }} />
          <div style={s.imgOverlay} />

          <button style={s.closeBtn} onClick={onClose}>✕</button>

          <button
            className="adm-fav-btn"
            style={{ ...s.favBtn, color: isFav ? '#F43F5E' : 'rgba(255,255,255,0.65)' }}
            onClick={onToggleFavorite}
            title={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            {isFav ? '♥' : '♡'}
          </button>

          <span style={{ ...s.catBadge, background: CATEGORY_BG[activity.category], color: CATEGORY_FG[activity.category] }}>
            {CATEGORY_EMOJI[activity.category]} {CATEGORY_LABEL[activity.category]}
          </span>
        </div>

        <div style={s.body}>
          <h2 style={s.name}>{activity.name}</h2>

          <div style={s.ratingRow}>
            <Stars rating={activity.rating} />
          </div>

          {activity.description && <p style={s.desc}>{activity.description}</p>}

          <div style={s.metaGrid}>
            <div style={s.metaItem}>
              <span style={s.metaEmoji}>⏱</span>
              <div>
                <div style={s.metaLbl}>Duración</div>
                <div style={s.metaVal}>{activity.duration_minutes} min</div>
              </div>
            </div>

            <div style={s.metaItem}>
              <span style={s.metaEmoji}>{activity.price > 0 ? '💶' : '✅'}</span>
              <div>
                <div style={s.metaLbl}>Entrada</div>
                <div style={{ ...s.metaVal, color: activity.price > 0 ? '#1A1A1A' : '#2E7D32' }}>
                  {activity.price > 0 ? `€${activity.price.toFixed(0)}` : 'Gratis'}
                </div>
              </div>
            </div>

            {activity.opening_time != null && (
              <div style={s.metaItem}>
                <span style={s.metaEmoji}>🕐</span>
                <div>
                  <div style={s.metaLbl}>Horario</div>
                  <div style={s.metaVal}>{fmt(activity.opening_time)} – {fmt(activity.closing_time)}</div>
                </div>
              </div>
            )}
          </div>

          <div style={s.linkRow}>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
               className="adm-map-btn" style={s.mapBtn}>
              📍 Abrir en Google Maps
            </a>
            {activity.website && (
              <a href={activity.website} target="_blank" rel="noopener noreferrer" style={s.webBtn}>
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
  overlay: {
    position: 'fixed', inset: 0, zIndex: 550,
    background: 'rgba(0,0,0,0.58)', backdropFilter: 'blur(7px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 16,
  },
  modal: {
    background: '#fff', borderRadius: 24, width: '100%', maxWidth: 500,
    maxHeight: '90vh', overflow: 'hidden',
    boxShadow: '0 28px 90px rgba(0,0,0,0.32)',
    animation: 'modalIn 0.22s ease',
    display: 'flex', flexDirection: 'column',
  },
  imgWrap: { position: 'relative', height: 220, background: '#F5F5F0', flexShrink: 0, overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  imgOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, transparent 55%)',
  },
  closeBtn: {
    position: 'absolute', top: 14, right: 14, width: 36, height: 36,
    borderRadius: '50%', background: 'rgba(0,0,0,0.48)', border: 'none',
    color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  favBtn: {
    position: 'absolute', top: 14, right: 58, width: 36, height: 36,
    borderRadius: '50%', background: 'rgba(0,0,0,0.36)', border: 'none',
    fontSize: 19, cursor: 'pointer', transition: 'transform 0.15s ease',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  catBadge: {
    position: 'absolute', bottom: 12, left: 14,
    fontSize: 10, fontWeight: 800, padding: '4px 11px', borderRadius: 20,
    textTransform: 'uppercase', letterSpacing: 0.3,
  },
  body: { padding: '20px 24px 28px', overflowY: 'auto' },
  name: { fontSize: 22, fontWeight: 900, color: '#1A1A1A', marginBottom: 8, lineHeight: 1.25 },
  ratingRow: { marginBottom: 14 },
  desc: { fontSize: 14, color: '#555', lineHeight: 1.68, marginBottom: 20 },
  metaGrid: {
    display: 'flex', gap: 12, flexWrap: 'wrap',
    background: '#F8F8F5', borderRadius: 14, padding: 16, marginBottom: 20,
  },
  metaItem: { display: 'flex', alignItems: 'flex-start', gap: 10, flex: '1 1 auto', minWidth: 100 },
  metaEmoji: { fontSize: 20, flexShrink: 0, marginTop: 1 },
  metaLbl: { fontSize: 10, fontWeight: 700, color: '#AAA', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 3 },
  metaVal: { fontSize: 14, fontWeight: 700, color: '#374151' },
  linkRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  mapBtn: {
    flex: 1, textAlign: 'center', textDecoration: 'none',
    padding: '12px 16px', borderRadius: 12,
    background: '#0D3B2E', color: '#fff', fontSize: 13, fontWeight: 700,
  },
  webBtn: {
    flex: 1, textAlign: 'center', textDecoration: 'none',
    padding: '12px 16px', borderRadius: 12,
    background: '#F5F5F0', color: '#374151', fontSize: 13, fontWeight: 700,
    border: '1.5px solid #E0DDD8',
  },
};
