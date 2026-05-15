import { api } from './client';

export const crashAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/crash', { params });
    return response.data;
  },

    getById: async (id) => {
    const res = await api.get(`/crash/${id}`);
    return res.data.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/crash/${id}/status`, { status });
    return response.data;
  },

  
  assign: async (id, vehicle_id, responder_id) => {
    const response = await api.patch(`/crash/${id}/assign`, {
      vehicle_id,
      responder_id,
      status: 'responding',
    });
     console.log("FULL BACKEND RESPONSE:", response.data);
    return response.data;
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
