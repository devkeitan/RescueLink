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
          title="Total Active Alerts"
          value={stats?.total_active}
          icon={AlertTriangle}
          color="red"
          trend="+3 from last hour"
        />
        <StatCard
          title="Responders Online"
          value="48"
          icon={Users}
          color="blue"
          trend="92% availability"
        />
        <StatCard
          title="Accidents Today"
          value="27"
          icon={Car}
          color="orange"
          trend="-8% from yesterday"
        />
        <StatCard
          title="Avg Response Time"
          value="4.2m"
          icon={Clock}
          color="green"
          trend="12s faster"
        />
      </div>


    </div>
  );
};

export default Dashboard;
