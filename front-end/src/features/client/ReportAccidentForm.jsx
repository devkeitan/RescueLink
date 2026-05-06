import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, MapPin, Loader2, Car, Users, Flame } from "lucide-react";
import { alertsAPI } from "@/api/alerts";
import { geolocationAPI } from '@/api/geolocation';
import Swal from "sweetalert2";

export default function ReportAccidentForm() {
  // STATE MANAGEMENT
  
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [imageFile, setImageFile] = useState(null);

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

  // GET GPS LOCATION AND REVERSE GEOCODE
  
  /**
   * Get user's GPS location and convert to address using backend
   */
  const getCurrentLocation = () => {
    console.log('🔍 Getting GPS location...');
    setGettingLocation(true);
    
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      Swal.fire({
        icon: 'error',
        title: 'Not Supported',
        text: 'Your device does not support GPS location',
        confirmButtonColor: '#dc2626',
      });
      setGettingLocation(false);
      return;
    }

    // Show loading message
    Swal.fire({
      title: 'Getting Your Location...',
      html: `
        <div class="space-y-3">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-sm text-gray-600">Please wait while we locate you...</p>
          <p class="text-xs text-gray-500">This may take up to 30 seconds</p>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // GPS options
    const options = {
      enableHighAccuracy: true,   // Use GPS for best accuracy
      timeout: 30000,             // Wait up to 30 seconds
      maximumAge: 0               // Don't use cached position
    };

    // Request GPS position
    navigator.geolocation.getCurrentPosition(
      // SUCCESS - GPS position obtained
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        console.log('✅ GPS position obtained:', { lat, lng, accuracy });
        
        try {
          // Show temporary success
          Swal.fire({
            icon: 'success',
            title: 'Location Found!',
            text: 'Getting address...',
            timer: 1000,
            showConfirmButton: false,
          });
          
          console.log('🌍 Converting coordinates to address via backend...');
          
          // Call backend to convert coordinates to address
          const result = await geolocationAPI.reverseGeocode(lat, lng);
          
          console.log('✅ Address result:', result);
          
          if (result.success) {
            // Update form with location data
            setFormData({
              ...formData,
              latitude: lat.toString(),
              longitude: lng.toString(),
              location: result.address,
            });
            
            setGettingLocation(false);
            
            // Show success with address details
            Swal.fire({
              icon: 'success',
              title: 'Location Found!',
              html: `
                <div class="text-left space-y-2">
                  <p class="font-semibold text-center mb-3">${result.address}</p>
                  <div class="bg-gray-50 p-3 rounded text-sm">
                    <p><strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
                    <p><strong>Accuracy:</strong> ±${Math.round(accuracy)} meters</p>
                    ${result.details?.road ? `<p><strong>Road:</strong> ${result.details.road}</p>` : ''}
                    ${result.details?.city ? `<p><strong>City:</strong> ${result.details.city}</p>` : ''}
                  </div>
                </div>
              `,
              timer: 4000,
              showConfirmButton: false,
            });
          }
          
        } catch (error) {
          console.error('❌ Reverse geocode error:', error);
          
          // Fallback: Use coordinates as address
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
            title: 'Coordinates Saved',
            text: 'Could not get street address, but your GPS location is saved.',
            timer: 2500,
            showConfirmButton: false,
          });
        }
      },
      
      // ERROR - GPS failed
      (error) => {
        console.error('❌ GPS error:', error);
        setGettingLocation(false);
        
        let errorTitle = 'Location Error';
        let errorMessage = '';
        let instructions = '';
        
        // Provide specific error messages based on error code
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorTitle = 'Permission Denied';
            errorMessage = 'You denied location access.';
            instructions = `
              <div class="text-left text-sm space-y-2 mt-3 bg-yellow-50 p-3 rounded">
                <p class="font-semibold">How to enable location:</p>
                <ol class="list-decimal ml-4 space-y-1">
                  <li>Click the lock icon 🔒 in your browser address bar</li>
                  <li>Find "Location" permission</li>
                  <li>Change to "Allow"</li>
                  <li>Reload the page and try again</li>
                </ol>
                <p class="mt-2 text-gray-600">Or enter your location manually below.</p>
              </div>
            `;
            break;
            
          case error.POSITION_UNAVAILABLE:
            errorTitle = 'Location Unavailable';
            errorMessage = 'Cannot determine your position.';
            instructions = `
              <div class="text-left text-sm space-y-2 mt-3 bg-blue-50 p-3 rounded">
                <p class="font-semibold">Try this:</p>
                <ul class="list-disc ml-4 space-y-1">
                  <li>Turn on Location Services in your device settings</li>
                  <li>Make sure GPS is enabled</li>
                  <li>Move to an area with better signal (near window or outside)</li>
                  <li>If indoors, try going outside</li>
                </ul>
              </div>
            `;
            break;
            
          case error.TIMEOUT:
            errorTitle = 'Request Timeout';
            errorMessage = 'Location request took too long.';
            instructions = `
              <div class="text-left text-sm space-y-2 mt-3 bg-orange-50 p-3 rounded">
                <p class="font-semibold">Try this:</p>
                <ul class="list-disc ml-4 space-y-1">
                  <li>Check your GPS signal strength</li>
                  <li>Move to an open area</li>
                  <li>Wait a few seconds and try again</li>
                  <li>Or enter your location manually below</li>
                </ul>
              </div>
            `;
            break;
            
          default:
            errorMessage = 'An unexpected error occurred.';
            instructions = '<p class="text-sm mt-2">Please enter your location manually.</p>';
        }
        
        // Show error with retry option
        Swal.fire({
          icon: 'error',
          title: errorTitle,
          html: `
            <p class="mb-2">${errorMessage}</p>
            ${instructions}
            <div class="bg-gray-100 p-2 rounded text-xs mt-3">
              Error Code: ${error.code}
            </div>
          `,
          showCancelButton: true,
          confirmButtonColor: '#dc2626',
          confirmButtonText: '🔄 Try Again',
          cancelButtonText: 'Enter Manually',
          width: 600,
        }).then((result) => {
          if (result.isConfirmed) {
            // Retry after 1 second
            setTimeout(() => getCurrentLocation(), 1000);
          }
        });
      },
      
      options
    );
  };

  // FORM SUBMIT HANDLER
  
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    console.log('📤 Submitting form data:', formData);

    // Validate required fields
    if (!formData.accident_type || !formData.severity || !formData.location) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Required Fields',
        html: `
          <p class="mb-2">Please fill in the following:</p>
          <ul class="text-left text-sm">
            ${!formData.accident_type ? '<li>• Type of Accident</li>' : ''}
            ${!formData.severity ? '<li>• Severity Level</li>' : ''}
            ${!formData.location ? '<li>• Location</li>' : ''}
          </ul>
        `,
        confirmButtonColor: '#dc2626',
      });
      setLoading(false);
      return;
    }

    // Build title
    const title = formData.title || formData.accident_type;

    // Build description
    const descriptionParts = [];
    if (formData.description) descriptionParts.push(formData.description);
    if (formData.vehicles_involved) descriptionParts.push(`Vehicles involved: ${formData.vehicles_involved}`);
    if (formData.injuries) descriptionParts.push(`Injuries: ${formData.injuries}`);
    if (formData.hazards) descriptionParts.push(`Hazards: ${formData.hazards}`);
    const description = descriptionParts.join('\n');

    // ✅ Step 1: Upload image to backend if a file was selected
    let uploadedImageUrl = null;

    if (imageFile) {
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);  // must match upload.single('image')

      const uploadRes = await alertsAPI.uploadImage(imageFormData);
      uploadedImageUrl = uploadRes.url;
    }

    // ✅ Step 2: Build cleaned data with the returned image URL
    const cleanedData = {
      alert_type: 'accident',
      severity: formData.severity,
      title: title.trim(),
      description: description || null,
      location: formData.location.trim(),
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      image_url: uploadedImageUrl,
    };

    console.log('📤 Sending to API:', cleanedData);

    // ✅ Step 3: Submit alert to API
    const result = await alertsAPI.create(cleanedData);

    console.log('✅ Report submitted successfully:', result);

    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Accident Reported!',
      html: `
        <div class="text-center">
          <p class="text-lg font-semibold mb-3">🚨 Emergency services have been notified</p>
          
          <div class="bg-gray-50 p-4 rounded-lg mt-4 text-left space-y-2">
            <p class="text-sm"><strong>Report ID:</strong> #${result.id}</p>
            <p class="text-sm"><strong>Status:</strong> <span class="text-yellow-600 font-semibold">Pending Response</span></p>
            <p class="text-sm"><strong>Severity:</strong> <span class="uppercase">${formData.severity}</span></p>
            <p class="text-sm"><strong>Location:</strong> ${formData.location}</p>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p class="text-sm text-blue-900">
              📍 An ambulance and rescue team will be dispatched to your location shortly.
            </p>
          </div>
          
          <p class="text-base font-semibold text-red-600 mt-4">
            🚑 Help is on the way!
          </p>
        </div>
      `,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'OK',
      width: 600,
    });

    // ✅ Reset form and image file
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
    });
    setImageFile(null);

  } catch (error) {
    console.error('❌ Submit error:', error);
    console.error('Error details:', error.response?.data);

    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      html: `
        <p class="mb-2">Could not submit your report. Please try again.</p>
        <div class="bg-red-50 p-3 rounded text-sm text-left mt-3">
          <p><strong>Error:</strong> ${error?.response?.data?.message || error?.message || 'Unknown error'}</p>
        </div>
      `,
      confirmButtonColor: '#dc2626',
    });
  } finally {
    setLoading(false);
  }
};

  // RENDER FORM
  
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
                          <div className="font-medium">Low</div>
                          <div className="text-xs text-gray-500">Property damage only, no injuries</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟡</span>
                        <div>
                          <div className="font-medium">Medium</div>
                          <div className="text-xs text-gray-500">Minor injuries, medical attention needed</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟠</span>
                        <div>
                          <div className="font-medium">High</div>
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
                
                {/* Single GPS button */}
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

              {/* Address input */}
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

              {/* Coordinates */}
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

            {/* Image Upload */}
<div className="space-y-2">
  <Label>Photo (Optional)</Label>
  <Input
    type="file"
    accept="image/*"
    className="focus:ring-2 focus:ring-red-500 focus:outline-none"
    onChange={(e) => setImageFile(e.target.files[0] || null)}
    disabled={loading}
  />
  {imageFile && (
    <p className="text-xs text-gray-500">Selected: {imageFile.name}</p>
  )}
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

            {/* Emergency Warning */}
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
