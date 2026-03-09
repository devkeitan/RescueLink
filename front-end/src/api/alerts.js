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

  uploadImage: async (formData) => {
    try {
      const response = await api.post('/alerts/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
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

  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/alerts/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  assign: async (id, vehicle_id, responder_id) => {
    try {
      const response = await api.patch(`/alerts/${id}/assign`, {
        vehicle_id,
        responder_id,
        status: 'responding',
      });
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
};
