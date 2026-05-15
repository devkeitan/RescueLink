import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Eye,
  Clock,
  AlertCircle,
  Car,
  AlertTriangle,
  Bluetooth
} from 'lucide-react';

export default function AlertSidebar({
  alerts,
  selectedAlert,
  onAlertSelect,
  onViewDetails
}) {

  const activeIncidents = alerts.filter(
    (i) => i.status !== 'resolved' && i.status !== 'cancelled'
  );

  return (
    <Card className="w-80 p-0">
      <CardContent className="p-4">

        {/* Header */}
        <div className="mb-4">
          <h2 className="font-bold text-lg">Active Incidents</h2>
          <p className="text-xs text-muted-foreground">
            Total ({activeIncidents.length})
          </p>
        </div>

        {/* Incident List */}
        <ScrollArea className="h-[650px]">
          <div className="space-y-2">

            {activeIncidents.map((incident) => (

              <div
                key={`${incident.type}-${incident.id}`}
                onClick={() => onAlertSelect(incident)}
                className={`p-3 rounded-lg border-l-4 border-r border-y cursor-pointer transition-all ${
                  incident.type === 'crash'
                    ? 'border-l-red-600'
                    : incident.type === 'alert'
                    ? 'border-l-purple-600'
                    : 'border-l-amber-500'
                } ${
                  selectedAlert?.id === incident.id
                    ? 'bg-blue-50 shadow-md'
                    : 'hover:bg-muted'
                }`}
              >

                {/* Type + Status + Severity */}
                <div className="flex justify-between gap-2 mb-2 flex-wrap">

                  {/* Incident Type */}
                  <Badge
                    className={
                      incident.type === 'crash'
                        ? 'bg-red-100 text-red-700'
                        : incident.type === 'alert'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-amber-100 text-amber-700'
                    }
                  >
                    <div className="flex items-center gap-1">

                      {incident.type === 'crash' ? (
                        <>
                          <Car size={12} />
                          Crash
                        </>
                      ) : incident.type === 'alert' ? (
                        <>
                          <AlertTriangle size={12} />
                          Alert
                        </>
                      ) : (
                        <>
                          <Bluetooth size={12} />
                          BLE
                        </>
                      )}

                    </div>
                  </Badge>

                  {/* Status + Severity */}
                  <div className="flex gap-1 capitalize">

                    {/* Status */}
                    <Badge
                      className={
                        incident.status === 'pending'
                          ? 'bg-orange-500 text-white'
                          : incident.status === 'responding'
                          ? 'bg-blue-500 text-white'
                          : incident.status === 'assigned'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-500 text-white'
                      }
                    >
                      {incident.status}
                    </Badge>

                    {/* Severity */}
                    {incident.data?.severity && (
                      <Badge
                        className={
                          incident.data.severity === 'critical'
                            ? 'bg-red-500 text-white'
                            : incident.data.severity === 'high'
                            ? 'bg-orange-500 text-white'
                            : incident.data.severity === 'medium'
                            ? 'bg-yellow-500 text-white'
                            : incident.data.severity === 'low'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-500 text-white'
                        }
                      >
                        {incident.data.severity}
                      </Badge>
                    )}

                  </div>
                </div>

                {/* User Name */}
                <p className="text-sm font-medium mb-1">
                  {incident.data?.user
                    ? `${incident.data.user.first_name} ${incident.data.user.last_name}`
                    : 'Unknown User'}
                </p>

                {/* Timestamp + Extra Info */}
                <div className="space-y-1">

                  {/* Timestamp */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={12} />
                    {new Date(incident.timestamp).toLocaleString('en-PH', {
                      timeZone: 'Asia/Manila'
                    })}
                  </div>

                  {/* Incident Details */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground capitalize">
                    <AlertCircle size={12} />

                    {incident.type === 'alert'
                      ? incident.data?.alert_type?.replace('_', ' ')
                      : incident.type === 'crash'
                      ? `Impact: ${incident.data?.impact_force ?? 'N/A'}g`
                      : `Device: ${incident.data?.device_id ?? 'Unknown'}`
                    }

                  </div>
                </div>

                {/* Details Button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(incident);
                  }}
                >
                  <Eye size={14} className="mr-1" />
                  Details
                </Button>

              </div>

            ))}

          </div>
        </ScrollArea>

      </CardContent>
    </Card>
  );
}