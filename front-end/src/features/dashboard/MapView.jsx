import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LeafletMap() {
  const center = [14.1200, 122.9500];
  
  // Province boundaries
  const bounds = [
    [13.7833, 122.5833],  // Southwest
    [14.6167, 123.0000]   // Northeast
  ];

  return (
    <MapContainer 
      center={center} 
      zoom={15}
      minZoom={11}              // Minimum zoom (can't zoom out more)
      maxZoom={18}              // Maximum zoom (can't zoom in more)
      maxBounds={bounds}        // Can't pan outside these bounds
      maxBoundsViscosity={1.0}  // How sticky the bounds are
      scrollWheelZoom={true}    // Allow scroll wheel zoom
      className="w-full h-full rounded-lg"
    >
      <LayersControl position="topright">
        {/* Street Map */}
        <LayersControl.BaseLayer checked name="Street Map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
        </LayersControl.BaseLayer>

        {/* Satellite View */}
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri &mdash; Source: Esri, DigitalGlobe, GeoEye'
          />
        </LayersControl.BaseLayer>

        {/* Terrain */}
        <LayersControl.BaseLayer name="Terrain">
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors, Tiles style by Humanitarian OSM Team'
          />
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  );
}

export default LeafletMap;
