import { X, MapPin, Clock, User, Phone, Smartphone, Truck, Car, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/features/auth/AuthContext';
import AssignResponderModal from "@/features/alerts/AssignResponderModal";
import { createPortal } from "react-dom";
import { useState } from "react";

export default function IncidentDetailPanel({ incident, onClose, onUpdateAlert }) {
  if (!incident) return null;

  const { user } = useAuth();
  const canAssign = ['admin', 'responder'].includes(user?.role);

  const isCrash = incident.type === 'crash';
  const isBle = incident.type === 'ble';
  const isAlert = incident.type === 'alert';
  const data = incident.data || incident;
  const currentStatus = incident.status ?? data.status;

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [imageEnlarged, setImageEnlarged] = useState(false);

  // BLE active assignments from nested arrays
  const activeBleResponder = isBle
    ? data.responder_assignments?.find(a => !a.unassigned_at && a.status !== 'resolved')
    : null;
  const activeBleVehicle = isBle
    ? data.vehicle_assignments?.find(a => !a.unassigned_at)
    : null;

  const hasAssignment = isBle
    ? (activeBleResponder || activeBleVehicle)
    : (data.responder || data.vehicle);

  const severityColors = {
    critical: "bg-red-100 text-red-700 border-red-200",
    high:     "bg-orange-100 text-orange-700 border-orange-200",
    medium:   "bg-yellow-100 text-yellow-700 border-yellow-200",
    low:      "bg-blue-100 text-blue-700 border-blue-200",
  };

  const statusColors = {
    pending:    "bg-yellow-100 text-yellow-700",
    responding: "bg-blue-100 text-blue-700",
    resolved:   "bg-green-100 text-green-700",
    cancelled:  "bg-gray-100 text-gray-700",
  };

  return (
    <>
      <div className="flex flex-col h-full border-l bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40 shrink-0">
          <h2 className="font-semibold text-sm">
            {isCrash ? '💥 Crash Details' : isBle ? '📍 BLE Details' : '🚨 Alert Details'}
          </h2>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">

          {/* Badges */}
          <div className="flex flex-wrap gap-2 capitalize">
            <Badge className={
              isCrash ? 'bg-red-100 text-red-700 border-red-200'
              : isBle  ? 'bg-amber-100 text-amber-700 border-amber-200'
              :          'bg-purple-100 text-purple-700 border-purple-200'
            }>
              {isCrash ? '💥 Auto Crash' : isBle ? '📍 BLE' : '🚨 Manual Alert'}
            </Badge>

            {isAlert && data.severity && (
              <Badge className={severityColors[data.severity] || 'bg-gray-100 text-gray-700'}>
                {data.severity} Severity
              </Badge>
            )}

            <Badge className={statusColors[currentStatus] || 'bg-gray-100 text-gray-700'}>
              {currentStatus}
            </Badge>

            {isAlert && data.alert_type && (
              <Badge variant="secondary" className="capitalize">
                {data.alert_type.replace('_', ' ')}
              </Badge>
            )}
          </div>

          {/* Title / Description */}
          <div>
            <h3 className="font-semibold text-base">
              {isCrash
                ? `Crash Detection #${data.id}`
                : isBle
                ? `BLE Emergency #${data.id}`
                : (data.title || `${data.alert_type} Alert`)}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isCrash
                ? `Impact: ${data.impact_force ?? 'N/A'}g · Battery: ${data.device_battery ?? 'N/A'}% · Network: ${data.network_type ?? 'N/A'}`
                : isBle
                ? `Device ID: ${data.device_id ?? 'N/A'}`
                : (data.description || 'No description available')}
            </p>
          </div>

          {/* User Info */}
          <Card className="bg-muted/50 py-0">
            <CardContent className="p-3 space-y-2">
              <h3 className="font-semibold text-sm">User Information</h3>
              <div className="space-y-2">
                <Info icon={<User size={15} />} label="Name">
                  {data.user?.first_name} {data.user?.last_name}
                </Info>
                <Info icon={<Smartphone size={15} />} label="Email">
                  {data.user?.email ? String(data.user.email).toLowerCase() : 'N/A'}
                </Info>
                <Info icon={<Phone size={15} />} label="Phone">
                  {data.user?.user_phone_number || 'N/A'}
                </Info>
                <Info icon={<Clock size={15} />} label={isCrash ? 'Triggered At' : isBle ? 'BLE Time' : 'Alert Time'}>
                  {isBle
                    ? new Date((data.timestamp || 0) * 1000).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
                    : new Date(data.triggered_at || data.reported_at).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}
                </Info>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="py-0">
            <CardContent className="p-3">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <MapPin size={15} className="text-red-600" /> Location
              </h3>
              <p className="text-sm font-medium">
                {isCrash
                  ? 'GPS Detected Location'
                  : isBle
                  ? 'BLE Detected Location'
                  : (data.location || 'Not specified')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.latitude}, {data.longitude}
              </p>
            </CardContent>
          </Card>

          {/* Alert Image */}
          {isAlert && data.image_url && (
            <div>
              <h3 className="font-semibold text-sm mb-2">Attached Image</h3>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setImageEnlarged(true)}
              >
                <ImageIcon size={14} />
                View Attached Image
              </Button>
            </div>
          )}

          {/* Current Assignment */}
          {hasAssignment && (
            <Card className="bg-green-50/50 border-green-200 py-0">
              <CardContent className="p-3 space-y-2">
                <h3 className="font-semibold text-sm text-green-800">Current Assignment</h3>

                {/* Alert / Crash — flat fields */}
                {!isBle && data.responder && (
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-green-600 shrink-0" />
                    <span>
                      <strong>Responder:</strong> {data.responder.first_name} {data.responder.last_name}
                      {data.responder.user_phone_number && ` — ${data.responder.user_phone_number}`}
                    </span>
                  </div>
                )}
                {!isBle && data.vehicle && (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck size={14} className="text-blue-600 shrink-0" />
                    <span>
                      <strong>Vehicle:</strong> {data.vehicle.license_plate} — {data.vehicle.vehicle_type}
                      {data.vehicle.model && ` (${data.vehicle.model})`}
                      <Badge className={`ml-2 text-xs ${
                        data.vehicle.status === 'available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {data.vehicle.status}
                      </Badge>
                    </span>
                  </div>
                )}

                {/* BLE — nested assignment arrays */}
                {isBle && activeBleResponder && (
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-green-600 shrink-0" />
                    <span>
                      <strong>Responder:</strong> {activeBleResponder.responder?.first_name} {activeBleResponder.responder?.last_name}
                      {activeBleResponder.responder?.user_phone_number && ` — ${activeBleResponder.responder.user_phone_number}`}
                    </span>
                  </div>
                )}
                {isBle && activeBleVehicle && (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck size={14} className="text-blue-600 shrink-0" />
                    <span>
                      <strong>Vehicle:</strong> {activeBleVehicle.vehicle?.license_plate} — {activeBleVehicle.vehicle?.vehicle_type}
                      {activeBleVehicle.vehicle?.model && ` (${activeBleVehicle.vehicle.model})`}
                      <Badge className={`ml-2 text-xs ${
                        activeBleVehicle.vehicle?.status === 'available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {activeBleVehicle.vehicle?.status}
                      </Badge>
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Crash Sensor Data */}
          {isCrash && (
            <Card className="bg-red-50/50 border-red-200 py-0">
              <CardContent className="p-3 space-y-2">
                <h3 className="font-semibold text-sm text-red-800 flex items-center gap-2">
                  <Car size={14} /> Crash Sensor Data
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Info icon={<Car size={14} />} label="Impact Force">
                    {data.impact_force ?? 'N/A'}g
                  </Info>
                  <Info icon={<Clock size={14} />} label="Stillness">
                    {data.stillness_duration ?? 'N/A'}s
                  </Info>
                  <Info icon={<Smartphone size={14} />} label="Battery">
                    {data.device_battery ?? 'N/A'}%
                  </Info>
                  <Info icon={<Smartphone size={14} />} label="Network">
                    {data.network_type ?? 'N/A'}
                  </Info>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Assign Button */}
          {canAssign && (currentStatus === 'pending' || currentStatus === 'responding') && (
            <Button
              onClick={() => setAssignModalOpen(true)}
              className="w-full"
              variant="secondary"
            >
              <Truck size={16} className="mr-2" />
              {hasAssignment ? 'Reassign Responder' : 'Assign Responder'}
            </Button>
          )}

        </div>
      </div>

      {/* Assign Modal */}
      <AssignResponderModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        alert={incident}
        isCrash={isCrash}
        isBle={isBle}
        onAssigned={(updated) => {
          onUpdateAlert(updated);
          setAssignModalOpen(false);
        }}
      />

      {/* Lightbox */}
      {imageEnlarged && createPortal(
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center"
          style={{ zIndex: 9999 }}
          onClick={() => setImageEnlarged(false)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 rounded-full p-2 transition"
            onClick={() => setImageEnlarged(false)}
          >
            <X size={24} />
          </button>
          <img
            src={data.image_url}
            alt="Alert image enlarged"
            className="w-screen h-screen object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-4 text-white text-xs opacity-60">
            Press × to close
          </p>
        </div>,
        document.body
      )}
    </>
  );
}

function Info({ icon, label, children }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{children}</p>
      </div>
    </div>
  );
}