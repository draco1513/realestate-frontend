import { useState } from 'react';
import {
  MagnifyingGlass, PencilSimple, Trash, Sliders,
  Buildings, CaretLeft, CaretRight,
} from '@phosphor-icons/react';
import { useDepartments } from '../../hooks/useDepartments';
import DepartmentModal from '../Department/DepartmentModal';
import DeleteModal from '../Department/DeleteModal';
import toast from 'react-hot-toast';

const STATUS_MAP = {
  AVAILABLE: { label: 'Disponible', cls: 'badge-available' },
  RENTED: { label: 'Alquilado', cls: 'badge-rented' },
  SOLD: { label: 'Vendido', cls: 'badge-sold' },
};

function initials(addr = '') {
  const w = addr.trim().split(' ');
  return ((w[0]?.[0] || '') + (w[1]?.[0] || '')).toUpperCase();
}

export default function DepartmentList() {
  const {
    data, filters, loading, districts, selected,
    applyFilters, changePage,
    create, update, remove,
    toggleSelect, toggleSelectAll,
  } = useDepartments();

  const [localDist, setLocalDist] = useState('');
  const [localStatus, setLocalStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [tableSearch, setTableSearch] = useState('');

  const [editModal, setEditModal] = useState({ open: false, item: null });
  const [deleteModal, setDeleteModal] = useState({ open: false });
  const [delLoading, setDelLoading] = useState(false);

  const handleSearch = () =>
    applyFilters({ district: localDist, status: localStatus, search: tableSearch, pageSize: filters.pageSize });

  const handleTableSearch = (v) => {
    setTableSearch(v);
    applyFilters({ district: localDist, status: localStatus, search: v, pageSize: filters.pageSize });
  };

  const handleEdit = () => {
    if (selected.length !== 1) { toast('Selecciona exactamente 1 departamento'); return; }
    const item = data.data.find(d => d.id === selected[0]);
    setEditModal({ open: true, item });
  };

  const handleDelete = () => {
    if (!selected.length) { toast('Selecciona al menos 1 departamento'); return; }
    setDeleteModal({ open: true });
  };

  const confirmDelete = async () => {
    setDelLoading(true);
    try {
      for (const id of selected) await remove(id);
      setDeleteModal({ open: false });
    } finally {
      setDelLoading(false);
    }
  };

  const { data: rows = [], totalRecords, page, pageSize, totalPages } = data;
  const allSelected = rows.length > 0 && selected.length === rows.length;

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">Listado de departamentos</h1>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn-filters" onClick={() => setShowFilters(v => !v)}>
            <Sliders size={15} /> Filtros
          </button>
          <button className="btn btn-primary" onClick={() => setEditModal({ open: true, item: null })}>
            + Nuevo
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="card filter-bar" style={{ marginBottom: 16 }}>
          <select value={localDist} onChange={e => setLocalDist(e.target.value)} aria-label="Filtrar por distrito">
            <option value="">Todos los distritos</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={localStatus} onChange={e => setLocalStatus(e.target.value)} aria-label="Filtrar por estado">
            <option value="">Todos los estados</option>
            <option value="AVAILABLE">Disponible</option>
            <option value="RENTED">Alquilado</option>
            <option value="SOLD">Vendido</option>
          </select>
          <button className="btn btn-primary" onClick={handleSearch} style={{ minWidth: 100 }}>
            <MagnifyingGlass size={15} /> Buscar
          </button>
        </div>
      )}

      <div className="card">
        <div className="action-bar">
          <button className="btn btn-outline" onClick={handleEdit} disabled={selected.length !== 1}>
            <PencilSimple size={14} /> Editar
          </button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={!selected.length}>
            <Trash size={14} /> Eliminar
          </button>
        </div>

        <div className="table-search">
          <input
            type="text"
            placeholder="Buscar..."
            value={tableSearch}
            onChange={e => handleTableSearch(e.target.value)}
            aria-label="Búsqueda rápida"
          />
          <MagnifyingGlass size={16} className="search-icon" />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll}
                    style={{ width: 15, height: 15, accentColor: 'var(--accent)', cursor: 'pointer' }} />
                </th>
                <th style={{ width: 46 }}></th>
                <th>Dirección</th>
                <th>Distrito</th>
                <th>Hab.</th>
                <th>Piso</th>
                <th>Área m²</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="loading-row"><td colSpan={9}>Cargando...</td></tr>
              )}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={9}>
                  <div className="empty-state">
                    <div className="empty-icon"><Buildings size={52} weight="thin" /></div>
                    <p>No se encontraron departamentos</p>
                  </div>
                </td></tr>
              )}
              {!loading && rows.map(row => {
                const isSel = selected.includes(row.id);
                const badge = STATUS_MAP[row.status] || { label: row.status, cls: '' };
                return (
                  <tr key={row.id} className={isSel ? 'selected' : ''}
                    onClick={() => toggleSelect(row.id)} style={{ cursor: 'pointer' }}>
                    <td className="checkbox-cell" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={isSel} onChange={() => toggleSelect(row.id)} />
                    </td>
                    <td>
                      <div className="avatar">{initials(row.address)}</div>
                    </td>
                    <td><div className="cell-main">{row.address}</div></td>
                    <td>{row.district}</td>
                    <td>{row.bedrooms}</td>
                    <td>{row.floor}</td>
                    <td>{row.areaM2} m²</td>
                    <td><span className="price">${row.price?.toLocaleString('es-PE')}</span></td>
                    <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span># Registros: {totalRecords}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              Página {page} de {totalPages}
            </span>
            <div className="pagination-pages">
              <button className="pg-btn" disabled={page <= 1 || loading} onClick={() => changePage(page - 1)} aria-label="Anterior">
                <CaretLeft size={13} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} className={`pg-btn${page === p ? ' active' : ''}`}
                  onClick={() => changePage(p)} disabled={loading}>{p}</button>
              ))}
              <button className="pg-btn" disabled={page >= totalPages || loading} onClick={() => changePage(page + 1)} aria-label="Siguiente">
                <CaretRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      { }
      <DepartmentModal
        open={editModal.open}
        initial={editModal.item}
        onClose={() => setEditModal({ open: false, item: null })}
        onSave={editModal.item ? (dto) => update(editModal.item.id, dto) : create}
      />
      <DeleteModal
        open={deleteModal.open}
        count={selected.length}
        loading={delLoading}
        onClose={() => setDeleteModal({ open: false })}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
