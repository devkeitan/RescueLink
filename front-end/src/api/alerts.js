import { api } from './client';

export const alertsAPI = {
  // Get all alerts
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/alerts', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get alert by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create alert (User reports accident)
  create: async (alertData) => {
    try {
      const response = await api.post('/alerts', alertData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update alert
  update: async (id, alertData) => {
    try {
      const response = await api.put(`/alerts/${id}`, alertData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update status
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/alerts/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Assign vehicle/responder
  assign: async (id, vehicle_id, responder_id) => {
    try {
      const response = await api.patch(`/alerts/${id}/assign`, {
        vehicle_id,
        responder_id,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete alert
  delete: async (id) => {
    try {
      const response = await api.delete(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
