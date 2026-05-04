import React, { useState } from "react";
import { MapPin, Clock, User, Phone, Smartphone, Truck, Car, ImageIcon, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/features/auth/AuthContext';
import AssignResponderModal from "@/features/alerts/AssignResponderModal";
import { createPortal } from "react-dom"; 
export default function AlertDetailsModal({ open, onOpenChange, alert: incident, onUpdateAlert }) {
  if (!incident) return null;

  const { user } = useAuth();
  const canAssign = ['admin', 'responder'].includes(user?.role);

 const isCrash = incident.type === 'crash';
  const data = incident.data || incident;
  const currentStatus = incident.status ?? data.status;

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [imageEnlarged, setImageEnlarged] = useState(false);

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
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCrash ? '💥 Crash Event Details' : '🚨 Alert Details'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">

            {/* Badges */}
            <div className="flex flex-wrap gap-3 capitalize justify-center">
              <Badge className={isCrash
                ? 'bg-red-100 text-red-700 border-red-200 px-4 py-2'
                : 'bg-purple-100 text-purple-700 border-purple-200 px-4 py-2'}>
                {isCrash ? '💥 Auto Crash' : '🚨 Manual Alert'}
              </Badge>
              {!isCrash && data.severity && (
                <Badge className={`px-4 py-2 ${severityColors[data.severity]}`}>
                  {data.severity} Severity
                </Badge>
              )}
              <Badge className={`px-4 py-2 ${statusColors[currentStatus]}`}>
                {currentStatus}
              </Badge>
              {!isCrash && data.alert_type && (
                <Badge variant="secondary" className="px-4 py-2 capitalize">
                  {data.alert_type.replace('_', ' ')}
                </Badge>
              )}
            </div>

            {/* Title */}
            <div>
              <h3 className="font-semibold text-lg">
                {isCrash
                  ? `Crash Detection #${data.id}`
                  : (data.title || `${data.alert_type} Alert`)}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {isCrash
                  ? `Impact: ${data.impact_force ?? 'N/A'}g · Battery: ${data.device_battery ?? 'N/A'}% · Network: ${data.network_type ?? 'N/A'}`
                  : (data.description || 'No description available')}
              </p>
            </div>


            {/* User Info */}
            <Card className="bg-muted/50 py-0">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold">User Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Info icon={<User size={18} />} label="Name">
                    {data.user?.first_name} {data.user?.last_name}
                  </Info>
                  <Info icon={<Smartphone size={18} />} label="Email">
                    {data.user?.email ? String(data.user.email).toLowerCase() : 'N/A'}
                  </Info>
                  <Info icon={<Phone size={18} />} label="Phone">
                    {data.user?.user_phone_number || 'N/A'}
                  </Info>
                  <Info icon={<Clock size={18} />} label={isCrash ? 'Triggered At' : 'Alert Time'}>
                    {new Date(data.triggered_at || data.reported_at).toLocaleString()}
                  </Info>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin size={18} className="text-red-600" />
                Location
              </h3>
              <Card className={"py-0"}>
                <CardContent className="p-4">
                  <p className="text-sm font-medium">
                    {isCrash ? 'GPS Detected Location' : (data.location || 'Location not specified')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Coordinates: {data.latitude}, {data.longitude}
                  </p>
                </CardContent>
              </Card>
            </div>

{/* Alert Image — button to view */}
{!isCrash && data.image_url && (
  <div>
    <h3 className="font-semibold mb-2">Attached Image</h3>
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => setImageEnlarged(true)}
    >
      <ImageIcon size={16} />
      View Attached Image
    </Button>
  </div>
)}




            {/* Current Assignment — both alerts AND crashes */}
            {(data.vehicle || data.responder) && (
              <Card className="bg-green-50/50 border-green-200 py-0">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-green-800">Current Assignment</h3>
                  {data.responder && (
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-green-600" />
                      <span>
                        <strong>Responder:</strong> {data.responder.first_name} {data.responder.last_name}
                        {data.responder.user_phone_number && ` — ${data.responder.user_phone_number}`}
                      </span>
                    </div>
                  )}
                  {data.vehicle && (
                    <div className="flex items-center gap-2 text-sm">
                      <Truck size={16} className="text-blue-600" />
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
                </CardContent>
              </Card>
            )}

            {/* Crash Sensor Data */}
            {isCrash && (
              <Card className="bg-red-50/50 border-red-200 py-0">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-red-800 flex items-center gap-2">
                    <Car size={16} /> Crash Sensor Data
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Info icon={<Car size={16} />} label="Impact Force">
                      {data.impact_force ?? 'N/A'}g
                    </Info>
                    <Info icon={<Clock size={16} />} label="Stillness Duration">
                      {data.stillness_duration ?? 'N/A'}s
                    </Info>
                    <Info icon={<Smartphone size={16} />} label="Device Battery">
                      {data.device_battery ?? 'N/A'}%
                    </Info>
                    <Info icon={<Smartphone size={16} />} label="Network">
                      {data.network_type ?? 'N/A'}
                    </Info>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Message */}
            {message && (
              <p className={`text-sm font-medium ${
                message.type === 'error' ? 'text-red-600' : 'text-green-600'
              }`}>
                {message.type === 'error' ? '⚠️' : '✅'} {message.text}
              </p>
            )}

            <Separator />

            {/* ── Action Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Only show Assign button — status auto-updates on assign */}
              {canAssign && (currentStatus === 'pending' || currentStatus === 'responding') && (
                <Button
                  onClick={() => setAssignModalOpen(true)}
                  className="flex-1"
                  variant="secondary"
                >
                  <Truck size={18} className="mr-2" />
                  {data.responder || data.vehicle ? 'Reassign Responder' : 'Assign Responder'}
                </Button>
              )}
            </div>

          </div>
        </DialogContent>
      </Dialog>
     
      {/* Assign Responder Modal — both alerts AND crashes */}
      <AssignResponderModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        alert={incident}
        isCrash={isCrash}
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
  >
    {/* Close Button */}
    <button
      className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 rounded-full p-2 transition"
      onClick={(e) => {
        e.stopPropagation();
        setImageEnlarged(false);
      }}
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
