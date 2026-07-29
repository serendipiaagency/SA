import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function fmt(hhmm) {
  if (hhmm == null) return '';
  return `${String(Math.floor(hhmm / 100)).padStart(2, '0')}:${String(hhmm % 100).padStart(2, '0')}`;
}

function makeIcon(n) {
  return L.divIcon({
    html: `<div style="background:#0D3B2E;color:#fff;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);">${n}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
    className: '',
  });
}

export default function MapView({ items }) {
  const ref = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const map = L.map(ref.current, { zoomControl: true });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const coords = [];

    items.forEach((item, i) => {
      const { lat, lon, name, price } = item.activity;
      if (!lat || !lon) return;
      coords.push([lat, lon]);

      L.marker([lat, lon], { icon: makeIcon(i + 1) })
        .bindPopup(`<div style="min-width:160px;font-family:system-ui,sans-serif;"><div style="font-weight:800;font-size:13px;margin-bottom:3px;">${name}</div><div style="font-size:11px;color:#666;">${fmt(item.start_time)} – ${fmt(item.end_time)}</div><div style="font-size:12px;font-weight:700;color:#0D3B2E;margin-top:3px;">${price > 0 ? '€' + price.toFixed(0) : 'Gratis'}</div></div>`)
        .addTo(map);
    });

    if (coords.length > 1) {
      L.polyline(coords, { color: '#0D3B2E', weight: 3, dashArray: '8, 6', opacity: 0.75 }).addTo(map);
    }

    if (coords.length === 1) {
      map.setView(coords[0], 14);
    } else if (coords.length > 1) {
      map.fitBounds(L.latLngBounds(coords), { padding: [40, 40] });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid #F0EDE8', marginBottom: 24 }}>
      <div ref={ref} style={{ height: 380, width: '100%' }} />
    </div>
  );
}
