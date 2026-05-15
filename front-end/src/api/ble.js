import { api } from "./client";

export const bleAPI = {
  getById: async (id) => {
    const res = await api.get(`/emergency/${id}`);
    return res.data.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/emergency/${id}/status`, { status });
    return res.data.data;
  },

  assignResponders: async (id, responder_ids) => {
    const res = await api.patch(`/emergency/${id}/responders`, { responder_ids });
    return res.data.data;
  },

  assignVehicles: async (id, vehicle_ids) => {
    const res = await api.patch(`/emergency/${id}/vehicles`, { vehicle_ids });
    return res.data.data;
  },
};