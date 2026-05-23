import { useEffect, useState } from 'react';

const WMO = {
  0:'☀️', 1:'🌤️', 2:'⛅', 3:'☁️',
  45:'🌫️', 48:'🌫️',
  51:'🌦️', 53:'🌦️', 55:'🌧️',
  61:'🌧️', 63:'🌧️', 65:'🌧️',
  71:'❄️', 73:'❄️', 75:'❄️', 77:'🌨️',
  80:'🌦️', 81:'🌧️', 82:'⛈️',
  85:'🌨️', 86:'❄️',
  95:'⛈️', 96:'⛈️', 99:'⛈️',
};

const WDAYS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const MONS  = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

export default function WeatherStrip({ lat, lon, startDate, endDate }) {
  const [daily, setDaily] = useState(null);

  useEffect(() => {
    if (!lat || !lon || !startDate || !endDate) return;
    const p = new URLSearchParams({
      latitude: lat, longitude: lon,
      daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max',
      timezone: 'auto', start_date: startDate, end_date: endDate,
    });
    fetch(`https://api.open-meteo.com/v1/forecast?${p}`)
      .then(r => r.json())
      .then(d => { if (d.daily?.time?.length) setDaily(d.daily); })
      .catch(() => {});
  }, [lat, lon, startDate, endDate]);

  if (!daily) return null;

  return (
    <div style={s.wrap} className="no-print">
      <div style={s.head}>
        <span style={s.headTitle}>☁️ Previsión meteorológica</span>
        <span style={s.headSub}>Open-Meteo · tiempo real</span>
      </div>
      <div style={s.row}>
        {daily.time.map((iso, i) => {
          const d = new Date(iso + 'T12:00:00Z');
          const icon = WMO[daily.weathercode[i]] ?? '🌡️';
          const tMax = Math.round(daily.temperature_2m_max[i]);
          const tMin = Math.round(daily.temperature_2m_min[i]);
          const rain = daily.precipitation_probability_max?.[i];
          return (
            <div key={iso} style={s.card}>
              <span style={s.wday}>{WDAYS[d.getUTCDay()]}</span>
              <span style={s.mday}>{d.getUTCDate()} {MONS[d.getUTCMonth()]}</span>
              <span style={s.icon}>{icon}</span>
              <span style={s.tMax}>{tMax}°</span>
              <span style={s.tMin}>{tMin}°</span>
              {rain != null && rain >= 20 && (
                <span style={s.rain}>💧{rain}%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  wrap: {
    background: '#fff', borderRadius: 16, border: '1.5px solid #F0EDE8',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 40, overflow: 'hidden',
  },
  head: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 20px 10px', borderBottom: '1px solid #F5F5F0',
  },
  headTitle: { fontSize: 13, fontWeight: 700, color: '#1A1A1A' },
  headSub: { fontSize: 11, color: '#CCC' },
  row: { display: 'flex', overflowX: 'auto', paddingBottom: 2 },
  card: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
    padding: '12px 16px', minWidth: 72, flexShrink: 0,
    borderRight: '1px solid #F8F8F6',
  },
  wday: { fontSize: 9, fontWeight: 700, color: '#BBB', textTransform: 'uppercase', letterSpacing: 0.5 },
  mday: { fontSize: 11, fontWeight: 600, color: '#666' },
  icon: { fontSize: 22, margin: '4px 0' },
  tMax: { fontSize: 14, fontWeight: 800, color: '#1A1A1A' },
  tMin: { fontSize: 11, color: '#AAA' },
  rain: { fontSize: 10, color: '#4299E1', fontWeight: 700 },
};
