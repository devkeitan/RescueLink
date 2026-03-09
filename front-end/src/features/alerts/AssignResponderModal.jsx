import { useState, useEffect } from 'react';
import { Truck, Users } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { usersAPI } from '@/api/users';
import { vehiclesAPI } from '@/api/vehicles';
import { alertsAPI } from '@/api/alerts';
import { crashAPI } from '@/api/crash';

export default function AssignResponderModal({ open, onOpenChange, alert: incident, isCrash, onAssigned }) {
  if (!incident) return null;

  const data = incident.data || incident;

  const [responders, setResponders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedResponderId, setSelectedResponderId] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (open) fetchRespondersAndVehicles();
  }, [open]);

  useEffect(() => {
    if (data) {
      setSelectedResponderId(data.assigned_responder_id || data.responder_id || null);
      setSelectedVehicleId(data.assigned_vehicle_id || data.vehicle_id || null);
      setMessage(null);
    }
  }, [incident]);

const fetchRespondersAndVehicles = async () => {
  try {
    setLoading(true);
    const [respondersData, vehiclesData] = await Promise.all([
      usersAPI.getAll({ role: 'responder' }),
      vehiclesAPI.getAll(),
    ]);
    setResponders(respondersData);
    setVehicles(
      vehiclesData.filter(
        (v) => v.status === 'available' ||
               v.id === (data?.assigned_vehicle_id || data?.vehicle_id)
      )
    );
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};

  const handleAssign = async () => {
    if (!selectedResponderId || !selectedVehicleId) {
      setMessage({ type: 'error', text: 'Please select both a responder and a vehicle.' });
      return;
    }
    try {
      setIsAssigning(true);
      setMessage(null);

      // Single call — assign + auto sets status to 'responding'
      let updated;
      if (isCrash) {
        updated = await crashAPI.assign(data.id, selectedVehicleId, selectedResponderId);
      } else {
        updated = await alertsAPI.assign(data.id, selectedVehicleId, selectedResponderId);
      }

      onAssigned(updated);
      setMessage({ type: 'success', text: 'Responder assigned! Status set to responding.' });
      await fetchRespondersAndVehicles();
    } catch (error) {
      console.error('Assign error:', error);
      setMessage({ type: 'error', text: 'Failed to assign. Please try again.' });
    } finally {
      setIsAssigning(false);
    }
  };

  const currentResponderId = data?.assigned_responder_id || data?.responder_id;
  const currentVehicleId   = data?.assigned_vehicle_id  || data?.vehicle_id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users size={18} />
            {isCrash ? 'Assign Responder to Crash' : 'Assign Responder & Vehicle'}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Loading available responders and vehicles...
          </p>
        ) : (
          <div className="space-y-4 pt-2">

            {(currentResponderId || currentVehicleId) && (
              <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded">
                ℹ️ This {isCrash ? 'crash' : 'alert'} already has an assignment. Submitting will replace it.
              </p>
            )}

            <div className='grid md:grid-cols-2 gap-2'>
            {/* Responder Select */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium">Select Responder</label>
              <Select 
                value={selectedResponderId?.toString()}
                onValueChange={(value) => setSelectedResponderId(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a responder..." />
                </SelectTrigger>
                <SelectContent>
                  {responders.length === 0 ? (
                    <SelectItem value="none" disabled>No responders available</SelectItem>
                  ) : (
                    responders.map((responder) => (
                      <SelectItem key={responder.id} value={responder.id.toString()}>
                        {responder.first_name} {responder.last_name} - {responder.user_phone_number || 'No phone'}
                        {responder.id === currentResponderId ? ' ✅ Currently Assigned' : ''}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Vehicle</label>
              <Select
                value={selectedVehicleId?.toString()}
                onValueChange={(value) => setSelectedVehicleId(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a vehicle..." />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.length === 0 ? (
                    <SelectItem value="none" disabled>No vehicles available</SelectItem>
                  ) : (
                    vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                        {vehicle.license_plate} - {vehicle.vehicle_type} ({vehicle.model})
                        {vehicle.id === currentVehicleId
                          ? ' ✅ Currently Assigned'
                          : ''}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            </div>

            {/* Message */}
            {message && (
              <p className={`text-sm font-medium ${
                message.type === 'error' ? 'text-red-600' : 'text-green-600'
              }`}>
                {message.type === 'error' ? '⚠️' : '✅'} {message.text}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isAssigning}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleAssign}
                disabled={!selectedResponderId || !selectedVehicleId || isAssigning}
              >
                <Truck size={16} className="mr-2" />
                {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
