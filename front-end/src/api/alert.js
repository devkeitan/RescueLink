import { api } from './client';

export const alertsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/alerts', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (alertData) => {
    try {
      const response = await api.post('/alerts', alertData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, alertData) => {
    try {
      const response = await api.put(`/alerts/${id}`, alertData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verify: async (id) => {
    try {
      const response = await api.post(`/alerts/${id}/verify`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resolve: async (id) => {
    try {
      const response = await api.post(`/alerts/${id}/resolve`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
