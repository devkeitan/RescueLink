

const colorClasses = {
  red: "bg-red-100 text-red-600",
  blue: "bg-blue-100 text-blue-600",
  orange: "bg-orange-100 text-orange-600",
  green: "bg-green-100 text-green-600",
};

export function StatCard({ title, value, icon: Icon, color, trend }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {value}
          </p>
          {trend && (
            <p className="text-xs text-gray-500 mt-2">{trend}</p>
          )}
        </div>

        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
