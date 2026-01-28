import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPen, UserRoundX } from "lucide-react";

export const columns = [
  {
    accessorKey: "name",
    header: "NAME",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-sm">{row.original.name}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "ROLE",
    cell: ({ row }) => {

   
      const role = row.original.role;
      const variantRole = {
        Driver:'bg-gray-100 text-gray-700',
        Admin: "bg-blue-100 text-blue-700",
        Rescuer: "bg-green-100 text-green-700",
        Dispatcher: "bg-yellow-100 text-yellow-700",
      };
      return (
        <Badge className={`font-medium ${variantRole[role]}`}>
          {role}
        </Badge>
      );
   }
  },
  {
    accessorKey: "contact",
    header: "CONTACT",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.contact}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status;
      const variantMap = {
        Pending: "bg-orange-100 text-orange-700",
        Verified: "bg-green-100 text-green-700",
        Resolved: "bg-blue-100 text-blue-700",
      };
      return (
        <Badge className={`font-medium ${variantMap[status]}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => {

      return (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
            <UserPen size={16} className="text-blue-600" />
          </Button>

        
            <Button variant="ghost" size="icon" className="p-2 hover:bg-red-100 rounded-lg transition-colors">
              <UserRoundX size={16} className="text-red-600" />
            </Button>


        
        </div>
      );
    },
  },
];
