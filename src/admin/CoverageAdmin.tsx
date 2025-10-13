import React, { useMemo, useState, useRef, useEffect } from 'react';
import coverageService, { CoverageArea } from '../services/coverageService';
import { MapContainer, TileLayer, FeatureGroup, Polygon } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

const emptyArea = (id: string): CoverageArea => ({ id, name: '', color: '#2f86eb', weight: 2, fillOpacity: 0.2, coordinates: [] });

const CoverageAdmin: React.FC = () => {
  const [areas, setAreas] = useState<CoverageArea[]>(coverageService.getCoverage());
  const [editing, setEditing] = useState<CoverageArea | null>(null);
  const nextId = useMemo(() => 'area-' + Date.now(), []);

  const startNew = () => setEditing(emptyArea(nextId));
  const startEdit = (a: CoverageArea) => setEditing(JSON.parse(JSON.stringify(a)) as CoverageArea);
  const cancel = () => setEditing(null);

  const save = () => {
    if (!editing) return;
    coverageService.upsertArea(editing);
    setAreas(coverageService.getCoverage());
    setEditing(null);
  };

  const remove = (id: string) => {
    if (!confirm('Eliminar área?')) return;
    coverageService.deleteArea(id);
    setAreas(coverageService.getCoverage());
  };

  const addCoord = () => {
    if (!editing) return;
    setEditing({ ...editing, coordinates: [...editing.coordinates, [-25.3, -57.6]] });
  };

  const updateCoord = (index: number, key: 'lat'|'lng', value: number) => {
    if (!editing) return;
    const coords = editing.coordinates.map((c, i) => i === index ? (key==='lat' ? [value, c[1]] : [c[0], value]) as [number, number] : c);
    setEditing({ ...editing, coordinates: coords });
  };

  const removeCoord = (index: number) => {
    if (!editing) return;
    setEditing({ ...editing, coordinates: editing.coordinates.filter((_, i) => i !== index) });
  };

  const onCreated = (e: any) => {
    if (!editing) return;
    const layer = e.layer;
    const latlngs = layer.getLatLngs()[0] || [];
    const coords = latlngs.map((p: any) => [p.lat, p.lng]) as [number, number][];
    setEditing({ ...editing, coordinates: coords });
  };

  const onEdited = (e: any) => {
    if (!editing) return;
    const layers = e.layers.getLayers();
    if (layers.length > 0) {
      const latlngs = layers[0].getLatLngs()[0] || [];
      const coords = latlngs.map((p: any) => [p.lat, p.lng]) as [number, number][];
      setEditing({ ...editing, coordinates: coords });
    }
  };

  return (
    <div>
      <h2>Áreas de Cobertura</h2>
      <div style={{ marginBottom: 16 }}>
        <button className="btn-primary" onClick={startNew}>Nueva Área</button>
      </div>

      {editing && (
        <div className="admin-panel" style={{ marginBottom: 24 }}>
          <div className="form-grid">
            <label>ID<input value={editing.id} onChange={e => setEditing({ ...editing, id: e.target.value })} /></label>
            <label>Nombre<input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></label>
            <label>Color<input value={editing.color} onChange={e => setEditing({ ...editing, color: e.target.value })} /></label>
            <label>Grosor<input type="number" value={editing.weight} onChange={e => setEditing({ ...editing, weight: parseInt(e.target.value)||1 })} /></label>
            <label>Opacidad<input type="number" step="0.05" value={editing.fillOpacity} onChange={e => setEditing({ ...editing, fillOpacity: parseFloat(e.target.value)||0 })} /></label>
          </div>
          <div style={{ marginTop: 12 }}>
            <h3>Dibuja o edita el polígono en el mapa</h3>
            <div style={{ height: 380, borderRadius: 8, overflow: 'hidden' }}>
              <MapContainer center={editing.coordinates[0] ? [editing.coordinates[0][0], editing.coordinates[0][1]] : [-25.2969,-57.6244]} zoom={12} style={{height:'100%', width:'100%'}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FeatureGroup>
                  <EditControl
                    position='topright'
                    onCreated={onCreated}
                    onEdited={onEdited}
                    draw={{ rectangle: false, circle: false, marker: false, circlemarker: false, polyline: false }}
                  />
                  {editing.coordinates.length > 2 && (
                    <Polygon positions={editing.coordinates as any} pathOptions={{ color: editing.color, weight: editing.weight, fillOpacity: editing.fillOpacity }} />
                  )}
                </FeatureGroup>
              </MapContainer>
            </div>
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
              <th>ID</th><th>Nombre</th><th>Puntos</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {areas.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>{a.coordinates.length}</td>
                <td>
                  <button className="btn-secondary" onClick={() => startEdit(a)}>Editar</button>{' '}
                  <button className="btn-secondary" onClick={() => remove(a.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoverageAdmin;
