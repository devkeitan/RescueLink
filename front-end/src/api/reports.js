import { api } from "./client";

export const getStats = async () => {
  const { data } = await api.get('reports/stats');
  return data;
};

// monthly (for charts)
export const getMonthlyStats = async () => {
  const { data } = await api.get('/reports/monthly');
  return data;
};