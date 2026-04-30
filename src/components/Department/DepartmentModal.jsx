import { useState, useEffect } from 'react';
import { X } from '@phosphor-icons/react';

const EMPTY = {
  address: '', district: '', bedrooms: 1, floor: 1,
  areaM2: '', price: '', description: '',
  hasParking: false, hasBalcony: false, status: 'AVAILABLE',
};

const STATUS_OPTS = [
  { value: 'AVAILABLE', label: 'Disponible' },
  { value: 'RENTED', label: 'Alquilado' },
  { value: 'SOLD', label: 'Vendido' },
];

const FormField = ({ label, name, type = 'text', value, onChange, error, children, full }) => (
  <div className={`form-group${full ? ' full' : ''}`}>
    <label>{label}</label>
    {children || (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={error ? 'invalid' : ''}
      />
    )}
    {error && <span className="error-msg">{error}</span>}
  </div>
);

function validate(form) {
  const e = {};
  if (!form.address.trim()) e.address = 'Requerido';
  if (!form.district.trim()) e.district = 'Requerido';
  if (form.bedrooms < 1 || form.bedrooms > 20) e.bedrooms = '1–20';
  if (form.floor < 1 || form.floor > 100) e.floor = '1–100';
  if (!form.areaM2 || +form.areaM2 <= 0) e.areaM2 = 'Mayor a 0';
  if (!form.price || +form.price <= 0) e.price = 'Mayor a 0';
  return e;
}

export default function DepartmentModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const isEdit = !!initial;

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial } : EMPTY);
      setErrors({});
    }
  }, [open, initial]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      await onSave({
        ...form,
        address: form.address.trim(),
        district: form.district.trim(),
        bedrooms: +form.bedrooms,
        floor: +form.floor,
        areaM2: +form.areaM2,
        price: +form.price,
        description: form.description?.trim() || null,
      });
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al guardar';
      setErrors({ _global: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Editar departamento' : 'Nuevo departamento'}</span>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          {errors._global && <div className="error-banner">{errors._global}</div>}

          <div className="form-grid">
            <FormField label="DIRECCIÓN" name="address" value={form.address} onChange={handleChange} error={errors.address} full />

            <FormField label="DISTRITO" name="district" value={form.district} onChange={handleChange} error={errors.district} />

            <FormField label="ESTADO" name="status">
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </FormField>

            <FormField label="HABITACIONES" name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} error={errors.bedrooms} />

            <FormField label="PISO" name="floor" type="number" value={form.floor} onChange={handleChange} error={errors.floor} />

            <FormField label="ÁREA (m²)" name="areaM2" type="number" value={form.areaM2} onChange={handleChange} error={errors.areaM2} />

            <FormField label="PRECIO ($)" name="price" type="number" value={form.price} onChange={handleChange} error={errors.price} />

            <FormField label="DESCRIPCIÓN" name="description" full>
              <textarea name="description" value={form.description || ''} onChange={handleChange} placeholder="Descripción opcional..." />
            </FormField>

            <div className="form-group">
              <label>AMENIDADES</label>
              <div className="checkbox-row">
                <input type="checkbox" id="parking" name="hasParking" checked={form.hasParking} onChange={handleChange} />
                <label htmlFor="parking">Estacionamiento</label>
              </div>
            </div>

            <div className="form-group">
              <label>&nbsp;</label>
              <div className="checkbox-row">
                <input type="checkbox" id="balcony" name="hasBalcony" checked={form.hasBalcony} onChange={handleChange} />
                <label htmlFor="balcony">Balcón</label>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancelar</button>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : (isEdit ? 'Guardar cambios' : 'Crear departamento')}
          </button>
        </div>
      </div>
    </div>
  );
}