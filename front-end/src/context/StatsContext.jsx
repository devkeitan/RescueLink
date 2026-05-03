// context/StatsContext.jsx
import { getMonthlyStats } from '@/api/reports';
import { createContext, useEffect, useState } from 'react';

export const StatsContext = createContext();

export function StatsProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  getMonthlyStats()
    .then((data) => {
      const formatted = data.months.map((month, index) => ({
        month,
        alerts: data.alerts[index],
        crashes: data.crashes[index],
      }));

      setStats(formatted);
    })
    .finally(() => setLoading(false));
}, []);

  return (
    <StatsContext.Provider value={{ stats, loading }}>
      {children}
    </StatsContext.Provider>
  );
}