import { useState, useEffect, useCallback } from 'react';
import { departmentService } from '../api/departmentService';
import toast from 'react-hot-toast';

const INITIAL_FILTER = {
  district: '',
  status: '',
  search: '',
  page: 1,
  pageSize: 10,
};

export function useDepartments() {
  const [data, setData] = useState({ data: [], totalRecords: 0, page: 1, pageSize: 10, totalPages: 0 });
  const [filters, setFilters] = useState(INITIAL_FILTER);
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [selected, setSelected] = useState([]);

  const fetchData = useCallback(async (f) => {
    setLoading(true);
    try {
      const params = {};
      if (f.district) params.district = f.district;
      if (f.status) params.status = f.status;
      if (f.search) params.search = f.search;
      params.page = f.page;
      params.pageSize = f.pageSize;

      const result = await departmentService.getAll(params);
      setData(result);
      setSelected([]);
    } catch {
      toast.error('Error al cargar los departamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    departmentService.getDistricts()
      .then(setDistricts)
      .catch(() => { });
  }, []);

  useEffect(() => { fetchData(filters); }, [filters, fetchData]);

  const applyFilters = (newF) => setFilters({ ...newF, page: 1 });
  const changePage = (p) => setFilters(f => ({ ...f, page: p }));

  const create = async (dto) => {
    await departmentService.create(dto);
    toast.success('Departamento creado');
    fetchData(filters);
  };

  const update = async (id, dto) => {
    await departmentService.update(id, dto);
    toast.success('Departamento actualizado');
    fetchData(filters);
  };

  const remove = async (id) => {
    await departmentService.delete(id);
    toast.success('Departamento eliminado');
    fetchData(filters);
  };

  const toggleSelect = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const toggleSelectAll = () =>
    setSelected(s => s.length === data.data.length ? [] : data.data.map(d => d.id));

  return {
    data, filters, loading, districts, selected,
    applyFilters, changePage,
    create, update, remove,
    toggleSelect, toggleSelectAll,
  };
}
