import React, { useMemo, useState } from 'react';
import branchesService, { Branch } from '../services/branchesService';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

const emptyBranch = (id: string): Branch => ({ id, name: '', address: '', lat: -25.2969, lng: -57.6244, phone: '' });

const BranchesAdmin: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>(branchesService.getBranches());
  const [editing, setEditing] = useState<Branch | null>(null);

  const nextId = useMemo(() => 'suc-' + Date.now(), []);

  const startNew = () => setEditing(emptyBranch(nextId));
  const startEdit = (b: Branch) => setEditing({ ...b });
  const cancel = () => setEditing(null);

  const save = () => {
    if (!editing) return;
    branchesService.upsertBranch(editing);
    setBranches(branchesService.getBranches());
    setEditing(null);
  };

  const remove = (id: string) => {
    if (!confirm('Eliminar sucursal?')) return;
    branchesService.deleteBranch(id);
    setBranches(branchesService.getBranches());
  };

  return (
    <div>
      <h2>Sucursales</h2>
      <div style={{ marginBottom: 16 }}>
        <button className="btn-primary" onClick={startNew}>Nueva Sucursal</button>
      </div>

      {editing && (
        <div className="admin-panel" style={{ marginBottom: 24 }}>
          <div className="form-grid">
            <label>ID<input value={editing.id} onChange={e => setEditing({ ...editing, id: e.target.value })} /></label>
            <label>Nombre<input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></label>
            <label>Dirección<input value={editing.address} onChange={e => setEditing({ ...editing, address: e.target.value })} /></label>
            <label>Lat<input type="number" value={editing.lat} onChange={e => setEditing({ ...editing, lat: parseFloat(e.target.value)||0 })} step="0.0001" /></label>
            <label>Lng<input type="number" value={editing.lng} onChange={e => setEditing({ ...editing, lng: parseFloat(e.target.value)||0 })} step="0.0001" /></label>
            <label>Teléfono<input value={editing.phone} onChange={e => setEditing({ ...editing, phone: e.target.value })} /></label>
          </div>
          <p style={{ margin: '10px 0' }}>Arrastra el marcador para ajustar la ubicación</p>
          <div style={{ height: 320, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
            <MapContainer center={[editing.lat, editing.lng]} zoom={14} style={{height:'100%', width:'100%'}}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[editing.lat, editing.lng]} draggable eventHandlers={{ dragend: (e)=>{ const m = e.target as L.Marker; const pos = m.getLatLng(); setEditing({ ...editing, lat: pos.lat, lng: pos.lng }); } }} />
            </MapContainer>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button className="btn-primary" onClick={save}>Guardar</button>
            <button className="btn-secondary" onClick={cancel}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Dirección</th><th>Teléfono</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.name}</td>
                <td>{b.address}</td>
                <td>{b.phone}</td>
                <td>
                  <button className="btn-secondary" onClick={() => startEdit(b)}>Editar</button>{' '}
                  <button className="btn-secondary" onClick={() => remove(b.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchesAdmin;
