import api from './api';
import { mapPengaduanPayload } from '../utils/modelMapper';

const pengaduanService = {
  getAll: async () => {
    const response = await api.get('/pengaduan');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/pengaduan/${id}`);
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get('/admin/pengaduan');
    return response.data;
  },

  create: async (formData) => {
    const payload = mapPengaduanPayload(formData);

    const response = await api.post('/pengaduan', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  updateStatus: async (id, status, tanggapanAdmin = '') => {
    const payload = {
      Status: status,
      TanggapanAdmin: tanggapanAdmin,
    };

    if (status === 'resolved') {
      payload.ResolvedAt = new Date().toISOString();
    }

    const response = await api.put(`/pengaduan/${id}/status`, {
      ...payload,
    });

    return response.data;
  },

  updateStatusAdmin: async (id, status, tanggapanAdmin = '') => {
    const payload = {
      Status: status,
      status,
      TanggapanAdmin: tanggapanAdmin,
      tanggapan_admin: tanggapanAdmin,
    };

    if (status === 'resolved') {
      payload.ResolvedAt = new Date().toISOString();
    }

    const response = await api.put(`/admin/pengaduan/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/pengaduan/${id}`);
    return response.data;
  },
};

export default pengaduanService;