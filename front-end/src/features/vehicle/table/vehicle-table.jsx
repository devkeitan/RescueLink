import { useState, useEffect } from "react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { TruckIcon, Loader2 } from "lucide-react";
import AddEdit from "./add-edit";
import Swal from "sweetalert2";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { vehiclesAPI } from "@/api/vehicles";

export default function VehicleTable() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [deleteVehicle, setDeleteVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehiclesAPI.getAll();
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load',
        text: error || 'Could not fetch vehicles',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDelete = (vehicle) => {
    setDeleteVehicle(vehicle);
  };

  const handleDeleteConfirm = async () => {
    try {
      await vehiclesAPI.delete(deleteVehicle.id);
      
      // Update local state
      setVehicles(vehicles.filter(v => v.id !== deleteVehicle.id));
      setDeleteVehicle(null);

      // Success message
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Vehicle has been deleted successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error || 'Could not delete vehicle',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const handleSave = async (vehicleData) => {
    try {
      if (selectedVehicle) {
        // Update existing vehicle
        const updated = await vehiclesAPI.update(selectedVehicle.id, vehicleData);
        setVehicles(vehicles.map(v => v.id === updated.id ? updated : v));
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Vehicle updated successfully',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Create new vehicle
        const newVehicle = await vehiclesAPI.create(vehicleData);
        setVehicles([...vehicles, newVehicle]);
        
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: 'Vehicle added successfully',
          timer: 1500,
          showConfirmButton: false,
        });
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save vehicle:', error);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: error || 'Could not save vehicle',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const columns = createColumns(handleEdit, handleDelete);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vehicle Management</h1>
          <p className="text-gray-600 mt-1">Manage emergency response vehicles</p>
        </div>
        <Button onClick={handleAdd} className="text-white bg-red-600 hover:bg-red-700">
          <TruckIcon className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>
    
      <DataTable columns={columns} data={vehicles} />
      
      <AddEdit
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        vehicle={selectedVehicle}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteVehicle} onOpenChange={(open) => !open && setDeleteVehicle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete vehicle <strong>{deleteVehicle?.license_plate}</strong> ({deleteVehicle?.model}).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
