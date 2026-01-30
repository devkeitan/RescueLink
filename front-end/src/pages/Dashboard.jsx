import React from 'react';
import { StatCard } from '@/components/StatCard';
import { AlertTriangle, Users, Car, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import LiveAlertsTable from '@/features/dashboard/live-alerts/live-alerts-table';
import MapView from '@/features/dashboard/live-map/map-view';

// Sample alerts data (you can move this to a shared file later)
const alerts = [
  {
    id: 'A-1234',
    timestamp: '2 min ago',
    severity: 'Critical',
    location: '14.1154° N, 122.9554° E',
    type: 'Auto Crash Detection',
    user: 'Juan Dela Cruz',
    device: 'Samsung Galaxy S21',
    status: 'Pending',
  },
  {
    id: 'A-1233',
    timestamp: '8 min ago',
    severity: 'High',
    location: '14.0608° N, 122.8456° E',
    type: 'Manual SOS',
    user: 'Maria Santos',
    device: 'iPhone 13',
    status: 'Verified',
  },
  {
    id: 'A-1232',
    timestamp: '15 min ago',
    severity: 'Medium',
    location: '14.2892° N, 122.9142° E',
    type: 'Auto Crash Detection',
    user: 'Pedro Garcia',
    device: 'OnePlus 9',
    status: 'Pending',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

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
          value="12"
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

      {/* Main Content: Map + Alerts Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Live Alerts Table - Takes 1 column */}
        <div className="lg:col-span-1">
          <LiveAlertsTable />
        </div>
        {/* Live Map - Takes 2 columns */}
        <Card className="lg:col-span-2  ">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Live Alert Map</CardTitle>
              <CardDescription>Real-time alert locations in Camarines Norte</CardDescription>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate('/map')}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Full Map
            </Button>
          </CardHeader>
          <CardContent className={""}>
            <div className="h-full w-full min-h-[600px]">
              <MapView
                alerts={alerts}
                selectedAlert={null}
                onAlertSelect={(alert) => {
                  console.log('Alert selected:', alert);
                  // Navigate to full map or show modal
                  navigate('/map');
                }}
              />
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
};

export default Dashboard;
