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
        placeholder="Search alerts..."
        value={table.getColumn("user")?.getFilterValue() ?? ""}
        onChange={(event) =>
          table.getColumn("user")?.setFilterValue(event.target.value)
        }
        className="flex-1 min-w-[150px]"
      />

      <Select
        value={table.getColumn("role")?.getFilterValue() ?? "all"}
        onValueChange={(value) =>
          table.getColumn("role")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="min-w-[150px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="Driver">Driver</SelectItem>
          <SelectItem value="Rescuer">Rescuer</SelectItem>
          <SelectItem value="Dispatcher">Dispatcher</SelectItem>
        </SelectContent>
      </Select>

 
    </div>
  );
}
