import api from './api';
import { mapSuratPayload } from '../utils/modelMapper';

const suratService = {
  getAll: async () => {
    const response = await api.get('/surat');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/surat/${id}`);
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get('/admin/surat');
    return response.data;
  },

  create: async (formData) => {
    const payload = mapSuratPayload(formData);

    const response = await api.post('/surat', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  updateStatus: async (id, status, catatanAdmin = '') => {
    const response = await api.put(`/surat/${id}/status`, {
      Status: status,
      CatatanAdmin: catatanAdmin,
    });
    return response.data;
  },

  updateStatusAdmin: async (id, status, catatanAdmin = '') => {
    const response = await api.put(`/admin/surat/${id}`, {
      Status: status,
      status,
      CatatanAdmin: catatanAdmin,
      catatan_admin: catatanAdmin,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/surat/${id}`);
    return response.data;
  },
};

export default suratService;