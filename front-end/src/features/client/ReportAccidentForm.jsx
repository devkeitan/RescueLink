import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, MapPin, Loader2, Car, Users, Flame } from "lucide-react";
import { alertsAPI } from "@/api/alerts";
import Swal from "sweetalert2";

export default function ReportAccidentForm() {
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    accident_type: '',
    severity: '',
    title: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    vehicles_involved: '1',
    injuries: '',
    hazards: '',
    image_url: '',
  });

  // Get current location
 // Get current location and convert to address
const getCurrentLocation = () => {
  setGettingLocation(true);
  
  if (!navigator.geolocation) {
    Swal.fire({
      icon: 'error',
      title: 'Geolocation Not Supported',
      text: 'Your browser does not support geolocation',
      confirmButtonColor: '#dc2626',
    });
    setGettingLocation(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      try {
        // Reverse geocode to get address
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en-US,en;q=0.9',
            }
          }
        );
        
        const data = await response.json();
        
        // Build readable address
        let address = '';
        
        if (data.address) {
          const parts = [];
          
          // Road/Street
          if (data.address.road) parts.push(data.address.road);
          
          // Suburb/Neighborhood
          if (data.address.suburb) parts.push(data.address.suburb);
          else if (data.address.neighbourhood) parts.push(data.address.neighbourhood);
          
          // City
          if (data.address.city) parts.push(data.address.city);
          else if (data.address.town) parts.push(data.address.town);
          else if (data.address.municipality) parts.push(data.address.municipality);
          
          // State/Province (for Philippines)
          if (data.address.state) parts.push(data.address.state);
          
          address = parts.join(', ');
        }
        
        // Fallback to display_name if address parts not available
        if (!address && data.display_name) {
          address = data.display_name;
        }
        
        // If still no address, use coordinates
        if (!address) {
          address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
        
        setFormData({
          ...formData,
          latitude: lat.toString(),
          longitude: lng.toString(),
          location: address,
        });

        setGettingLocation(false);
        
        Swal.fire({
          icon: 'success',
          title: 'Location Found!',
          html: `
            <p class="font-semibold mb-2">${address}</p>
            <p class="text-sm text-gray-600">Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
          `,
          timer: 3000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Geocoding error:', error);
        
        // Fallback to coordinates if geocoding fails
        const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        setFormData({
          ...formData,
          latitude: lat.toString(),
          longitude: lng.toString(),
          location: fallbackAddress,
        });
        
        setGettingLocation(false);
        
        Swal.fire({
          icon: 'warning',
          title: 'Location Found (Coordinates Only)',
          text: 'Could not get street address, but coordinates are saved.',
          timer: 2000,
        });
      }
    },
    (error) => {
      console.error('Geolocation error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Location Error',
        text: 'Could not get your location. Please enter manually.',
        confirmButtonColor: '#dc2626',
      });
      setGettingLocation(false);
    }
  );
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      if (!formData.accident_type || !formData.severity || !formData.location) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Fields',
          text: 'Please fill in all required fields',
          confirmButtonColor: '#dc2626',
        });
        setLoading(false);
        return;
      }

      // Build title if not provided
      const title = formData.title || `${formData.accident_type} - ${formData.location.substring(0, 50)}`;

      // Build description
      const descriptionParts = [];
      if (formData.description) descriptionParts.push(formData.description);
      if (formData.vehicles_involved) descriptionParts.push(`Vehicles involved: ${formData.vehicles_involved}`);
      if (formData.injuries) descriptionParts.push(`Injuries: ${formData.injuries}`);
      if (formData.hazards) descriptionParts.push(`Hazards: ${formData.hazards}`);
      
      const description = descriptionParts.join('\n');

      // Clean data
      const cleanedData = {
        alert_type: 'accident', // Always accident for this system
        severity: formData.severity,
        title: title.trim(),
        description: description || null,
        location: formData.location.trim(),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        image_url: formData.image_url || null,
      };

      console.log('Submitting report:', cleanedData);

      // Submit
      const result = await alertsAPI.create(cleanedData);

      console.log('Report submitted:', result);

      // Success
      Swal.fire({
        icon: 'success',
        title: 'Accident Reported!',
        html: `
          <p class="text-lg font-semibold mb-2">Emergency services have been notified</p>
          <div class="bg-gray-50 p-4 rounded-lg mt-4 text-left">
            <p class="text-sm text-gray-600"><strong>Report ID:</strong> #${result.id}</p>
            <p class="text-sm text-gray-600"><strong>Status:</strong> Pending Response</p>
            <p class="text-sm text-gray-600"><strong>Location:</strong> ${formData.location}</p>
          </div>
          <p class="text-sm text-gray-600 mt-4">An ambulance and rescue team will be dispatched shortly.</p>
          <p class="text-sm font-semibold text-red-600 mt-2">Help is on the way!</p>
        `,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'OK',
      });

      // Reset form
      setFormData({
        accident_type: '',
        severity: '',
        title: '',
        description: '',
        location: '',
        latitude: '',
        longitude: '',
        vehicles_involved: '1',
        injuries: '',
        hazards: '',
        image_url: '',
      });
    } catch (error) {
      console.error('Submit error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error?.response?.data?.message || error?.message || 'Could not submit report',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-7 w-7 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Report Road Accident</CardTitle>
              <CardDescription className="text-base">
                Report a road accident or traffic incident. Emergency responders will be dispatched immediately.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Accident Type */}
            <div className="space-y-2">
              <Label className="text-base">Type of Accident *</Label>
              <Select
                value={formData.accident_type}
                onValueChange={(value) => setFormData({ ...formData, accident_type: value })}
                disabled={loading}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Select accident type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Accident Type</SelectLabel>
                    <SelectItem value="Vehicle Collision">🚗💥 Vehicle Collision</SelectItem>
                    <SelectItem value="Pedestrian Accident">🚶‍♂️ Pedestrian Involved</SelectItem>
                    <SelectItem value="Motorcycle Accident">🏍️ Motorcycle Accident</SelectItem>
                    <SelectItem value="Multi-Vehicle Pileup">🚗🚙🚕 Multi-Vehicle Pileup</SelectItem>
                    <SelectItem value="Vehicle Rollover">🔄 Vehicle Rollover</SelectItem>
                    <SelectItem value="Hit and Run">🚗💨 Hit and Run</SelectItem>
                    <SelectItem value="Vehicle Fire">🔥 Vehicle Fire</SelectItem>
                    <SelectItem value="Vehicle in Water">💧 Vehicle in Water</SelectItem>
                    <SelectItem value="Other">📋 Other Road Incident</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Severity */}
            <div className="space-y-2">
              <Label className="text-base">Severity Level *</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData({ ...formData, severity: value })}
                disabled={loading}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Severity</SelectLabel>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟢</span>
                        <div>
                          <div className="font-medium">Minor</div>
                          <div className="text-xs text-gray-500">Property damage only, no injuries</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟡</span>
                        <div>
                          <div className="font-medium">Moderate</div>
                          <div className="text-xs text-gray-500">Minor injuries, medical attention needed</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟠</span>
                        <div>
                          <div className="font-medium">Serious</div>
                          <div className="text-xs text-gray-500">Multiple injuries, immediate response required</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔴</span>
                        <div>
                          <div className="font-medium">Critical</div>
                          <div className="text-xs text-gray-500">Life-threatening injuries, urgent rescue needed</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gray-600" />
                  Vehicles Involved
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  className="focus:ring-2 focus:ring-red-500 focus:outline-none"
                  placeholder="1"
                  value={formData.vehicles_involved}
                  onChange={(e) => setFormData({ ...formData, vehicles_involved: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  People Injured
                </Label>
                <Input
                  className="focus:ring-2 focus:ring-red-500 focus:outline-none"
                  placeholder="e.g., 2 injured"
                  value={formData.injuries}
                  onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-gray-600" />
                  Hazards Present
                </Label>
                <Select
                  value={formData.hazards}
                  onValueChange={(value) => setFormData({ ...formData, hazards: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Fire">🔥 Fire</SelectItem>
                    <SelectItem value="Fuel Leak">⛽ Fuel Leak</SelectItem>
                    <SelectItem value="Electrical">⚡ Electrical</SelectItem>
                    <SelectItem value="Blocked Road">🚧 Road Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-base">Accident Details</Label>
              <Textarea
                className="focus:ring-2 focus:ring-red-500 focus:outline-none min-h-[100px]"
                placeholder="Describe what happened, what you see, any special circumstances..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
              />
            </div>

            {/* Location Section */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Accident Location *
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={loading || gettingLocation}
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  {gettingLocation ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Use My Location
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <Input
                  className="focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  placeholder="Street, Landmark, City (e.g., EDSA-Shaw Blvd, Mandaluyong)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  step="0.000001"
                  className="focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-sm"
                  placeholder="Latitude (auto-filled)"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  disabled={loading}
                />

                <Input
                  type="number"
                  step="0.000001"
                  className="focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-sm"
                  placeholder="Longitude (auto-filled)"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label>Photo URL (Optional)</Label>
              <Input
                className="focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="https://example.com/accident-photo.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Add a photo URL if available (file upload feature coming soon)
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white h-14 text-lg font-semibold shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-6 w-6" />
                    Submit Accident Report
                  </>
                )}
              </Button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900 text-center">
                <strong>⚠️ Emergency:</strong> If this is a life-threatening situation, please call <strong className="text-lg">911</strong> immediately while submitting this report.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
