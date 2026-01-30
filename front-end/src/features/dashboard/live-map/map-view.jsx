import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { Badge } from '@/components/ui/badge';
import MapController from './map-controller';

// Fix Leaflet default marker icon
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const createCustomIcon = (severity) => {
  const colors = {
    Critical: '#dc2626',
    High: '#ea580c',
    Medium: '#ca8a04',
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${colors[severity]};
        width: 35px;
        height: 35px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 18px;
      ">⚠</div>
    `,
    iconSize: [35, 35],
    iconAnchor: [17.5, 17.5],
  });
};

const parseCoordinates = (location) => {
  const matches = location.match(/([0-9.]+)° N, ([0-9.]+)° E/);
  if (matches) {
    return [parseFloat(matches[1]), parseFloat(matches[2])];
  }
  return [14.1154, 122.9554];
};

export default function MapView({ alerts, selectedAlert, onAlertSelect }) {
  const defaultCenter = [14.1154, 122.9554];
  const camNorteBounds = [
    [13.95, 122.40],
    [14.45, 123.10],
  ];

  const mapCenter = selectedAlert
    ? parseCoordinates(selectedAlert.location)
    : defaultCenter;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={10}
      minZoom={10}
      maxZoom={18}
      maxBounds={camNorteBounds}
      maxBoundsViscosity={1.0}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Street Map">
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer checked name="Satellite">
          <TileLayer
            attribution='&copy; Google'
            url="http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Hybrid">
          <TileLayer
            attribution='&copy; Google'
            url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Terrain">
          <TileLayer
            attribution='&copy; Google'
            url="http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {alerts.map((alert) => {
        const position = parseCoordinates(alert.location);
        return (
          <Marker
            key={alert.id}
            position={position}
            icon={createCustomIcon(alert.severity)}
            eventHandlers={{
              click: () => onAlertSelect(alert),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{alert.id}</span>
                  <Badge
                    className={
                      alert.severity === 'Critical'
                        ? 'bg-red-100 text-red-700'
                        : alert.severity === 'High'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm font-semibold">{alert.user}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {alert.type}
                </p>
                <p className="text-xs text-muted-foreground">
                  {alert.timestamp}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}

      <MapController center={selectedAlert ? mapCenter : null} />
    </MapContainer>
  );
}
