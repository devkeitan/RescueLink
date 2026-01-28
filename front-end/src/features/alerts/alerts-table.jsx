import { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function AlertsTable() {
  
  const [alerts] = useState([
    {
      id: "A-1234",
      timestamp: "2024-01-14 14:32:15",
      user: "Juan Dela Cruz",
      device: "Samsung Galaxy S21",
      location: { lat: "14.5999° N", lng: "120.9842° E" },
      status: "Pending",
      alertType: "Auto Crash Detection",
      severity: "Critical",
    },
    {
      id: "A-1233",
      timestamp: "2024-01-14 14:24:08",
      user: "Maria Santos",
      device: "iPhone 13",
      location: { lat: "14.6891° N", lng: "121.0233° E" },
      status: "Verified",
      alertType: "Manual SOS",
      severity: "High",
    },
    {
      id: "A-1232",
      timestamp: "2024-01-14 14:17:43",
      user: "Pedro Garcia",
      device: "OnePlus 9",
      location: { lat: "14.5547° N", lng: "121.0244° E" },
      status: "Pending",
      alertType: "Auto Crash Detection",
      severity: "Medium",
    },
    {
      id: "A-1231",
      timestamp: "2024-01-14 14:10:22",
      user: "Ana Reyes",
      device: "Xiaomi Redmi Note 10",
      location: { lat: "14.5832° N", lng: "120.9789° E" },
      status: "Resolved",
      alertType: "Manual SOS",
      severity: "Critical",
    },
    {
      id: "A-1230",
      timestamp: "2024-01-14 13:58:17",
      user: "Carlos Ramos",
      device: "Samsung Galaxy A52",
      location: { lat: "14.6234° N", lng: "121.0156° E" },
      status: "Verified",
      alertType: "Auto Crash Detection",
      severity: "High",
    },
  ]);

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={alerts} />
    </div>
  );
}
