import { useState } from 'react';
import { Clock, MapPin, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import AlertDetailsModal from './alert-details-modal';


const severityColors = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
};

export default function LiveAlertsTable() {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const alerts = [
    {
      id: 'ALERT-001',
      severity: 'Critical',
      user: 'John Doe',
      timestamp: '2024-06-01 14:30',
      location: '123 Main St, Springfield',
      type: 'Fall Detection',
    },
    {
      id: 'ALERT-002',
      severity: 'High',
      user
: 'Jane Smith',
      timestamp: '2024-06-01 15:00',
      location: '456 Elm St, Springfield',
      type: 'SOS Button',
    },];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Live Alerts Feed</CardTitle>
          <CardDescription>Recent SOS alerts</CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="divide-y">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  onClick={() => setSelectedAlert(alert)}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium">{alert.id}</span>
                    <Badge className={severityColors[alert.severity]}>
                      {alert.severity}
                    </Badge>
                  </div>
                  
                  <p className="text-sm font-medium mb-2">{alert.user}</p>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={14} />
                      <span>{alert.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin size={14} />
                      <span className="truncate">{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AlertCircle size={14} />
                      <span>{alert.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedAlert && (
        <AlertDetailsModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onVerify={() => {
            console.log('Verify alert:', selectedAlert.id);
            setSelectedAlert(null);
          }}
          onResolve={() => {
            console.log('Resolve alert:', selectedAlert.id);
            setSelectedAlert(null);
          }}
          onAssignResponder={() => {
            console.log('Assign responder:', selectedAlert.id);
          }}
        />
      )}
    </>
  );
}
