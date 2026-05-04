import React, { useEffect, useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { AlertTriangle, Users, Car, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStats } from '@/api/reports';
import BarGraph from '@/features/dashboard/charts/BarGraph';
import AccidentMap from '@/features/dashboard/live-map/map-view';
import { allAlertsAPI } from '@/api/allAlerts';
import IncidentFilters from '@/features/dashboard/live-map/IncidentFilters';
import LiveAlertsTable from '@/features/dashboard/live-alerts/live-alerts-table';

// Sample alerts data (you can move this to a shared file later)
const alerts = [];

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [summary, setSummary] = useState({});
  const [mapStyle, setMapStyle] = useState('street');
  const [layers, setLayers] = useState({ heatmap: true, markers: true });
  const [filters, setFilters] = useState({ from: '2026-01-01', status: 'all' });
  const [loading, setLoading] = useState(true);

  const filteredIncidents = incidents.filter(i => {
    if (filters.status !== 'all' && i.status !== filters.status) return false;
    const incidentDate = new Date(i.timestamp);
    return incidentDate >= new Date(filters.from);
  });

  
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
  
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await allAlertsAPI.getAllForMap({ limit: 1000 }); // All alerts + crashes!
       
        setIncidents(data);
      } catch (error) {
        console.error('Dashboard incidents error:', error);
      }
    };
    fetchIncidents();
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

    
        {/* Map Section Header */}
<div className="rounded-xl border bg-white shadow-xl overflow-hidden">
  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
    <div>
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <MapPin className="text-indigo-600" size={20} />
        Incident Analysis Map
      </h3>
      <p className="text-xs text-gray-500 font-medium">
        Showing <span className="text-indigo-600 font-bold">{filteredIncidents.length}</span> results on the map
      </p>
    </div>
    
    {/* The New Filter Component */}
    <IncidentFilters 
      incidents={incidents}
      filters={filters}
      onFiltersChange={setFilters}
    />
  </div>

  <div className="h-[70vh]">
    <AccidentMap 
      alerts={filteredIncidents} 
      filters={filters}
      selectedAlert={null}
      onMarkerClick={(m) => console.log(m)}
    />
  </div>

</div>



    </div>
  );
};

export default Dashboard;
