import { useState, useEffect, useMemo } from "react";
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
import AlertDetailsModal from "../dashboard/live-alerts/alert-details-modal";


const normalizeAlert = (alert) => ({
  source: 'alert',
  id: alert.id,
  userId: alert.user_id,
  status: alert.status,
  timestamp: alert.reported_at,
  latitude: alert.latitude,
  longitude: alert.longitude,
  data: alert,
});

const normalizeCrash = (crash) => ({
  source: 'crash',
  id: crash.id,
  userId: crash.user_id,
  status: crash.status,
  timestamp: crash.triggered_at,
  latitude: crash.latitude,
  longitude: crash.longitude,
  data: crash,
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
        i.source === 'alert' && i.id === updated.id ? normalizeAlert(updated) : i
      ));
    }
    function onStatusUpdated(updated) {
      setIncidents(prev => prev.map(i =>
        i.source === 'alert' && i.id === updated.id
          ? { ...i, status: updated.status, data: { ...i.data, ...updated } }
          : i
      ));
    }
    function onAssigned(updated) {
      setIncidents(prev => prev.map(i =>
        i.source === 'alert' && i.id === updated.id ? normalizeAlert(updated) : i
      ));
    }
    function onDeleted({ id }) {
      setIncidents(prev =>
        prev.filter(i => !(i.source === 'alert' && i.id === Number(id)))
      );
    }

    socket.on("alert:new", onNewAlert);
    socket.on("alert:updated", onUpdatedAlert);
    socket.on("alert:status_updated", onStatusUpdated);
    socket.on("alert:assigned", onAssigned);
    socket.on("alert:deleted", onDeleted);

    return () => {
      socket.off("alert:new", onNewAlert);
      socket.off("alert:updated", onUpdatedAlert);
      socket.off("alert:status_updated", onStatusUpdated);
      socket.off("alert:assigned", onAssigned);
      socket.off("alert:deleted", onDeleted);
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
        icon: 'error', title: 'Failed to Load',
        text: error || 'Could not fetch incidents',
        confirmButtonColor: '#dc2626'
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
const handleView = async (incident) => {
  try {
    if (incident.source === 'alert') {
      const data = await alertsAPI.getById(incident.id);
      setSelectedAlert(normalizeAlert(data));
    } else {
      setSelectedAlert(normalizeCrash(incident.data));
    }
    setViewOpen(true);
  } catch (error) {
    Swal.fire({
      icon: 'error', title: 'Failed to Load',
      text: error || 'Could not fetch details',
      confirmButtonColor: '#dc2626'
    });
  }
};


const handleUpdateAlert = (updatedIncident) => {
  // updatedIncident could be a raw alert, raw crash, or already normalized
  // Check if it's already normalized (has .source)
  if (updatedIncident.source) {
    // Already normalized — came from socket or previous normalize
    setIncidents(prev => prev.map(i =>
      i.source === updatedIncident.source && i.id === updatedIncident.id
        ? updatedIncident
        : i
    ));
    setSelectedAlert(updatedIncident);
    return;
  }

  // Not normalized yet — detect type by checking crash-specific fields
  const isCrash = !!updatedIncident.triggered_at || !!updatedIncident.event_type;

  const normalized = isCrash
    ? normalizeCrash(updatedIncident)
    : normalizeAlert(updatedIncident);

  setIncidents(prev => prev.map(i =>
    i.source === normalized.source && i.id === normalized.id ? normalized : i
  ));
  setSelectedAlert(normalized);
};


  const handleViewOnMap = (rawData) => {
    navigate('/map', { state: { selectedAlert: rawData } });
  };

const handleStatusChange = async (incident, newStatus) => {
  try {
    let updated;
    if (incident.source === 'crash') {
      updated = await crashAPI.updateStatus(incident.id, newStatus);
      setIncidents(prev => prev.map(i =>
        i.source === 'crash' && i.id === updated.id ? normalizeCrash(updated) : i
      ));
    } else {
      updated = await alertsAPI.updateStatus(incident.id, newStatus);
      setIncidents(prev => prev.map(i =>
        i.source === 'alert' && i.id === updated.id ? normalizeAlert(updated) : i
      ));
    }
    Swal.fire({
      icon: 'success', title: 'Status Updated!',
      text: `Marked as ${newStatus}`,
      timer: 1500, showConfirmButton: false
    });
  } catch (error) {
    Swal.fire({
      icon: 'error', title: 'Update Failed',
      text: error || 'Could not update status',
      confirmButtonColor: '#dc2626'
    });
  }
};

  const handleAssign = async (incident, vehicle_id, responder_id) => {
  try {
    let updated;
    if (incident.source === 'crash') {
      updated = await crashAPI.assign(incident.id, vehicle_id, responder_id);
      setIncidents(prev => prev.map(i =>
        i.source === 'crash' && i.id === updated.id ? normalizeCrash(updated) : i
      ));
    } else {
      updated = await alertsAPI.assign(incident.id, vehicle_id, responder_id);
      setIncidents(prev => prev.map(i =>
        i.source === 'alert' && i.id === updated.id ? normalizeAlert(updated) : i
      ));
    }
    Swal.fire({
      icon: 'success', title: 'Assigned!',
      text: 'Responder and vehicle assigned successfully',
      timer: 1500, showConfirmButton: false
    });
  } catch (error) {
    Swal.fire({
      icon: 'error', title: 'Assignment Failed',
      text: error || 'Could not assign responder',
      confirmButtonColor: '#dc2626'
    });
  }
};

  const handleDelete = (rawData) => setDeleteAlert(rawData);

  const handleDeleteConfirm = async () => {
    try {
      await alertsAPI.delete(deleteAlert.id);
      setIncidents(prev =>
        prev.filter(i => !(i.source === 'alert' && i.id === deleteAlert.id))
      );
      setDeleteAlert(null);
      Swal.fire({
        icon: 'success', title: 'Deleted!',
        text: 'Incident deleted successfully',
        timer: 1500, showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error', title: 'Delete Failed',
        text: error || 'Could not delete',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const columns = useMemo(
    () => createColumns(handleView, handleStatusChange, handleAssign, handleDelete, handleViewOnMap),
    []
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

      <DataTable columns={columns} data={filteredIncidents} hideStatusFilter={!!statusFilter} />

      {/* ── Alert Details Modal (shared with map) ───────────── */}
      <AlertDetailsModal
        open={viewOpen}
        onOpenChange={setViewOpen}
        alert={selectedAlert}
        onUpdateAlert={handleUpdateAlert}
      />

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
