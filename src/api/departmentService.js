import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

export const departmentService = {
  getAll: (params = {}) =>
    api.get('/api/departments', { params }).then(r => r.data),

  getById: (id) =>
    api.get(`/api/departments/${id}`).then(r => r.data),

  create: (data) =>
    api.post('/api/departments', data).then(r => r.data),

  update: (id, data) =>
    api.put(`/api/departments/${id}`, data).then(r => r.data),

  delete: (id) =>
    api.delete(`/api/departments/${id}`),

  getDistricts: () =>
    api.get('/api/departments/districts').then(r => r.data),
};

export default api;
