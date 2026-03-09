import { useState } from 'react';
import { Info } from 'lucide-react';

function MapLegend() {
  const [isOpen, setIsOpen] = useState(false);

  const legendItems = [
    { type: 'critical',  label: 'Critical Alert',  color: 'bg-red-600' },
    { type: 'high',      label: 'High Alert',       color: 'bg-orange-500' },
    { type: 'medium',    label: 'Medium Alert',     color: 'bg-yellow-500' },
    { type: 'low',       label: 'Low Alert',        color: 'bg-blue-500' },
    { type: 'crash',     label: 'Auto Crash',       color: 'bg-red-600', icon: '🚗' },
  ];

  return (
    <div className="absolute bottom-4 left-[10.8px] z-[1000]">
      {isOpen && (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[180px]">
          <div className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
            Legend
          </div>
          <div className="space-y-2">
            {legendItems.map((item) => (
              <div key={item.type} className="flex items-center gap-3">
                <div className={`${item.color} w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center`}>
                  {item.icon && <span className="text-[10px]">{item.icon}</span>}
                </div>
                <span className="text-sm font-medium text-gray-800">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Source divider */}
          <div className="border-t mt-3 pt-3 space-y-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Source</div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-full border-l-4 border-purple-500 rounded-sm" />
              <span className="text-sm text-gray-700">Manual Alert</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-full border-l-4 border-red-500 rounded-sm" />
              <span className="text-sm text-gray-700">Crash Detected</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white w-8 h-8 rounded border-2 border-gray-400 shadow-md hover:bg-gray-50 flex items-center justify-center mb-2"
        title="Legend"
      >
        <Info size={18} className="text-gray-700" />
      </button>
    </div>
  );
}

export default MapLegend;
