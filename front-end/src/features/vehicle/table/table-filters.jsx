import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TableFilters({ table }) {
  return (
    <div className="flex flex-wrap gap-4 bg-card p-4 rounded-lg border">
      <Input
        placeholder="Search by license plate or model..."
        value={table.getColumn("license_plate")?.getFilterValue() ?? ""}
        onChange={(event) =>
          table.getColumn("license_plate")?.setFilterValue(event.target.value)
        }
        className="flex-1 min-w-[200px] focus-visible:ring-2 focus-visible:ring-red-500"
      />

      <Select
        value={table.getColumn("vehicle_type")?.getFilterValue() ?? "all"}
        onValueChange={(value) =>
          table.getColumn("vehicle_type")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="min-w-[150px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="ambulance">Ambulance</SelectItem>
          <SelectItem value="fire_truck">Fire Truck</SelectItem>
          <SelectItem value="police_car">Police Car</SelectItem>
          <SelectItem value="rescue_truck">Rescue Truck</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={table.getColumn("status")?.getFilterValue() ?? "all"}
        onValueChange={(value) =>
          table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="min-w-[150px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="in_use">In Use</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
          <SelectItem value="out_of_service">Out of Service</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
