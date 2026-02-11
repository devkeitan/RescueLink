import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AddEdit({ open, onOpenChange, vehicle, onSave }) {
  const isEdit = !!vehicle;
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    license_plate: '',
    vehicle_type: '',
    model: '',
    year: new Date().getFullYear(),
    status: 'available',
    current_location: '',
    current_latitude: '',
    current_longitude: '',
    fuel_level: 100,
    odometer_reading: 0,
    equipment_list: ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        license_plate: vehicle.license_plate,
        vehicle_type: vehicle.vehicle_type,
        model: vehicle.model,
        year: vehicle.year,
        status: vehicle.status,
        current_location: vehicle.current_location,
        current_latitude: vehicle.current_latitude,
        current_longitude: vehicle.current_longitude,
        fuel_level: vehicle.fuel_level,
        odometer_reading: vehicle.odometer_reading,
        equipment_list: vehicle.equipment_list
      });
    } else {
      setFormData({
        license_plate: '',
        vehicle_type: '',
        model: '',
        year: new Date().getFullYear(),
        status: 'available',
        current_location: '',
        current_latitude: '',
        current_longitude: '',
        fuel_level: 100,
        odometer_reading: 0,
        equipment_list: ''
      });
    }
  }, [vehicle, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* License Plate */}
          <div className='space-y-2'>
            <Label>License Plate *</Label>
            <Input
              className="focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="RESCUE-001"
              value={formData.license_plate}
              onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          {/* Vehicle Type */}
          <div className='space-y-2'>
            <Label>Vehicle Type *</Label>
            <Select 
              value={formData.vehicle_type}
              onValueChange={(value) => setFormData({ ...formData, vehicle_type: value })}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Types</SelectLabel>
                  <SelectItem value="ambulance">Ambulance</SelectItem>
                  <SelectItem value="fire_truck">Fire Truck</SelectItem>
                  <SelectItem value="police_car">Police Car</SelectItem>
                  <SelectItem value="rescue_truck">Rescue Truck</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Model and Year Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className='space-y-2'>
              <Label>Model *</Label>
              <Input
                className="focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="Ford Transit Ambulance"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label>Year *</Label>
              <Input
                type="number"
                min="1990"
                max={new Date().getFullYear() + 1}
                className="focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="2023"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className='space-y-2'>
            <Label>Status *</Label>
            <Select 
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in_use">In Use</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out_of_service">Out of Service</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className='space-y-2'>
            <Label>Current Location *</Label>
            <Input
              className="focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Main Station"
              value={formData.current_location}
              onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          {/* Coordinates Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className='space-y-2'>
              <Label>Latitude</Label>
              <Input
                type="number"
                step="0.0001"
                className="focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="40.7128"
                value={formData.current_latitude}
                onChange={(e) => setFormData({ ...formData, current_latitude: parseFloat(e.target.value) || '' })}
                disabled={loading}
              />
            </div>

            <div className='space-y-2'>
              <Label>Longitude</Label>
              <Input
                type="number"
                step="0.0001"
                className="focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="-74.0060"
                value={formData.current_longitude}
                onChange={(e) => setFormData({ ...formData, current_longitude: parseFloat(e.target.value) || '' })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Fuel and Odometer Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className='space-y-2'>
              <Label>Fuel Level (%) *</Label>
              <Input
                type="number"
                min="0"
                max="100"
                className="focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="85"
                value={formData.fuel_level}
                onChange={(e) => setFormData({ ...formData, fuel_level: parseInt(e.target.value) })}
                disabled={loading}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label>Odometer (km) *</Label>
              <Input
                type="number"
                min="0"
                className="focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="15000"
                value={formData.odometer_reading}
                onChange={(e) => setFormData({ ...formData, odometer_reading: parseInt(e.target.value) })}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Equipment List */}
          <div className='space-y-2'>
            <Label>Equipment List</Label>
            <Textarea
              className="focus:ring-2 focus:ring-red-500 focus:outline-none min-h-[80px]"
              placeholder="Defibrillator, Oxygen Tank, Stretcher"
              value={formData.equipment_list}
              onChange={(e) => setFormData({ ...formData, equipment_list: e.target.value })}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Separate items with commas
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                isEdit ? 'Save Changes' : 'Add Vehicle'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
