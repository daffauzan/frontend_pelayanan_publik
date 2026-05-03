import api from './api';

const trackingService = {
  getAll: async () => {
    const response = await api.get('/tracking');
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
      ServiceType: data.ServiceType,
      Status: data.Status,
      Keterangan: data.Keterangan || '',
      UpdatedBy: data.UpdatedBy,
    };

    const response = await api.post('/tracking', payload);
    return response.data;
  },
};

export default trackingService;