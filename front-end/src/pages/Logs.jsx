import LogTable from '@/features/logs/LogTable';
import React from 'react'

const Logs = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">System Logs</h1>
        <p className="text-gray-600 mt-1">Monitor system events and activities</p>
      </div>
      <LogTable />
    </div>
  );
};

export default Logs;