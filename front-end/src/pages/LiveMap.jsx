import { useState } from 'react';
import AlertSidebar from '@/features/dashboard/live-map/alert-sidebar';
import MapView from '@/features/dashboard/live-map/map-view';
import AlertDetailsModal from '@/features/dashboard/live-alerts/alert-details-modal';

// Sample alerts in Camarines Norte
const alerts = [
  {
    id: 'A-1234',
    timestamp: '2 min ago',
    severity: 'Critical',
    location: '14.1154° N, 122.9554° E', // Daet
    type: 'Auto Crash Detection',
    user: 'Juan Dela Cruz',
    device: 'Samsung Galaxy S21',
    status: 'Pending',
  },
  {
    id: 'A-1233',
    timestamp: '8 min ago',
    severity: 'High',
    location: '14.0608° N, 122.8456° E', // Vinzons
    type: 'Manual SOS',
    user: 'Maria Santos',
    device: 'iPhone 13',
    status: 'Verified',
  },
  {
    id: 'A-1232',
    timestamp: '15 min ago',
    severity: 'Medium',
    location: '14.2892° N, 122.9142° E', // Labo
    type: 'Auto Crash Detection',
    user: 'Pedro Garcia',
    device: 'OnePlus 9',
    status: 'Pending',
  },
  {
    id: 'A-1231',
    timestamp: '22 min ago',
    severity: 'Critical',
    location: '14.1842° N, 122.7543° E', // Mercedes
    type: 'Manual SOS',
    user: 'Ana Reyes',
    device: 'Xiaomi Redmi Note 10',
    status: 'Resolved',
  },
  {
    id: 'A-1230',
    timestamp: '35 min ago',
    severity: 'High',
    location: '14.3712° N, 122.8934° E', // Jose Panganiban
    type: 'Auto Crash Detection',
    user: 'Carlos Ramos',
    device: 'Samsung Galaxy A52',
    status: 'Verified',
  },
];

export default function LiveMap() {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAlertSelect = (alert) => {
    setSelectedAlert(alert);
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex gap-4 p-6">
      {/* Sidebar */}
      <AlertSidebar
        alerts={alerts}
        selectedAlert={selectedAlert}
        onAlertSelect={handleAlertSelect}
        onViewDetails={handleViewDetails}
      />

      {/* Map */}
      <MapView
        alerts={alerts}
        selectedAlert={selectedAlert}
        onAlertSelect={handleAlertSelect}
      />

      {/* Details Modal */}
      {showModal && selectedAlert && (
        <AlertDetailsModal
          alert={selectedAlert}
          onClose={() => setShowModal(false)}
          onVerify={() => {
            console.log('Verify:', selectedAlert.id);
            setShowModal(false);
          }}
          onResolve={() => {
            console.log('Resolve:', selectedAlert.id);
            setShowModal(false);
          }}
          onAssignResponder={() => {
            console.log('Assign responder:', selectedAlert.id);
          }}
        />
      )}
    </div>
  );
}
