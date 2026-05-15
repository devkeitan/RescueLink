import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TableFilters({
  table,
  hideStatusFilter,
  globalFilter,
  setGlobalFilter,
}) {
  return (
    <div className="flex flex-wrap gap-4 bg-card p-4 rounded-lg border">
      {/* Global Search */}
      <Input
        placeholder="Search anything..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="flex-1 min-w-[200px] focus-visible:ring-2 focus-visible:ring-red-500"
      />

      {/* Status Filter */}
      {!hideStatusFilter && (
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="responding">Responding</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Severity Filter */}
      <Select
        value={table.getColumn("severity")?.getFilterValue() ?? "all"}
        onValueChange={(value) =>
          table.getColumn("severity")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="min-w-[150px]">
          <SelectValue placeholder="All Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Severity</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Type Filter */}
      <Select
        value={table.getColumn("type")?.getFilterValue() ?? "all"}
        onValueChange={(value) =>
          table.getColumn("type")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="min-w-[150px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="alert">Manual Alert</SelectItem>
          <SelectItem value="crash">Crash Detected</SelectItem>
          <SelectItem value="ble">BLE Emergency</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}