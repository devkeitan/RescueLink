import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Fuel, MapPin } from "lucide-react";

export const createColumns = (onEdit, onDelete) => [
  {
    accessorKey: "license_plate",
    header: "VEHICLE",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-sm">{row.original.license_plate}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.model}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "vehicle_type",
    header: "TYPE",
    cell: ({ row }) => {
      const type = row.original.vehicle_type;
      const typeMap = {
        ambulance: { label: 'Ambulance', class: 'bg-blue-100 text-blue-700' },
        fire_truck: { label: 'Fire Truck', class: 'bg-red-100 text-red-700' },
        police_car: { label: 'Police Car', class: 'bg-indigo-100 text-indigo-700' },
        rescue_truck: { label: 'Rescue Truck', class: 'bg-orange-100 text-orange-700' },
      };
      const typeInfo = typeMap[type] || { label: type, class: 'bg-gray-100 text-gray-700' };
      
      return (
        <Badge className={`font-medium ${typeInfo.class}`}>
          {typeInfo.label}
        </Badge>
      );
    }
  },
  {
    accessorKey: "current_location",
    header: "LOCATION",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin size={14} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {row.original.current_location}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "fuel_level",
    header: "FUEL",
    cell: ({ row }) => {
      const fuel = row.original.fuel_level;
      const fuelColor = fuel > 50 ? 'text-green-600' : fuel > 25 ? 'text-yellow-600' : 'text-red-600';
      
      return (
        <div className="flex items-center gap-1">
          <Fuel size={14} className={fuelColor} />
          <span className={`text-sm font-medium ${fuelColor}`}>
            {fuel}%
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusMap = {
        available: { label: 'Available', class: 'bg-green-100 text-green-700' },
        in_use: { label: 'In Use', class: 'bg-blue-100 text-blue-700' },
        maintenance: { label: 'Maintenance', class: 'bg-yellow-100 text-yellow-700' },
        out_of_service: { label: 'Out of Service', class: 'bg-red-100 text-red-700' },
      };
      const statusInfo = statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-700' };
      
      return (
        <Badge className={`font-medium ${statusInfo.class}`}>
          {statusInfo.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "year",
    header: "YEAR",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.year}
      </span>
    ),
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => {
      const vehicle = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            onClick={() => onEdit(vehicle)}
          >
            <Pencil size={16} className="text-blue-600" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
            onClick={() => onDelete(vehicle)}
          >
            <Trash2 size={16} className="text-red-600" />
          </Button>
        </div>
      );
    },
  },
];
