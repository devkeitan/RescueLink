import { Calendar, Filter, CheckCircle2, Clock, Activity } from 'lucide-react';

const IncidentFilters = ({ 
  incidents, 
  onFiltersChange, 
  filters = { from: '2026-01-01', status: 'all' } 
}) => {
  
const statusCounts = {
  all: incidents.length,
  pending: incidents.filter(i => i.status?.toLowerCase() === 'pending').length,
  responding: incidents.filter(i => i.status?.toLowerCase() === 'responding').length,
  resolved: incidents.filter(i => i.status?.toLowerCase() === 'resolved').length  // ← Case-safe
};

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const StatusButton = ({ id, label, count, colorClass, icon: Icon }) => (
    <button
      onClick={() => handleFilterChange('status', id)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
        filters.status === id 
          ? `${colorClass} border-current shadow-sm` 
          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
      }`}
    >
      <Icon size={14} />
      <span>{label}</span>
      <span className={`ml-1 px-1.5 py-0.5 rounded-full bg-white/50 text-[10px]`}>
        {count}
      </span>
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white/50 p-2 rounded-2xl border border-indigo-100 shadow-sm">
      {/* Date Picker - Cleaned up */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 focus-within:ring-2 ring-indigo-200 transition-all">
        <Calendar size={14} className="text-indigo-500" />
        <input
          type="month"
          value={filters.from.slice(0,7)}
          onChange={e => handleFilterChange('from', `${e.target.value}-01T00:00:00Z`)}
          className="bg-transparent border-none outline-none text-xs font-semibold text-gray-700 cursor-pointer"
        />
      </div>

      <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

      {/* Status Badges */}
      <div className="flex items-center gap-2">
        <StatusButton 
          id="all" 
          label="All" 
          count={statusCounts.all} 
          icon={Filter}
          colorClass="bg-indigo-50 text-indigo-700" 
        />
        <StatusButton 
          id="pending" 
          label="Pending" 
          count={statusCounts.pending} 
          icon={Clock}
          colorClass="bg-red-50 text-red-700" 
        />
        <StatusButton 
          id="responding" 
          label="Active" 
          count={statusCounts.responding} 
          icon={Activity}
          colorClass="bg-blue-50 text-blue-700" 
        />
        <StatusButton 
          id="resolved" 
          label="Resolved" 
          count={statusCounts.resolved} 
          icon={CheckCircle2}
          colorClass="bg-emerald-50 text-emerald-700" 
        />
      </div>
    </div>
  );
};

export default IncidentFilters;
