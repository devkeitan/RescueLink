import { api } from './client';

export const vehiclesAPI = {
  // Get all vehicles
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/vehicles', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get vehicle by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new vehicle
  create: async (vehicleData) => {
    try {
      const response = await api.post('/vehicles', vehicleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update vehicle
  update: async (id, vehicleData) => {
    try {
      const response = await api.put(`/vehicles/${id}`, vehicleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete vehicle
  delete: async (id) => {
    try {
      const response = await api.delete(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update vehicle status
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/vehicles/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update vehicle location
  updateLocation: async (id, latitude, longitude, location) => {
    try {
      const response = await api.patch(`/vehicles/${id}/location`, {
        current_latitude: latitude,
        current_longitude: longitude,
        current_location: location
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
