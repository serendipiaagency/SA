import { useState, useEffect, useCallback } from 'react';

// ── API helper ───────────────────────────────────────────────────────────────

function api(path, opts = {}) {
  const key = sessionStorage.getItem('sa_admin_key') || '';
  return fetch('/api/admin' + path, {
    ...opts,
    headers: { 'X-Admin-Key': key, 'Content-Type': 'application/json', ...(opts.headers || {}) },
  }).then(async r => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.detail || 'Error');
    return data;
  });
}

// ── Utility components ───────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      <div style={{
        width: 32, height: 32, border: '3px solid #E0DDD8',
        borderTopColor: '#0D3B2E', borderRadius: '50%',
        animation: 'admspin 0.7s linear infinite',
      }} />
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);
  return [toast, show];
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      background: toast.type === 'ok' ? '#0D3B2E' : '#DC2626',
      color: '#fff', borderRadius: 12, padding: '12px 22px',
      fontSize: 14, fontWeight: 700, boxShadow: '0 6px 28px rgba(0,0,0,0.22)',
      animation: 'admtoast 0.25s ease',
    }}>
      {toast.msg}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={ms.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={ms.box}>
        <div style={ms.header}>
          <span style={ms.title}>{title}</span>
          <button style={ms.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={ms.body}>{children}</div>
      </div>
    </div>
  );
}

const ms = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(0,0,0,0.52)',
    backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  box: {
    background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520,
    maxHeight: '90vh', display: 'flex', flexDirection: 'column',
    boxShadow: '0 24px 80px rgba(0,0,0,0.28)', animation: 'admmodal 0.2s ease',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 24px 0', flexShrink: 0,
  },
  title: { fontSize: 18, fontWeight: 800, color: '#1A1A1A' },
  closeBtn: {
    background: '#F5F5F0', border: 'none', borderRadius: '50%',
    width: 32, height: 32, fontSize: 13, fontWeight: 700, cursor: 'pointer', color: '#555',
  },
  body: { padding: '16px 24px 24px', overflowY: 'auto' },
};

function Field({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={fs.lbl}>{label}</label>
      <input style={fs.inp} {...props} />
    </div>
  );
}

function FieldSel({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={fs.lbl}>{label}</label>
      <select style={fs.inp} {...props}>{children}</select>
    </div>
  );
}

function FieldArea({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={fs.lbl}>{label}</label>
      <textarea style={{ ...fs.inp, resize: 'vertical', minHeight: 72 }} {...props} />
    </div>
  );
}

const fs = {
  lbl: { display: 'block', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 5 },
  inp: {
    width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #E0DDD8',
    fontSize: 14, color: '#1A1A1A', background: '#FAFAF8', fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
  },
};

function DeleteBtn({ onDelete, label = 'Eliminar' }) {
  const [confirm, setConfirm] = useState(false);
  if (confirm) {
    return (
      <span style={{ display: 'inline-flex', gap: 4 }}>
        <button style={dbs.yes} onClick={onDelete}>Confirmar</button>
        <button style={dbs.no} onClick={() => setConfirm(false)}>Cancelar</button>
      </span>
    );
  }
  return <button style={dbs.del} onClick={() => setConfirm(true)}>{label}</button>;
}

const dbs = {
  del: { fontSize: 12, fontWeight: 700, color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' },
  yes: { fontSize: 12, fontWeight: 700, color: '#fff', background: '#DC2626', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' },
  no:  { fontSize: 12, fontWeight: 700, color: '#555', background: '#F5F5F0', border: '1px solid #E0DDD8', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' },
};

// ── KPI Card ─────────────────────────────────────────────────────────────────

function StatCard({ emoji, label, value, color = '#0D3B2E' }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '20px 24px',
      border: '1.5px solid #F0EDE8', flex: '1 1 160px', minWidth: 140,
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ── Dashboard Panel ──────────────────────────────────────────────────────────

function DashboardPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/stats').then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return <p style={{ color: '#DC2626' }}>Error cargando stats.</p>;

  const maxCount = Math.max(...(stats.topDestinations.map(d => d.count)), 1);

  return (
    <div>
      <h2 style={ps.h2}>📊 Dashboard</h2>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
        <StatCard emoji="🗺️" label="Itinerarios generados" value={stats.itineraries} />
        <StatCard emoji="📍" label="Destinos activos" value={stats.destinations} />
        <StatCard emoji="🎯" label="Actividades" value={stats.activities} />
        <StatCard emoji="💶" label="Coste total generado" value={`€${Math.round(stats.totalRevenue).toLocaleString()}`} color="#B45309" />
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px', background: '#fff', borderRadius: 16, border: '1.5px solid #F0EDE8', padding: 24 }}>
          <h3 style={ps.h3}>Top destinos</h3>
          {stats.topDestinations.length === 0
            ? <p style={{ color: '#AAA', fontSize: 13 }}>Sin datos aún</p>
            : stats.topDestinations.map(d => (
              <div key={d.name} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700 }}>{d.name}</span>
                  <span style={{ color: '#888' }}>{d.count} viajes</span>
                </div>
                <div style={{ height: 8, background: '#F0EDE8', borderRadius: 99 }}>
                  <div style={{ height: 8, width: `${(d.count / maxCount) * 100}%`, background: '#0D3B2E', borderRadius: 99, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
        </div>

        <div style={{ flex: '2 1 360px', background: '#fff', borderRadius: 16, border: '1.5px solid #F0EDE8', padding: 24, overflowX: 'auto' }}>
          <h3 style={ps.h3}>Itinerarios recientes</h3>
          {stats.recentItineraries.length === 0
            ? <p style={{ color: '#AAA', fontSize: 13 }}>Sin itinerarios aún</p>
            : (
              <table style={tbl.t}>
                <thead>
                  <tr>{['ID','Destino','Fechas','Presupuesto','Coste'].map(h => (
                    <th key={h} style={tbl.th}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {stats.recentItineraries.map(r => (
                    <tr key={r.id} style={tbl.tr}>
                      <td style={tbl.td}>#{r.id}</td>
                      <td style={tbl.td}><b>{r.dest_name}</b><br/><span style={{ color: '#AAA', fontSize: 11 }}>{r.country}</span></td>
                      <td style={tbl.td}><span style={{ fontSize: 12 }}>{r.start_date} → {r.end_date}</span></td>
                      <td style={tbl.td}>€{r.budget}</td>
                      <td style={tbl.td}>€{Math.round(r.total_cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
}

// ── Destinations Panel ───────────────────────────────────────────────────────

function DestForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: '', country: '', lat: '', lon: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      const body = { name: form.name, country: form.country, lat: Number(form.lat), lon: Number(form.lon) };
      if (initial?.id) {
        await api(`/destinations/${initial.id}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await api('/destinations', { method: 'POST', body: JSON.stringify(body) });
      }
      onSave();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit}>
      <Field label="Nombre" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      <Field label="País" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required />
      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Latitud" type="number" step="any" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} required />
        <Field label="Longitud" type="number" step="any" value={form.lon} onChange={e => setForm(f => ({ ...f, lon: e.target.value }))} required />
      </div>
      {err && <p style={{ color: '#DC2626', fontSize: 13, marginBottom: 10 }}>{err}</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button type="button" style={btn.sec} onClick={onClose}>Cancelar</button>
        <button type="submit" style={btn.pri} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </form>
  );
}

function DestinationsPanel() {
  const [dests, setDests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, showToast] = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api('/destinations').then(setDests).finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  async function del(id) {
    try {
      await api(`/destinations/${id}`, { method: 'DELETE' });
      showToast('Destino eliminado');
      load();
    } catch (e) { showToast(e.message, 'err'); }
  }

  return (
    <div>
      <Toast toast={toast} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h2 style={{ ...ps.h2, margin: 0 }}>📍 Destinos</h2>
        <button style={btn.pri} onClick={() => setModal('new')}>+ Añadir destino</button>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tbl.t}>
            <thead>
              <tr>{['ID','Nombre','País','Lat','Lon','Actividades','Acciones'].map(h => (
                <th key={h} style={tbl.th}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {dests.map(d => (
                <tr key={d.id} style={tbl.tr}>
                  <td style={tbl.td}>{d.id}</td>
                  <td style={tbl.td}><b>{d.name}</b></td>
                  <td style={tbl.td}>{d.country}</td>
                  <td style={tbl.td}>{d.lat?.toFixed(4)}</td>
                  <td style={tbl.td}>{d.lon?.toFixed(4)}</td>
                  <td style={tbl.td}>{d.activity_count ?? 0}</td>
                  <td style={tbl.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={btn.sm} onClick={() => setModal(d)}>Editar</button>
                      <DeleteBtn onDelete={() => del(d.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'new' ? 'Nuevo destino' : `Editar: ${modal.name}`} onClose={() => setModal(null)}>
          <DestForm
            initial={modal === 'new' ? null : modal}
            onSave={() => { setModal(null); showToast('Destino guardado ✓'); load(); }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}

// ── Activities Panel ─────────────────────────────────────────────────────────

const CATS = ['culture','food','nature','adventure','shopping'];
const CAT_LABEL = { culture:'Cultura', food:'Gastronomía', nature:'Naturaleza', adventure:'Aventura', shopping:'Compras' };

function ActForm({ initial, dests, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    destination_id: dests[0]?.id || '', name: '', category: 'culture',
    lat: '', lon: '', opening_time: 900, closing_time: 2100,
    duration_minutes: 60, price: 0, rating: 4.0, description: '', website: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      const body = {
        destination_id: Number(form.destination_id),
        name: form.name, category: form.category,
        lat: Number(form.lat), lon: Number(form.lon),
        opening_time: Number(form.opening_time), closing_time: Number(form.closing_time),
        duration_minutes: Number(form.duration_minutes), price: Number(form.price),
        rating: Number(form.rating), description: form.description, website: form.website,
      };
      if (initial?.id) {
        await api(`/activities/${initial.id}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await api('/activities', { method: 'POST', body: JSON.stringify(body) });
      }
      onSave();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit}>
      <FieldSel label="Destino" value={form.destination_id} onChange={set('destination_id')} required>
        {dests.map(d => <option key={d.id} value={d.id}>{d.name} ({d.country})</option>)}
      </FieldSel>
      <Field label="Nombre" value={form.name} onChange={set('name')} required />
      <FieldSel label="Categoría" value={form.category} onChange={set('category')}>
        {CATS.map(c => <option key={c} value={c}>{CAT_LABEL[c]}</option>)}
      </FieldSel>
      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Latitud" type="number" step="any" value={form.lat} onChange={set('lat')} required />
        <Field label="Longitud" type="number" step="any" value={form.lon} onChange={set('lon')} required />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Apertura (hhmm)" type="number" value={form.opening_time} onChange={set('opening_time')} />
        <Field label="Cierre (hhmm)" type="number" value={form.closing_time} onChange={set('closing_time')} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Duración (min)" type="number" value={form.duration_minutes} onChange={set('duration_minutes')} />
        <Field label="Precio (€)" type="number" step="any" value={form.price} onChange={set('price')} />
        <Field label="Rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={set('rating')} />
      </div>
      <FieldArea label="Descripción" value={form.description} onChange={set('description')} />
      <Field label="Web oficial" type="url" value={form.website} onChange={set('website')} />
      {err && <p style={{ color: '#DC2626', fontSize: 13, marginBottom: 10 }}>{err}</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button type="button" style={btn.sec} onClick={onClose}>Cancelar</button>
        <button type="submit" style={btn.pri} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </form>
  );
}

function ActivitiesPanel() {
  const [acts, setActs] = useState([]);
  const [dests, setDests] = useState([]);
  const [filterDest, setFilterDest] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, showToast] = useToast();

  const loadDests = useCallback(() => api('/destinations').then(setDests), []);

  const load = useCallback(() => {
    setLoading(true);
    const qs = filterDest ? `?destination_id=${filterDest}` : '';
    api(`/activities${qs}`).then(setActs).finally(() => setLoading(false));
  }, [filterDest]);

  useEffect(() => { loadDests(); }, [loadDests]);
  useEffect(() => { load(); }, [load]);

  const visible = filterCat ? acts.filter(a => a.category === filterCat) : acts;

  async function del(id) {
    try {
      await api(`/activities/${id}`, { method: 'DELETE' });
      showToast('Actividad eliminada');
      load();
    } catch (e) { showToast(e.message, 'err'); }
  }

  return (
    <div>
      <Toast toast={toast} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <h2 style={{ ...ps.h2, margin: 0 }}>🎯 Actividades</h2>
        <button style={btn.pri} onClick={() => setModal('new')}>+ Añadir actividad</button>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <select style={{ ...fs.inp, width: 'auto', minWidth: 160 }} value={filterDest} onChange={e => setFilterDest(e.target.value)}>
          <option value="">Todos los destinos</option>
          {dests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button style={{ ...pill, ...(filterCat === '' ? pillA : {}) }} onClick={() => setFilterCat('')}>Todas</button>
          {CATS.map(c => (
            <button key={c} style={{ ...pill, ...(filterCat === c ? pillA : {}) }} onClick={() => setFilterCat(c)}>
              {CAT_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tbl.t}>
            <thead>
              <tr>{['ID','Nombre','Destino','Cat.','Precio','Rating','Duración','Acciones'].map(h => (
                <th key={h} style={tbl.th}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {visible.map(a => (
                <tr key={a.id} style={tbl.tr}>
                  <td style={tbl.td}>{a.id}</td>
                  <td style={tbl.td}><b>{a.name}</b></td>
                  <td style={tbl.td}>{a.dest_name}</td>
                  <td style={tbl.td}>{CAT_LABEL[a.category]}</td>
                  <td style={tbl.td}>{a.price > 0 ? `€${a.price}` : 'Gratis'}</td>
                  <td style={tbl.td}>⭐ {a.rating?.toFixed(1)}</td>
                  <td style={tbl.td}>{a.duration_minutes} min</td>
                  <td style={tbl.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={btn.sm} onClick={() => setModal(a)}>Editar</button>
                      <DeleteBtn onDelete={() => del(a.id)} />
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={8} style={{ ...tbl.td, textAlign: 'center', color: '#AAA', padding: '28px 0' }}>Sin actividades</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal && dests.length > 0 && (
        <Modal title={modal === 'new' ? 'Nueva actividad' : `Editar: ${modal.name}`} onClose={() => setModal(null)}>
          <ActForm
            initial={modal === 'new' ? null : modal}
            dests={dests}
            onSave={() => { setModal(null); showToast('Actividad guardada ✓'); load(); }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}

// ── Itineraries Panel ────────────────────────────────────────────────────────

function ItinerariesPanel() {
  const [itins, setItins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, showToast] = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api('/itineraries').then(setItins).finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  async function del(id) {
    try {
      await api(`/itineraries/${id}`, { method: 'DELETE' });
      showToast('Itinerario eliminado');
      load();
    } catch (e) { showToast(e.message, 'err'); }
  }

  return (
    <div>
      <Toast toast={toast} />
      <h2 style={ps.h2}>🗺️ Itinerarios</h2>

      {loading ? <Spinner /> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tbl.t}>
            <thead>
              <tr>{['ID','Destino','País','Fechas','Presupuesto','Coste total','Intereses','Acciones'].map(h => (
                <th key={h} style={tbl.th}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {itins.map(i => (
                <tr key={i.id} style={tbl.tr}>
                  <td style={tbl.td}>#{i.id}</td>
                  <td style={tbl.td}><b>{i.dest_name}</b></td>
                  <td style={tbl.td}>{i.country}</td>
                  <td style={tbl.td}><span style={{ fontSize: 12 }}>{i.start_date}<br/>{i.end_date}</span></td>
                  <td style={tbl.td}>€{i.budget}</td>
                  <td style={tbl.td}>€{Math.round(i.total_cost)}</td>
                  <td style={tbl.td}><span style={{ fontSize: 11, color: '#666' }}>{i.interests}</span></td>
                  <td style={tbl.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <a href={`/?id=${i.id}`} target="_blank" rel="noopener noreferrer" style={{ ...btn.sm, textDecoration: 'none', display: 'inline-block' }}>Ver</a>
                      <DeleteBtn onDelete={() => del(i.id)} />
                    </div>
                  </td>
                </tr>
              ))}
              {itins.length === 0 && (
                <tr><td colSpan={8} style={{ ...tbl.td, textAlign: 'center', color: '#AAA', padding: '28px 0' }}>Sin itinerarios</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Login screen ─────────────────────────────────────────────────────────────

function Login({ onLogin }) {
  const [key, setKey] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      sessionStorage.setItem('sa_admin_key', key);
      await fetch('/api/admin/stats', { headers: { 'X-Admin-Key': key } })
        .then(r => { if (!r.ok) throw new Error('Clave incorrecta'); return r.json(); });
      onLogin();
    } catch (e) {
      sessionStorage.removeItem('sa_admin_key');
      setErr(e.message);
    } finally { setLoading(false); }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0D3B2E', padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 380,
        boxShadow: '0 30px 90px rgba(0,0,0,0.35)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🌿</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0D3B2E' }}>Serendipia Admin</h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Panel de control</p>
        </div>
        <form onSubmit={submit}>
          <Field label="Clave de administrador" type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="••••••••••" required />
          {err && <p style={{ color: '#DC2626', fontSize: 13, marginBottom: 12 }}>{err}</p>}
          <button type="submit" style={{ ...btn.pri, width: '100%', padding: '12px 0', fontSize: 15, marginTop: 4 }} disabled={loading}>
            {loading ? 'Verificando…' : 'Entrar →'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Admin layout ────────────────────────────────────────────────────────

const TABS = [
  { id: 'dashboard',    label: 'Dashboard',     icon: '📊' },
  { id: 'destinations', label: 'Destinos',      icon: '📍' },
  { id: 'activities',   label: 'Actividades',   icon: '🎯' },
  { id: 'itineraries',  label: 'Itinerarios',   icon: '🗺️' },
];

export default function AdminPage({ onExit }) {
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem('sa_admin_key'));
  const [tab, setTab] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  function logout() {
    sessionStorage.removeItem('sa_admin_key');
    setAuthed(false);
  }

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F8F5', fontFamily: 'inherit' }}>
      <style>{`
        @keyframes admspin { to { transform: rotate(360deg); } }
        @keyframes admtoast { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes admmodal { from { opacity: 0; transform: scale(0.94) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .adm-tab:hover { background: rgba(255,255,255,0.08) !important; }
        @media (max-width: 700px) {
          .adm-sidebar { transform: translateX(-100%); }
          .adm-sidebar.open { transform: translateX(0); }
          .adm-main { margin-left: 0 !important; padding: 16px !important; }
          .adm-hamburger { display: flex !important; }
        }
      `}</style>

      {/* Mobile menu toggle */}
      <button
        className="adm-hamburger"
        style={{
          display: 'none', position: 'fixed', top: 14, left: 14, zIndex: 700,
          background: '#0D3B2E', border: 'none', borderRadius: 10, padding: '8px 12px',
          color: '#fff', fontSize: 18, cursor: 'pointer', alignItems: 'center',
        }}
        onClick={() => setMenuOpen(o => !o)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`adm-sidebar${menuOpen ? ' open' : ''}`}
        style={{
          width: 220, background: '#0D3B2E', color: '#fff', flexShrink: 0,
          display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0,
          height: '100vh', zIndex: 600, transition: 'transform 0.22s ease',
        }}
      >
        <div style={{ padding: '24px 20px 16px' }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>🌿</div>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.2 }}>Serendipia</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Admin Panel</div>
        </div>

        <nav style={{ flex: 1, padding: '0 10px' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              className="adm-tab"
              onClick={() => { setTab(t.id); setMenuOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: 13, fontWeight: tab === t.id ? 800 : 500,
                background: tab === t.id ? 'rgba(255,255,255,0.13)' : 'transparent',
                color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.65)',
                marginBottom: 3, fontFamily: 'inherit', transition: 'background 0.13s',
              }}
            >
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px 10px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 8 }}>
          {onExit && (
            <button className="adm-tab" onClick={onExit} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 13, background: 'transparent', color: 'rgba(255,255,255,0.6)',
              fontFamily: 'inherit', marginBottom: 6,
            }}>
              ← Volver a la app
            </button>
          )}
          <button className="adm-tab" onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontSize: 13, background: 'transparent', color: 'rgba(255,255,255,0.5)',
            fontFamily: 'inherit',
          }}>
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="adm-main" style={{ flex: 1, marginLeft: 220, padding: 32, minWidth: 0 }}>
        {tab === 'dashboard'    && <DashboardPanel />}
        {tab === 'destinations' && <DestinationsPanel />}
        {tab === 'activities'   && <ActivitiesPanel />}
        {tab === 'itineraries'  && <ItinerariesPanel />}
      </main>
    </div>
  );
}

// ── Shared style tokens ───────────────────────────────────────────────────────

const ps = {
  h2: { fontSize: 22, fontWeight: 900, color: '#1A1A1A', marginBottom: 20 },
  h3: { fontSize: 15, fontWeight: 800, color: '#1A1A1A', marginBottom: 14 },
};

const tbl = {
  t: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1.5px solid #F0EDE8', whiteSpace: 'nowrap' },
  td: { padding: '10px 12px', borderBottom: '1px solid #F5F3F0', verticalAlign: 'middle', color: '#374151' },
  tr: {},
};

const btn = {
  pri: { background: '#0D3B2E', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  sec: { background: '#F5F5F0', color: '#374151', border: '1.5px solid #E0DDD8', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  sm:  { background: '#F0FDF4', color: '#0D3B2E', border: '1px solid #BBF7D0', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
};

const pill = { padding: '5px 14px', borderRadius: 99, border: '1.5px solid #E0DDD8', background: '#F8F8F5', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#555', fontFamily: 'inherit' };
const pillA = { background: '#0D3B2E', color: '#fff', borderColor: '#0D3B2E' };
