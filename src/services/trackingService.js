import api from './api';

const trackingService = {
  getAll: async () => {
    const response = await api.get('/tracking');
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get('/admin/tracking');
    return response.data;
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

    const response = await api.post('/admin/tracking', payload);
    return response.data;
  },
};

export default trackingService;