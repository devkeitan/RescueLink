
import { useState, useEffect, useMemo, useCallback } from "react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { alertsAPI } from "@/api/alerts";
import { allAlertsAPI } from "@/api/allAlerts";
import { useNavigate } from "react-router-dom";
import { crashAPI } from "@/api/crash";
import { socket } from "@/lib/socket";
import { bleAPI } from "@/api/ble";
import IncidentDetailPanel from "../dashboard/live-alerts/IncidentDetailPanel";


const normalizeAlert = (alert) => ({
  type: "alert",
  id: alert.id,
  userId: alert.user_id,
  status: alert.status,
  timestamp: alert.reported_at,
  latitude: alert.latitude,
  longitude: alert.longitude,
  data: alert,
});

const normalizeCrash = (crash) => ({
  type: "crash",
  id: crash.id,
  userId: crash.user_id,
  status: crash.status,
  timestamp: crash.triggered_at,
  latitude: crash.latitude,
  longitude: crash.longitude,
  data: crash,
});

const normalizeBle = (ble) => ({
  type: "ble",
  id: ble.id,
  userId: ble.user_id,
  status: ble.status,
  timestamp: new Date((ble.timestamp || 0) * 1000).toISOString(),
  latitude: ble.latitude,
  longitude: ble.longitude,
  data: ble,
});

export default function AlertsTable({ statusFilter }) {
  const [incidents, setIncidents] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchIncidents(); }, []);

  // ── Socket listeners ───────────────────────────────────────
  useEffect(() => {
    function onNewAlert(newAlert) {
      setIncidents(prev => [normalizeAlert(newAlert), ...prev]);
    }
    function onUpdatedAlert(updated) {
      setIncidents(prev => prev.map(i =>
        i.type === "alert" && i.id === updated.id ? normalizeAlert(updated) : i
      ));
    }
    function onStatusUpdated(updated) {
      setIncidents(prev => prev.map(i =>
        i.type === "alert" && i.id === updated.id
          ? { ...i, status: updated.status, data: { ...i.data, ...updated } }
          : i
      ));
    }
    function onAssigned(updated) {
      setIncidents(prev => prev.map(i =>
        i.type === "alert" && i.id === updated.id ? normalizeAlert(updated) : i
      ));
    }
    function onDeleted({ id }) {
      setIncidents(prev =>
        prev.filter(i => !(i.type === "alert" && i.id === Number(id)))
      );
    }
    function onNewCrash(newCrash) {
      setIncidents(prev => [normalizeCrash(newCrash), ...prev]);
    }
    function onCrashUpdated(updated) {
      setIncidents(prev => prev.map(i =>
        i.type === "crash" && i.id === updated.id ? normalizeCrash(updated) : i
      ));
    }
    function onCrashAssigned(updated) {
      setIncidents(prev => prev.map(i =>
        i.type === "crash" && i.id === updated.id ? normalizeCrash(updated) : i
      ));
    }

    function onNewBle(newBle) {
  setIncidents((prev) => [normalizeBle(newBle), ...prev]);
}

function onBleUpdated(updated) {
  setIncidents((prev) =>
    prev.map((i) =>
      i.type === "ble" && i.id === updated.id ? normalizeBle(updated) : i
    )
  );
}

function onBleAssigned(updated) {
  setIncidents((prev) =>
    prev.map((i) =>
      i.type === "ble" && i.id === updated.id ? normalizeBle(updated) : i
    )
  );
}



    socket.on("alert:new", onNewAlert);
    socket.on("alert:updated", onUpdatedAlert);
    socket.on("alert:status_updated", onStatusUpdated);
    socket.on("alert:assigned", onAssigned);
    socket.on("alert:deleted", onDeleted);
    socket.on("crash:new", onNewCrash);
    socket.on("crash:updated", onCrashUpdated);
    socket.on("crash:assigned", onCrashAssigned);
    socket.on("ble:new", onNewBle);
socket.on("ble:updated", onBleUpdated);
socket.on("ble:assigned", onBleAssigned);

    
    return () => {
      socket.off("alert:new", onNewAlert);
      socket.off("alert:updated", onUpdatedAlert);
      socket.off("alert:status_updated", onStatusUpdated);
      socket.off("alert:assigned", onAssigned);
      socket.off("alert:deleted", onDeleted);
      socket.off("crash:new", onNewCrash);
      socket.off("crash:updated", onCrashUpdated);
      socket.off("crash:assigned", onCrashAssigned);
      socket.off("ble:new", onNewBle);
socket.off("ble:updated", onBleUpdated);
socket.off("ble:assigned", onBleAssigned);
    };
  }, []);

  // ── Fetch ──────────────────────────────────────────────────
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await allAlertsAPI.getAll({ limit: 100 });
      setIncidents(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error", title: "Failed to Load",
        text: error?.message || "Could not fetch incidents",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredIncidents = useMemo(() => {
    if (!statusFilter) return incidents;
    return incidents.filter(i => statusFilter.includes(i.status));
  }, [incidents, statusFilter]);

  // ── Handlers ───────────────────────────────────────────────
const handleView = useCallback(async (incident) => {
  try {
    if (incident.type === "alert") {
      const data = await alertsAPI.getById(incident.id);
      setSelectedAlert(normalizeAlert(data));
    } else if (incident.type === "crash") {
      // Skip re-fetch, use existing data from the list
      setSelectedAlert(incident);
    } else if (incident.type === "ble") {
      const data = await bleAPI.getById(incident.id);
      setSelectedAlert(normalizeBle(data));
    }
    setViewOpen(true);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Failed to Load",
      text: error?.message || "Could not fetch details",
      confirmButtonColor: "#dc2626",
    });
  }
}, []);

const handleUpdateAlert = useCallback((updatedIncident) => {
  if (
    updatedIncident.type === "alert" ||
    updatedIncident.type === "crash" ||
    updatedIncident.type === "ble"
  ) {
    setIncidents((prev) =>
      prev.map((i) =>
        i.type === updatedIncident.type && i.id === updatedIncident.id
          ? updatedIncident
          : i
      )
    );
    setSelectedAlert(updatedIncident);
    return;
  }

  const isCrash = !!updatedIncident.triggered_at || !!updatedIncident.event_type;
  const isBle = !!updatedIncident.device_id && updatedIncident.timestamp != null;

  const normalized = isCrash
    ? normalizeCrash(updatedIncident)
    : isBle
    ? normalizeBle(updatedIncident)
    : normalizeAlert(updatedIncident);

  setIncidents((prev) =>
    prev.map((i) =>
      i.type === normalized.type && i.id === normalized.id ? normalized : i
    )
  );
  setSelectedAlert(normalized);
}, []);

  const handleViewOnMap = useCallback((rawData) => {
    navigate("/map", { state: { selectedAlert: rawData } });
  }, [navigate]);

  const handleStatusChange = useCallback(async (incident, newStatus) => {
  try {
    let updated;

    if (incident.type === "crash") {
      updated = await crashAPI.updateStatus(incident.id, newStatus);
      setIncidents((prev) =>
        prev.map((i) =>
          i.type === "crash" && i.id === updated.id ? normalizeCrash(updated) : i
        )
      );
    } else if (incident.type === "ble") {
      updated = await bleAPI.updateStatus(incident.id, newStatus);
      setIncidents((prev) =>
        prev.map((i) =>
          i.type === "ble" && i.id === updated.id ? normalizeBle(updated) : i
        )
      );
    } else {
      updated = await alertsAPI.updateStatus(incident.id, newStatus);
      setIncidents((prev) =>
        prev.map((i) =>
          i.type === "alert" && i.id === updated.id ? normalizeAlert(updated) : i
        )
      );
    }

    Swal.fire({
      icon: "success",
      title: "Status Updated!",
      text: `Marked as ${newStatus}`,
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: error?.message || "Could not update status",
      confirmButtonColor: "#dc2626",
    });
  }
}, []);

const handleAssign = useCallback(async (incident, vehicle_id, responder_id) => {
  try {
    let updated;

    if (incident.type === "crash") {
      updated = await crashAPI.assign(incident.id, vehicle_id, responder_id);
      setIncidents((prev) =>
        prev.map((i) =>
          i.type === "crash" && i.id === updated.id ? normalizeCrash(updated) : i
        )
      );
    } else if (incident.type === "ble") {
      if (responder_id) {
        await bleAPI.assignResponders(incident.id, [responder_id]);
      }
      if (vehicle_id) {
        await bleAPI.assignVehicles(incident.id, [vehicle_id]);
      }

      const freshBle = await bleAPI.getById(incident.id);
      updated = normalizeBle(freshBle);

      setIncidents((prev) =>
        prev.map((i) =>
          i.type === "ble" && i.id === updated.id ? updated : i
        )
      );
    } else {
      updated = await alertsAPI.assign(incident.id, vehicle_id, responder_id);
      setIncidents((prev) =>
        prev.map((i) =>
          i.type === "alert" && i.id === updated.id ? normalizeAlert(updated) : i
        )
      );
    }

    Swal.fire({
      icon: "success",
      title: "Assigned!",
      text: "Responder and vehicle assigned successfully",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Assignment Failed",
      text: error?.message || "Could not assign responder",
      confirmButtonColor: "#dc2626",
    });
  }
}, []);
  const handleDelete = useCallback((rawData) => setDeleteAlert(rawData), []);

  const handleDeleteConfirm = async () => {
    try {
      await alertsAPI.delete(deleteAlert.id);
      setIncidents(prev =>
        prev.filter(i => !(i.type === "alert" && i.id === deleteAlert.id))
      );
      setDeleteAlert(null);
      Swal.fire({
        icon: "success", title: "Deleted!",
        text: "Incident deleted successfully",
        timer: 1500, showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error", title: "Delete Failed",
        text: error?.message || "Could not delete",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // ✅ useCallback handlers are stable — safe to use as deps
  const columns = useMemo(
    () => createColumns(handleView, handleStatusChange, handleAssign, handleDelete, handleViewOnMap),
    [handleView, handleStatusChange, handleAssign, handleDelete, handleViewOnMap]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Incident Management</h1>
        <p className="text-gray-600 mt-1">Monitor and respond to alerts and crash detections</p>
      </div>
    </div>

    {/* ── Table — always full width, never shrinks ── */}
    <DataTable columns={columns} data={filteredIncidents} hideStatusFilter={!!statusFilter} />

    {/* ── Overlay when panel is open ── */}
    {selectedAlert && (
      <>
        {/* Blurred backdrop — clicking it closes the panel */}
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setSelectedAlert(null)}
        />

        {/* Detail panel — anchored to the right */}
        <div className="fixed top-0 right-0 h-full w-[420px] z-50 shadow-2xl">
          <IncidentDetailPanel
            incident={selectedAlert}
            onClose={() => setSelectedAlert(null)}
            onUpdateAlert={handleUpdateAlert}
          />
        </div>
      </>
    )}
      {/* ── Delete Confirmation ─────────────────────────────── */}
      <AlertDialog open={!!deleteAlert} onOpenChange={(open) => !open && setDeleteAlert(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete incident <strong>#{deleteAlert?.id}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
