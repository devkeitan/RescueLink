import { api } from "./client";

export const getStats = async () => {
  const { data } = await api.get('reports/stats');
  return data;
};