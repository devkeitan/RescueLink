import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Clock, AlertCircle } from 'lucide-react';

export default function AlertSidebar({ alerts, selectedAlert, onAlertSelect, onViewDetails }) {
  return (
    <Card className="w-80 ">
      <CardContent className="p-4">
        <div className="mb-4">
          <h2 className="font-bold text-lg">Active Alerts</h2>
          <p className="text-xs text-muted-foreground">
            Camarines Norte ({alerts.length})
          </p>
        </div>

        <ScrollArea className="h-[650px]">
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onAlertSelect(alert)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedAlert?.id === alert.id
                    ? 'bg-blue-50 border-blue-600 shadow-md'
                    : 'hover:bg-muted border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-semibold">{alert.id}</span>
                  <Badge
                    className={
                      alert.severity === 'Critical'
                        ? 'bg-red-500 text-white'
                        : alert.severity === 'High'
                        ? 'bg-orange-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>

                <p className="text-sm font-medium mb-1">{alert.user}</p>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={12} />
                    {alert.timestamp}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <AlertCircle size={12} />
                    {alert.type}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(alert);
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
