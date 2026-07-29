import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DAY_COLORS = ['#0D3B2E','#E65100','#1565C0','#880E4F','#6B21A8','#B45309','#0E7490'];

function fmt(hhmm) {
  if (hhmm == null) return '';
  return `${String(Math.floor(hhmm / 100)).padStart(2,'0')}:${String(hhmm % 100).padStart(2,'0')}`;
}

function makeIcon(n, color) {
  return L.divIcon({
    html: `<div style="background:${color};color:#fff;width:28px;height:28px;border-radius:50%;
           display:flex;align-items:center;justify-content:center;font-weight:900;font-size:11px;
           border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);">${n}</div>`,
    iconSize: [28,28], iconAnchor: [14,14], popupAnchor: [0,-16], className:'',
  });
}

export default function FullRouteMap({ days, onClose }) {
  const ref = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>', maxZoom: 19,
    }).addTo(map);

    const allCoords = [];

    days.forEach((day, dayIdx) => {
      const color = DAY_COLORS[dayIdx % DAY_COLORS.length];
      const dayCoords = [];
      day.items.forEach((item, i) => {
        const { lat, lon, name, price } = item.activity;
        if (!lat || !lon) return;
        allCoords.push([lat, lon]);
        dayCoords.push([lat, lon]);
        L.marker([lat, lon], { icon: makeIcon(i + 1, color) })
          .bindPopup(`
            <div style="font-family:system-ui,sans-serif;min-width:150px;padding:2px">
              <div style="font-size:10px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Día ${day.day_number}</div>
              <div style="font-weight:800;font-size:13px;margin-bottom:3px">${name}</div>
              <div style="font-size:11px;color:#666">${fmt(item.start_time)} – ${fmt(item.end_time)}</div>
              <div style="font-size:12px;font-weight:700;color:#0D3B2E;margin-top:4px">${price > 0 ? '€' + price.toFixed(0) : 'Gratis'}</div>
            </div>
          `)
          .addTo(map);
      });
      if (dayCoords.length > 1) {
        L.polyline(dayCoords, { color, weight: 3, dashArray: '8,6', opacity: 0.85 }).addTo(map);
      }
    });

    if (allCoords.length === 1) map.setView(allCoords[0], 14);
    else if (allCoords.length > 1) map.fitBounds(L.latLngBounds(allCoords), { padding: [40,40] });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  const totalActivities = days.reduce((s, d) => s + d.items.length, 0);

  return (
    <div style={s.overlay}>
      <div style={s.header}>
        <div style={s.headerLeft}>
          <span style={s.headerTitle}>Ruta completa</span>
          <span style={s.headerSub}>{days.length} día{days.length !== 1 ? 's' : ''} · {totalActivities} actividades</span>
        </div>
        <div style={s.legend}>
          {days.map((day, i) => (
            <span key={i} style={s.legendItem}>
              <span style={{ ...s.legendDot, background: DAY_COLORS[i % DAY_COLORS.length] }} />
              <span style={s.legendLabel}>Día {day.day_number}</span>
            </span>
          ))}
        </div>
        <button style={s.closeBtn} onClick={onClose}>✕ Cerrar</button>
      </div>
      <div ref={ref} style={s.map} />
    </div>
  );
}

const s = {
  overlay: { position:'fixed', inset:0, zIndex:400, display:'flex', flexDirection:'column' },
  header: {
    background:'#0D3B2E', padding:'14px 20px',
    display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap',
    flexShrink:0,
  },
  headerLeft: { display:'flex', alignItems:'baseline', gap:12 },
  headerTitle: { color:'#fff', fontWeight:800, fontSize:16 },
  headerSub: { color:'rgba(255,255,255,0.55)', fontSize:13 },
  legend: { display:'flex', gap:14, alignItems:'center', flexWrap:'wrap', flex:1, justifyContent:'center' },
  legendItem: { display:'flex', alignItems:'center', gap:5 },
  legendDot: { width:10, height:10, borderRadius:'50%', display:'inline-block', flexShrink:0 },
  legendLabel: { color:'rgba(255,255,255,0.8)', fontSize:12, fontWeight:600 },
  closeBtn: {
    background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)',
    color:'#fff', padding:'8px 16px', borderRadius:8, fontWeight:700, fontSize:13, flexShrink:0,
  },
  map: { flex:1 },
};
