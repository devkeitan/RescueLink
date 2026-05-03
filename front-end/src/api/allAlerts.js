import { api } from './client';

export const allAlertsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/allAlerts', { params });
    return response.data;
  },
    getAllForMap: async (params = { limit: 1000 }) => {
    const response = await api.get('/allAlerts', { params });
    return response.data.data;
  }

};


