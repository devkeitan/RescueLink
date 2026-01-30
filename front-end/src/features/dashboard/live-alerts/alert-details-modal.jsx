import { X, MapPin, Clock, User, Phone, Smartphone, Activity, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AlertDetailsModal({ alert, onClose, onVerify, onResolve, onAssignResponder }) {
  const severityColors = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Verified: 'bg-blue-100 text-blue-700',
    Resolved: 'bg-green-100 text-green-700',
  };

  return (
    <Dialog open={!!alert} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto  z-[9999]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <div>
              <DialogTitle>Alert Details</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">ID: {alert.id}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status & Severity */}
          <div className="flex flex-wrap gap-3">
            <Badge className={`px-4 py-2 ${severityColors[alert.severity]}`}>
              {alert.severity} Severity
            </Badge>
            <Badge className={`px-4 py-2 ${statusColors[alert.status]}`}>
              {alert.status}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              {alert.type}
            </Badge>
          </div>

          {/* User Information */}
          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold">User Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <User size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium">{alert.user}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Smartphone size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Device</p>
                    <p className="text-sm font-medium">{alert.device}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">+63 917 123 4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Alert Time</p>
                    <p className="text-sm font-medium">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin size={18} className="text-red-600" />
              Location
            </h3>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-mono">{alert.location}</p>
                <p className="text-xs text-muted-foreground mt-1">Quezon City, Metro Manila</p>
              </CardContent>
            </Card>
            
          </div>

          {/* Crash Data */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              Crash Data
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-3">
                  <p className="text-xs text-red-600 font-medium">Impact Force</p>
                  <p className="text-lg font-semibold text-red-700">8.2 G</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3">
                  <p className="text-xs text-blue-600 font-medium">Speed</p>
                  <p className="text-lg font-semibold text-blue-700">65 km/h</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-3">
                  <p className="text-xs text-orange-600 font-medium">Airbag</p>
                  <p className="text-lg font-semibold text-orange-700">Deployed</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-3">
            <h3 className="font-semibold">Activity Timeline</h3>
            <div className="space-y-3">
              <TimelineItem color="red" title="Alert Triggered" time={alert.timestamp} />
              <TimelineItem color="blue" title="BLE Mesh Broadcasted" time="2024-01-14 14:32:18" />
              <TimelineItem color="green" title="Received by System" time="2024-01-14 14:32:22" />
              {alert.status === 'Verified' && (
                <TimelineItem color="purple" title="Verified by Admin" time="2024-01-14 14:32:45" />
              )}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {alert.status === 'Pending' && (
              <Button onClick={onVerify} className="flex-1" variant="default">
                <CheckCircle size={18} className="mr-2" />
                Verify Alert
              </Button>
            )}
            <Button onClick={onAssignResponder} className="flex-1 bg-purple-600 hover:bg-purple-700">
              Assign Responder
            </Button>
            {alert.status !== 'Resolved' && (
              <Button onClick={onResolve} className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle size={18} className="mr-2" />
                Mark as Resolved
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Timeline Item Component
function TimelineItem({ color, title, time }) {
  const colorClasses = {
    red: 'bg-red-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
  };

  return (
    <div className="flex gap-3">
      <div className={`w-2 h-2 ${colorClasses[color]} rounded-full mt-1.5`}></div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
