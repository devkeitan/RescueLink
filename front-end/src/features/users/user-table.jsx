import { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function UserTable() {
  
  const [alerts] = useState([
    {
      name: "Juan Dela Cruz",
      email: "juan.dela.cruz@example.com",
      role: "Driver",
      contact: "123-456-7890",
      status: "Pending",
    },
    {
      name: "Maria Santos",
      email: "maria.santos@example.com",
      role: "Rescuer",
      contact: "098-765-4321",
      status: "Pending",
    },
    {
      name: "Pedro Garcia",
      email: "pedro.garcia@example.com",
      role: "Dispatcher",
      contact: "555-555-5555",
      status: "Pending",
    },
    {
      name: "Ana Reyes",
      email: "ana.reyes@example.com",
      role: "Admin",
      contact: "555-555-5555",
      status: "Resolved",
    },
    {
      name: "Carlos Ramos",
      email: "carlos.ramos@example.com",
      role: "Admin",
      contact: "123-456-7890",
      status: "Verified",
    },
    {
      name: "Carlos Ramos",
      email: "carlos.ramos@example.com",
      role: "Admin",
      contact: "123-456-7890",
      status: "Verified",
    },
    {
      name: "Carlos Ramos",
      email: "carlos.ramos@example.com",
      role: "Admin",
      contact: "123-456-7890",
      status: "Verified",
    },
    {
      name: "Carlos Ramos",
      email: "carlos.ramos@example.com",
      role: "Admin",
      contact: "123-456-7890",
      status: "Verified",
    },

    {
      name: "Carlos Ramos",
      email: "carlos.ramos@example.com",
      role: "Admin",
      contact: "123-456-7890",
      status: "Verified",
    },
    {
      name: "Carlos Ramos",
      email: "carlos.ramos@example.com",
      role: "Admin",
      contact: "123-456-7890",
      status: "Verified",
    },
    {
      name: "Carlos Ramos",
      email: "carlos.ramos@example.com",
      role: "Admin",
      contact: "123-456-7890",
      status: "Verified",
    },
    {
      name: "Carlos Ramos",
      email: "carlos.ramos@example.com",
      role: "Admin",
      contact: "123-456-7890",
      status: "Verified",
    },
  ]);

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={alerts} />
    </div>
  );
}
