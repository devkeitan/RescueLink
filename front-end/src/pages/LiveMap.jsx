import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { allAlertsAPI } from '@/api/allAlerts';
import AlertDetailsModal from '@/features/dashboard/live-alerts/alert-details-modal';
import AccidentMap from '@/features/dashboard/live-map/map-view';
import AlertSidebar from '@/features/dashboard/live-alerts/alert-sidebar';
import { socket } from '@/lib/socket';

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

const LiveMap = () => {
  const location = useLocation();
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsAlert, setDetailsAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchAlerts(); }, []);

  // ── Socket listeners ─────────────────────────────────────
  useEffect(() => {
    function onNewAlert(newAlert) {
      setAlerts(prev => [normalizeAlert(newAlert), ...prev]);
    }

    function onStatusUpdated(updated) {
      setAlerts(prev => prev.map(a =>
        a.source === 'alert' && a.id === updated.id
          ? { ...a, status: updated.status, data: { ...a.data, ...updated } }
          : a
      ));
      setSelectedAlert(prev =>
        prev?.id === updated.id
          ? { ...prev, status: updated.status, data: { ...prev.data, ...updated } }
          : prev
      );
      setDetailsAlert(prev =>
        prev?.id === updated.id
          ? { ...prev, status: updated.status, data: { ...prev.data, ...updated } }
          : prev
      );
    }

    function onAssigned(updated) {
      const normalized = normalizeAlert(updated);
      setAlerts(prev => prev.map(a =>
        a.source === 'alert' && a.id === updated.id ? normalized : a
      ));
      setSelectedAlert(prev => prev?.id === updated.id ? normalized : prev);
      setDetailsAlert(prev => prev?.id === updated.id ? normalized : prev);
    }

    function onUpdated(updated) {
      setAlerts(prev => prev.map(a =>
        a.source === 'alert' && a.id === updated.id ? normalizeAlert(updated) : a
      ));
    }

    function onDeleted({ id }) {
      const deletedId = Number(id);
      setAlerts(prev => prev.filter(a => a.id !== deletedId));
      setSelectedAlert(prev => prev?.id === deletedId ? null : prev);
      setDetailsAlert(prev => prev?.id === deletedId ? null : prev);
      setDetailsModalOpen(prev =>
        prev && detailsAlert?.id === deletedId ? false : prev
      );
    }

    socket.on('alert:new', onNewAlert);
    socket.on('alert:status_updated', onStatusUpdated);
    socket.on('alert:assigned', onAssigned);
    socket.on('alert:updated', onUpdated);
    socket.on('alert:deleted', onDeleted);

    return () => {
      socket.off('alert:new', onNewAlert);
      socket.off('alert:status_updated', onStatusUpdated);
      socket.off('alert:assigned', onAssigned);
      socket.off('alert:updated', onUpdated);
      socket.off('alert:deleted', onDeleted);
    };
  }, []);

  // ── Auto-select from navigation state ───────────────────
  useEffect(() => {
    if (location.state?.selectedAlert) {
      const incident = location.state.selectedAlert;
      // Handle both raw alert and normalized incident shapes
      const normalized = incident.source
        ? incident
        : normalizeAlert(incident);
      setSelectedAlert(normalized);
      setDetailsAlert(normalized);
      setDetailsModalOpen(true);
    }
  }, [location.state]);

  // ── Fetch ────────────────────────────────────────────────
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await allAlertsAPI.getAll({ limit: 100 });
      setAlerts(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleAlertSelect = (incident) => setSelectedAlert(incident);

  const handleViewDetails = (incident) => {
    setDetailsAlert(incident);
    setDetailsModalOpen(true);
  };

  const handleMarkerClick = (incident) => {
    setSelectedAlert(incident);
    setDetailsAlert(incident);
    setDetailsModalOpen(true);
  };

  const handleUpdateAlert = (updatedAlert) => {
    const normalized = normalizeAlert(updatedAlert);
    setAlerts(prev => prev.map(a =>
      a.source === 'alert' && a.id === updatedAlert.id ? normalized : a
    ));
    setDetailsAlert(normalized);
    setSelectedAlert(prev => prev?.id === updatedAlert.id ? normalized : prev);
  };

  // ── Render ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading incidents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button onClick={fetchAlerts} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen w-full flex gap-4">
        <AlertSidebar
          alerts={alerts}
          selectedAlert={selectedAlert}
          onAlertSelect={handleAlertSelect}
          onViewDetails={handleViewDetails}
        />

        <div className="flex-1 rounded-lg overflow-hidden">
          <AccidentMap
            alerts={alerts}
            selectedAlert={selectedAlert}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>

      <AlertDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        alert={detailsAlert}
        onUpdateAlert={handleUpdateAlert}
      />
    </>
  );
};

export default LiveMap;
