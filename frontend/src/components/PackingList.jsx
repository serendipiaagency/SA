import { useMemo } from 'react';

const BEACH_DESTS = new Set(['Algarve', 'Malta·Valletta', 'Riviera Albanesa·Saranda']);
const MOUNTAIN_DESTS = new Set(['Bled', 'Asturias']);

function getSeason(dateStr) {
  const m = new Date(dateStr + 'T00:00:00Z').getUTCMonth();
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 11 || m <= 1) return 'winter';
  return 'shoulder';
}

export default function PackingList({ itinerary, onClose }) {
  const dest = itinerary.destination || {};
  const season = getSeason(itinerary.start_date);
  const days = itinerary.days.length;
  const isBeach = BEACH_DESTS.has(dest.name);
  const isMountain = MOUNTAIN_DESTS.has(dest.name);
  const isLong = days >= 8;

  const sections = useMemo(() => {
    const docs = [
      'DNI / Pasaporte (vigente)',
      'Seguro de viaje (póliza en app o impresa)',
      'Reservas de alojamiento guardadas offline',
      'Tarjeta bancaria sin comisiones en el extranjero',
      'EHIC / Tarjeta sanitaria europea',
      'Número de emergencias local anotado',
    ];

    const clothing = ['Ropa interior (1 por día, máx. 7)', 'Calcetines (1 por día, máx. 7)'];
    if (season === 'summer') {
      clothing.push('Camisetas ligeras (x4)', 'Pantalones cortos / shorts (x2)', 'Gafas de sol', 'Sombrero o gorra');
      if (isBeach) clothing.push('Bañador (x2)', 'Pareo / toalla de playa', 'Chancletas');
      else clothing.push('Vestido / ropa ligera de noche');
    } else if (season === 'winter') {
      clothing.push('Jersey o forro polar', 'Abrigo o chaqueta de invierno', 'Bufanda y guantes', 'Gorro', 'Pantalones largos (x2)', 'Botas o zapatos impermeables');
    } else {
      clothing.push('Capas: camiseta + jersey ligero', 'Chaqueta cortavientos', 'Pantalones largos (x2)', 'Zapatillas cómodas para caminar');
    }
    if (isMountain) clothing.push('Pantalón de trekking', 'Calcetines de montaña', 'Bastones de senderismo (opcional)');
    clothing.push('Pijama o ropa de dormir');
    if (isLong) clothing.push('Bolsas separadoras para ropa sucia');

    const hygiene = [
      'Cepillo y pasta de dientes',
      'Desodorante (formato viaje)',
      'Champú + acondicionador (formato viaje)',
      'Protector solar SPF 50+',
    ];
    if (season === 'summer' || isBeach) hygiene.push('Aftersun / loción hidratante', 'Repelente de mosquitos');
    hygiene.push('Medicamentos habituales', 'Analgésico (ibuprofeno / paracetamol)', 'Antihistamínico', 'Tiritas + desinfectante en spray');

    const tech = ['Smartphone + cable de carga', 'Adaptador de corriente universal', 'Power bank (≥10.000 mAh)', 'Auriculares'];
    if (!isLong) tech.push('Funda impermeable para el móvil');
    else tech.push('Portátil / tablet (si necesario)', 'Funda impermeable para el móvil');

    const extras = ['Mochila de día (20–30 L)', 'Botella de agua reutilizable', 'Candado para maleta o taquilla'];
    if (isBeach || isMountain) extras.push('Toalla de microfibra compacta');
    extras.push('Snacks para el viaje (frutos secos, barrita)', 'Tapones para los oídos', 'Libro / entretenimiento offline');
    if (isLong) extras.push('Cuerdas de ropa o pinzas para lavar', 'Mini costurero');

    const seasonLabel = season === 'summer' ? '☀️ Verano' : season === 'winter' ? '❄️ Invierno' : '🍂 Temporada media';

    return {
      seasonLabel,
      list: [
        { title: '📄 Documentos', items: docs },
        { title: '👔 Ropa', items: clothing },
        { title: '🧴 Higiene y salud', items: hygiene },
        { title: '🔌 Tecnología', items: tech },
        { title: '🎒 Extras', items: extras },
      ],
    };
  }, [season, isBeach, isMountain, isLong, days]);

  return (
    <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={s.modal}>
        <div style={s.head}>
          <div>
            <div style={s.headTitle}>🧳 Lista de equipaje</div>
            <div style={s.headSub}>
              {dest.name} · {days} día{days !== 1 ? 's' : ''} · {sections.seasonLabel}
              {isBeach ? ' · 🏖 Playa' : isMountain ? ' · ⛰ Montaña' : ''}
            </div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.body}>
          {sections.list.map(sec => (
            <div key={sec.title} style={s.section}>
              <div style={s.secTitle}>{sec.title}</div>
              <div style={s.items}>
                {sec.items.map(item => (
                  <label key={item} style={s.item}>
                    <input type="checkbox" style={s.cb} />
                    <span style={s.itemText}>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <p style={s.footer}>Marca los ítems conforme los metes en la maleta ✓</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 400,
    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  },
  modal: {
    background: '#fff', borderRadius: '24px 24px 0 0',
    width: '100%', maxWidth: 680, maxHeight: '88vh',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
    animation: 'slideUp 0.28s ease',
  },
  head: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: '20px 24px 16px', borderBottom: '1.5px solid #F0EDE8', flexShrink: 0,
  },
  headTitle: { fontSize: 17, fontWeight: 800, color: '#1A1A1A' },
  headSub: { fontSize: 12, color: '#888', marginTop: 3 },
  closeBtn: {
    background: '#F5F5F0', border: 'none', borderRadius: '50%',
    width: 34, height: 34, fontSize: 14, fontWeight: 700, color: '#666',
    cursor: 'pointer', flexShrink: 0,
  },
  body: { overflowY: 'auto', padding: '16px 24px 32px', display: 'flex', flexDirection: 'column', gap: 20 },
  section: {},
  secTitle: {
    fontSize: 12, fontWeight: 800, color: '#0D3B2E', marginBottom: 10,
    paddingBottom: 6, borderBottom: '1px solid #F0EDE8',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  items: { display: 'flex', flexDirection: 'column', gap: 8 },
  item: { display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' },
  cb: { accentColor: '#0D3B2E', width: 16, height: 16, flexShrink: 0, marginTop: 2, cursor: 'pointer' },
  itemText: { fontSize: 14, color: '#374151', lineHeight: 1.4 },
  footer: { fontSize: 12, color: '#BBB', textAlign: 'center', marginTop: 8 },
};
