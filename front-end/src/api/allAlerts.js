import { api } from './client';

export const allAlertsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/allAlerts', { params });
    return response.data;
  },
};
