import { Trash } from '@phosphor-icons/react';

export default function DeleteModal({ open, onClose, onConfirm, loading, count = 1 }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 400 }} role="dialog" aria-modal="true">
        <div className="modal-body confirm-modal" style={{ padding: '32px 24px' }}>
          <div className="icon" style={{ color: 'var(--danger)' }}>
            <Trash size={52} weight="thin" />
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: 22 }}>
            ¿Eliminar {count > 1 ? `${count} departamentos` : 'departamento'}?
          </h2>
          <p>Esta acción no se puede deshacer.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="btn btn-primary" style={{ background:'var(--danger)', borderColor:'var(--danger)' }}
            onClick={onConfirm} disabled={loading}>
            {loading ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
