import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { MAP_CENTER, DEFAULT_ZOOM, MARKER_ZOOM, TILE_STYLES, createAccidentIcon } from './mapConfig.jsx';
import MapLegend from './map-legend.jsx';

function MapController({ selectedAlert }) {
  const map = useMap();

  useEffect(() => {
    if (selectedAlert?.latitude && selectedAlert?.longitude) {
      map.setView(
        [selectedAlert.latitude, selectedAlert.longitude],
        MARKER_ZOOM,
        { animate: true, duration: 1 }
      );
    }
  }, [selectedAlert, map]);

  return null;
}

function MarkerWithClick({ position, icon, onClick }) {
  const map = useMap();

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: () => {
          map.setView(position, MARKER_ZOOM, { animate: true, duration: 1 });
          onClick();
        }
      }}
    />
  );
}

function AccidentMap({ alerts = [], selectedAlert = null, onMarkerClick }) {
  const [mapStyle, setMapStyle] = useState('street');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Filter out resolved/cancelled and incidents without coordinates
  const activeIncidents = alerts.filter(i =>
    i.status !== 'resolved' &&
    i.status !== 'cancelled' &&
    i.latitude &&
    i.longitude
  );

  return (
    <div className="w-full h-full relative">
      {/* Layer Control */}
      <div className="absolute top-3 right-4 z-[1000]">
        <button
          onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
          className="bg-white w-8 h-8 rounded border-2 border-gray-400 shadow-md hover:bg-gray-50 flex items-center justify-center"
          title="Layers"
        >
          <Layers size={18} className="text-gray-700" />
        </button>

        {isLayerMenuOpen && (
          <div className="absolute top-10 right-0 bg-white rounded border-2 border-gray-400 shadow-lg p-3 min-w-[150px]">
            <div className="text-xs font-semibold text-gray-700 mb-2">Base Layers</div>
            <label className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio" name="mapStyle"
                checked={mapStyle === 'street'}
                onChange={() => setMapStyle('street')}
                className="cursor-pointer"
              />
              <span className="text-sm">Street</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio" name="mapStyle"
                checked={mapStyle === 'satellite'}
                onChange={() => setMapStyle('satellite')}
                className="cursor-pointer"
              />
              <span className="text-sm">Satellite</span>
            </label>
          </div>
        )}
      </div>

      <MapLegend />

      <MapContainer
        center={MAP_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full z-0"
      >
        <MapController selectedAlert={selectedAlert} />

        <TileLayer
          key={mapStyle}
          attribution={TILE_STYLES[mapStyle].attribution}
          url={TILE_STYLES[mapStyle].url}
        />

        {activeIncidents.map((incident) => (
          <MarkerWithClick
            key={`${incident.source}-${incident.id}`}
            position={[incident.latitude, incident.longitude]}
            icon={createAccidentIcon(incident.source, incident.data?.severity)}
            onClick={() => onMarkerClick(incident)}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default AccidentMap;
