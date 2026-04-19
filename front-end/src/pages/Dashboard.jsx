import React, { useEffect, useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { AlertTriangle, Users, Car, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import LiveAlertsTable from '@/features/dashboard/live-alerts/live-alerts-table';
import MapView from '@/features/dashboard/live-map/map-view';
import { getStats } from '@/api/reports';

// Sample alerts data (you can move this to a shared file later)
const alerts = [];

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time emergency response monitoring</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Emergencies"
          value={stats?.total_active}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Total Active Crashes"
          value={stats?.active_crashes  }
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Accidents Today"
          value={stats?.today_accidents}
          icon={Car}
          color="orange"
        />
        <StatCard
          title="Total Accidents"
          value={stats?.total_accidents}
          icon={Clock}
          color="green"
        />
      </div>


    </div>
  );
};

export default Dashboard;
