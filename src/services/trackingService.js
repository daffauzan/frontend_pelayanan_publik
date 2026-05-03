import api from './api';

const trackingService = {
  getAll: async () => {
    const response = await api.get('/tracking');
    return response.data;
  },

  getByServiceType: async (serviceType) => {
    const normalized = String(serviceType || '').toLowerCase().trim();
    if (normalized !== 'surat' && normalized !== 'pengaduan') {
      throw new Error('service_type tidak valid');
    }

    const response = await api.get('/tracking', {
      params: {
        service_type: normalized,
      },
    });
    return response.data;
  },

  getAllAdmin: async () => {
    try {
      const response = await api.get('/admin/tracking');
      return response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        const fallbackResponse = await api.get('/tracking');
        return fallbackResponse.data;
      }

      throw error;
    }
  },

  trackByCode: async (trackingCode) => {
    const response = await api.get(`/tracking/${trackingCode}`);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/tracking/history');
    return response.data;
  },

  create: async (data) => {
    const payload = {
      ReferenceID: data.ReferenceID,
      reference_id: data.ReferenceID,
      ServiceType: data.ServiceType,
      service_type: data.ServiceType,
      Status: data.Status,
      status: data.Status,
      Keterangan: data.Keterangan || '',
      keterangan: data.Keterangan || '',
      UpdatedBy: data.UpdatedBy,
      updated_by: data.UpdatedBy,
    };

    try {
      const response = await api.post('/admin/tracking', payload);
      return response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        const fallbackResponse = await api.post('/tracking', payload);
        return fallbackResponse.data;
      }

      throw error;
    }
  },
};

export default trackingService;