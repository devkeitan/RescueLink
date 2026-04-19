import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";


const entityConfig = {
  alert: {
    label:     "Manual Alert",
    className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  },
  crash_event: {
    label:     "Auto Crash",
    className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  },
};

const actionConfig = {
  created:   "bg-blue-100 text-blue-800 hover:bg-blue-100",
  assigned:  "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  resolved:  "bg-green-100 text-green-800 hover:bg-green-100",
  cancelled: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

const statusConfig = {
  pending:    "bg-yellow-100 text-yellow-800",
  responding: "bg-blue-100 text-blue-800",
  resolved:   "bg-green-100 text-green-800",
  cancelled:  "bg-gray-100 text-gray-800",
};

export const logColumns = [
  {
    accessorKey: "created_at",
    header: "Timestamp",
    cell: ({ row }) => {
      const val = row.getValue("created_at");
      if (!val) return <span className="text-gray-400 text-xs">—</span>;
      return (
        <div className="text-sm text-gray-600 whitespace-nowrap">
          {format(new Date(val), "MMM dd, yyyy")}
          <div className="text-xs text-gray-400">
            {format(new Date(val), "hh:mm a")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "entity_name",
    header: "Type",
    cell: ({ row }) => {
      const entity = row.getValue("entity_name");
      const config = entityConfig[entity];
      if (!config) return <span className="text-gray-400 text-xs">{entity}</span>;
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action");
      const className = actionConfig[action] || "bg-gray-100 text-gray-800";
      return (
        <Badge className={className}>
          {action?.charAt(0).toUpperCase() + action?.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Details",
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">{row.getValue("message")}</span>
    ),
  },
  {
    accessorKey: "record_id",
    header: "Record ID",
    cell: ({ row }) => (
      <span className="text-sm font-mono text-gray-500">
        #{row.getValue("record_id")}
      </span>
    ),
  },
  {
    accessorKey: "user",
    header: "Performed By",
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) return <span className="text-gray-400 text-xs">System</span>;
      return (
        <div>
          <div className="text-sm font-medium">
            {user.first_name} {user.last_name}
          </div>
          <div className="text-xs text-gray-500">@{user.username}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge className={statusConfig[status] || "bg-gray-100 text-gray-800"}>
          {status?.charAt(0).toUpperCase() + status?.slice(1)}
        </Badge>
      );
    },
  },
];