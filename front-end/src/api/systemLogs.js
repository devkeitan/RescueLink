import { api } from './client';

export const systemLogsAPI = {
  getAll: async (params = {}) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );
      const response = await api.get('/system-logs', { params: cleanParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};