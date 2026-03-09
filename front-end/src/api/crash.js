import { api } from './client';

export const crashAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/crash', { params });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/crash/${id}/status`, { status });
    return response.data;
  },

  
  assign: async (id, vehicle_id, responder_id) => {
    const response = await api.patch(`/crash/${id}/assign`, {  // ← /assign added
      vehicle_id,
      responder_id,
      status: 'responding',
    });
    return response.data;  // ← backend returns the object directly, not wrapped in .event
  },

  patch: async (id, updates) => {
    const response = await api.patch(`/crash/${id}`, updates);
    return response.data.event;
  },

  update: async (id, updates) => {
    const response = await api.put(`/crash/${id}`, updates);
    return response.data.event;
  },

  delete: async (id) => {
    const response = await api.delete(`/crash/${id}`);
    return response.data;
  },
};
