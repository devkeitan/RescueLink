import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, CheckCircle, Pin, MoreHorizontal } from "lucide-react";


export const createColumns = (onView, onStatusChange, onAssign, onDelete, onViewOnMap) => [
  {
    accessorKey: "user",
    header: "USER",
    cell: ({ row }) => {
      const user = row.original.data?.user;
      return (
        <div>
          <div className="font-medium text-sm">
            {user ? `${user.first_name} ${user.last_name}` : "Unknown User"}
          </div>
          <div className="text-xs text-muted-foreground">
            {user?.email || "N/A"}
          </div>
        </div>
      );
    },
  },
  {
    id: "incident",
    header: "INCIDENT",
    cell: ({ row }) => {
      const { type, data } = row.original;
      return (
        <div>
          <div className="text-sm font-medium">
            {type === "alert" ? data.title : data.event_type}
          </div>
          <div className="text-xs text-muted-foreground line-clamp-1">
            {type === "alert"
              ? data.description || "No description"
              : `Impact: ${data.impact_force ?? "N/A"}g`}
          </div>
        </div>
      );
    },
  },
  {
    id: "location",
    header: "LOCATION",
    cell: ({ row }) => {
      const { type, data } = row.original;
      return (
        <div>
          <div className="text-sm font-medium">
            {type === "alert" ? data.location : "GPS Detected"}
          </div>
          {data.latitude && data.longitude && (
            <div className="text-xs text-muted-foreground">
              {parseFloat(data.latitude).toFixed(4)},{" "}
              {parseFloat(data.longitude).toFixed(4)}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status;
      const variantMap = {
        pending:    "bg-orange-100 text-orange-700",
        responding: "bg-blue-100 text-blue-700",
        resolved:   "bg-green-100 text-green-700",
        cancelled:  "bg-gray-100 text-gray-700",
      };
      return (
        <Badge className={`font-medium ${variantMap[status] || "bg-gray-100 text-gray-700"}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: "type",
    header: "TYPE",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      // Match by type (alert/crash)
      if (filterValue === "alert" || filterValue === "crash") {
        return row.original.type === filterValue;
      }
      // Match by alert_type (medical, fire, etc.)
      return row.original.data?.alert_type === filterValue;
    },
    cell: ({ row }) => {
      const { type } = row.original;
      return (
        <div className="space-y-1">
          <Badge
            className={
              type === "alert"
                ? "bg-purple-100 text-purple-700"
                : "bg-red-100 text-red-700"
            }
          >
            {type === "alert" ? "Alert" : "Crash"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "severity",
    header: "SEVERITY",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      return row.original.data?.severity === filterValue;
    },
cell: ({ row }) => {
  const { type, data } = row.original;

  const variantMap = {
    critical: "bg-red-100 text-red-700",
    high:     "bg-orange-100 text-orange-700",
    medium:   "bg-yellow-100 text-yellow-700",
    low:      "bg-blue-100 text-blue-700",
  };

  // Show N/A only if severity is actually missing
  if (!data.severity) {
    return <span className="text-xs text-muted-foreground">N/A</span>;
  }

  return (
    <Badge
      className={`font-medium capitalize ${
        variantMap[data.severity] || "bg-gray-100 text-gray-700"
      }`}
    >
      {data.severity}
    </Badge>
  );
},
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => {
      const incident = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="icon" className="h-8 w-8"
            title="View Details"
            onClick={() => onView(incident)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          {incident.status === "pending" && (
            <Button
              variant="ghost" size="icon" className="h-8 w-8"
              title="Mark as Responding"
              onClick={() => onStatusChange(incident, "responding")}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}

          {incident.latitude && incident.longitude && (
            <Button
              variant="ghost" size="icon"
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="View on Map"
              onClick={() => onViewOnMap(incident)}
            >
              <Pin className="h-4 w-4" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(incident)}>
                View Details
              </DropdownMenuItem>
              {incident.latitude && incident.longitude && (
                <DropdownMenuItem onClick={() => onViewOnMap(incident)}>
                  View on Map
                </DropdownMenuItem>
              )}
              {incident.status !== "resolved" && (
                <DropdownMenuItem onClick={() => onStatusChange(incident, "resolved")}>
                  Mark as Resolved
                </DropdownMenuItem>
              )}
              {incident.status !== "cancelled" && (
                <DropdownMenuItem onClick={() => onStatusChange(incident, "cancelled")}>
                  Cancel Incident
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(incident)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
