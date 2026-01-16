
import React from 'react'

import { StatCard } from '@/components/StatCard';
import { AlertTriangle, Users, Car, Clock } from 'lucide-react';

const Dashboard = () => {
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
    </div>
  )
}

export default Dashboard