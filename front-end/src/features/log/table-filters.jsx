import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const DEFAULT_FILTERS = {
  search:      "",
  entity_name: "all",
  action:      "all",
  date_from:   "",
  date_to:     "",
};

export default function LogTableFilters({ filters, onChange }) {
  const handleChange = (key, value) => onChange({ ...filters, [key]: value });
  const handleReset  = () => onChange(DEFAULT_FILTERS);

  const hasActiveFilter =
    filters.search      !== "" ||
    filters.entity_name !== "all" ||
    filters.action      !== "all" ||
    filters.date_from   !== "" ||
    filters.date_to     !== "";

  return (
    <div className="flex flex-wrap gap-3 bg-card p-4 rounded-lg border">
      <Input
        placeholder="Search logs..."
        value={filters.search}
        onChange={(e) => handleChange("search", e.target.value)}
        className="flex-1 min-w-[180px] focus-visible:ring-2 focus-visible:ring-red-500"
      />

      <Select
        value={filters.entity_name}
        onValueChange={(val) => handleChange("entity_name", val)}
      >
        <SelectTrigger className="min-w-[160px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="alert">🟣 Manual Alert</SelectItem>
          <SelectItem value="crash_event">🟠 Auto Crash</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.action}
        onValueChange={(val) => handleChange("action", val)}
      >
        <SelectTrigger className="min-w-[150px]">
          <SelectValue placeholder="All Actions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Actions</SelectItem>
          <SelectItem value="created">Created</SelectItem>
          <SelectItem value="assigned">Assigned</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex flex-col justify-center">
        <label className="text-xs text-gray-500 mb-1">From</label>
        <Input
          type="date"
          value={filters.date_from}
          onChange={(e) => handleChange("date_from", e.target.value)}
          className="min-w-[150px]"
        />
      </div>

      <div className="flex flex-col justify-center">
        <label className="text-xs text-gray-500 mb-1">To</label>
        <Input
          type="date"
          value={filters.date_to}
          onChange={(e) => handleChange("date_to", e.target.value)}
          className="min-w-[150px]"
        />
      </div>

      {hasActiveFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="self-end text-gray-500 hover:text-red-600 hover:bg-red-50"
        >
          <X className="h-4 w-4 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}