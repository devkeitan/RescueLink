import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { allAlertsAPI } from '@/api/allAlerts';
import AlertDetailsModal from '@/features/dashboard/live-alerts/alert-details-modal';
import AccidentMap from '@/features/dashboard/live-map/map-view';
import AlertSidebar from '@/features/dashboard/live-alerts/alert-sidebar';
import { socket } from '@/lib/socket';


const normalizeAlert = (alert) => ({
  type: 'alert',
  id: alert.id,
  userId: alert.user_id,
  status: alert.status,
  timestamp: alert.reported_at,
  latitude: alert.latitude,
  longitude: alert.longitude,
  data: alert,
});

const normalizeCrash = (crash) => ({
  type: 'crash',
  id: crash.id,
  userId: crash.user_id,
  status: crash.status,
  timestamp: crash.triggered_at,
  latitude: crash.latitude,
  longitude: crash.longitude,
  data: crash,
});

const normalizeBle = (ble) => ({
  type: 'ble',
  id: ble.id,
  userId: ble.user_id,
  status: ble.status,
  timestamp: ble.timestamp,
  latitude: ble.latitude,
  longitude: ble.longitude,
  data: ble,
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
    // ── Alert listeners ──
    function onNewAlert(newAlert) {
      setAlerts(prev => [normalizeAlert(newAlert), ...prev]);
    }
    function onAlertStatusUpdated(updated) {
      setAlerts(prev => prev.map(a =>
        a.type === 'alert' && a.id === updated.id
          ? { ...a, status: updated.status, data: { ...a.data, ...updated } }
          : a
      ));
      setSelectedAlert(prev =>
        prev?.type === 'alert' && prev.id === updated.id
          ? { ...prev, status: updated.status, data: { ...prev.data, ...updated } }
          : prev
      );
      setDetailsAlert(prev =>
        prev?.type === 'alert' && prev.id === updated.id
          ? { ...prev, status: updated.status, data: { ...prev.data, ...updated } }
          : prev
      );
    }
    function onAlertAssigned(updated) {
      const normalized = normalizeAlert(updated);
      setAlerts(prev => prev.map(a =>
        a.type === 'alert' && a.id === updated.id ? normalized : a
      ));
      setSelectedAlert(prev => prev?.type === 'alert' && prev.id === updated.id ? normalized : prev);
      setDetailsAlert(prev => prev?.type === 'alert' && prev.id === updated.id ? normalized : prev);
    }
    function onAlertUpdated(updated) {
      setAlerts(prev => prev.map(a =>
        a.type === 'alert' && a.id === updated.id ? normalizeAlert(updated) : a
      ));
    }
    function onAlertDeleted({ id }) {
      const deletedId = Number(id);
      setAlerts(prev => prev.filter(a => !(a.type === 'alert' && a.id === deletedId)));
      setSelectedAlert(prev => prev?.type === 'alert' && prev.id === deletedId ? null : prev);
      setDetailsAlert(prev => {
        if (prev?.type === 'alert' && prev.id === deletedId) {
          setDetailsModalOpen(false);
          return null;
        }
        return prev;
      });
    }

    // ── Crash listeners ──
    function onNewCrash(newCrash) {
      setAlerts(prev => [normalizeCrash(newCrash), ...prev]);
    }
    function onCrashUpdated(updated) {
      const normalized = normalizeCrash(updated);
      setAlerts(prev => prev.map(a =>
        a.type === 'crash' && a.id === updated.id ? normalized : a
      ));
      setSelectedAlert(prev => prev?.type === 'crash' && prev.id === updated.id ? normalized : prev);
      setDetailsAlert(prev => prev?.type === 'crash' && prev.id === updated.id ? normalized : prev);
    }
    function onCrashAssigned(updated) {
      const normalized = normalizeCrash(updated);
      setAlerts(prev => prev.map(a =>
        a.type === 'crash' && a.id === updated.id ? normalized : a
      ));
      setSelectedAlert(prev => prev?.type === 'crash' && prev.id === updated.id ? normalized : prev);
      setDetailsAlert(prev => prev?.type === 'crash' && prev.id === updated.id ? normalized : prev);
    }

    // ── BLE listeners ──
function onNewBle(newBle) {
  setAlerts(prev => [normalizeBle(newBle), ...prev]);
}
function onBleUpdated(updated) {
  const normalized = normalizeBle(updated);
  setAlerts(prev => prev.map(a =>
    a.type === 'ble' && a.id === updated.id ? normalized : a
  ));
  setSelectedAlert(prev =>
    prev?.type === 'ble' && prev.id === updated.id ? normalized : prev
  );
  setDetailsAlert(prev =>
    prev?.type === 'ble' && prev.id === updated.id ? normalized : prev
  );
}

    socket.on('alert:new',            onNewAlert);
    socket.on('alert:status_updated', onAlertStatusUpdated);
    socket.on('alert:assigned',       onAlertAssigned);
    socket.on('alert:updated',        onAlertUpdated);
    socket.on('alert:deleted',        onAlertDeleted);
    socket.on('crash:new',            onNewCrash);
    socket.on('crash:updated',        onCrashUpdated);
    socket.on('crash:assigned',       onCrashAssigned);
    socket.on('ble:new',     onNewBle);
socket.on('ble:updated', onBleUpdated);

    return () => {
      socket.off('alert:new',            onNewAlert);
      socket.off('alert:status_updated', onAlertStatusUpdated);
      socket.off('alert:assigned',       onAlertAssigned);
      socket.off('alert:updated',        onAlertUpdated);
      socket.off('alert:deleted',        onAlertDeleted);
      socket.off('crash:new',            onNewCrash);
      socket.off('crash:updated',        onCrashUpdated);
      socket.off('crash:assigned',       onCrashAssigned);
      socket.off('ble:new',     onNewBle);
  socket.off('ble:updated', onBleUpdated);
    };
  }, []);

  // ── Auto-select from navigation state ───────────────────
  useEffect(() => {
    if (location.state?.selectedAlert) {
      const incident = location.state.selectedAlert;
      // Already normalized if it has .type set by our normalize functions
      const normalized = (incident.type === 'alert' || incident.type === 'crash')
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

  const handleAlertSelect = useCallback((incident) => setSelectedAlert(incident), []);

  const handleViewDetails = useCallback((incident) => {
    setDetailsAlert(incident);
    setDetailsModalOpen(true);
  }, []);

  const handleMarkerClick = useCallback((incident) => {
    setSelectedAlert(incident);
    setDetailsAlert(incident);
    setDetailsModalOpen(true);
  }, []);

  const handleUpdateAlert = useCallback((updatedIncident) => {
    const isCrash =
      updatedIncident.type === 'crash' ||
      !!updatedIncident.triggered_at ||
      !!updatedIncident.event_type;

    const normalized = isCrash
      ? normalizeCrash(updatedIncident.data || updatedIncident)
      : normalizeAlert(updatedIncident.data || updatedIncident);

    setAlerts(prev => prev.map(a =>
      a.type === normalized.type && a.id === normalized.id ? normalized : a
    ));
    setDetailsAlert(normalized);
    setSelectedAlert(prev =>
      prev?.type === normalized.type && prev.id === normalized.id ? normalized : prev
    );
  }, []);

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
