import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Layers } from 'lucide-react';
import L from 'leaflet';
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


function HeatmapLayer({ incidents, visible }) {
  const map = useMap();

  useEffect(() => {
    if (!visible || !map) return;

    // Clear previous heatmap circles
    map.eachLayer(layer => {
      if (layer._heatmap) map.removeLayer(layer);
    });

    // Count incidents per ~100m grid cell
    const gridSize = 0.001;
    const densityMap = {};

    incidents.forEach(i => {
      if (!i.latitude || !i.longitude) return;
      const lat = Math.floor(i.latitude / gridSize) * gridSize;
      const lng = Math.floor(i.longitude / gridSize) * gridSize;
      const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
      densityMap[key] = (densityMap[key] || 0) + 1;
    });

    Object.entries(densityMap).forEach(([key, count]) => {
      const [lat, lng] = key.split(',').map(parseFloat);

      let radius, color, opacity;
      if (count >= 5) {
        radius = 300; color = '#ff0000'; opacity = 0.6;
      } else if (count >= 3) {
        radius = 200; color = '#ff8800'; opacity = 0.5;
      } else if (count >= 2) {
        radius = 150; color = '#ffff00'; opacity = 0.4;
      } else {
        radius = 80; color = '#00ff88'; opacity = 0.3;
      }

      const circle = L.circle([lat + gridSize / 2, lng + gridSize / 2], {
        radius,
        fillColor: color,
        fillOpacity: opacity,
        color,
        weight: 2,
        opacity: 0.8,
        interactive: true,
      }).addTo(map);

      circle._heatmap = true;
      circle.bindPopup(`${count} incident${count > 1 ? 's' : ''} in 100m`);
    });

    return () => {
      map.eachLayer(layer => layer._heatmap && map.removeLayer(layer));
    };
  }, [incidents, visible, map]);

  return null;
}


function AccidentMap({ alerts = [], filters = {}, selectedAlert = null, onMarkerClick, showHeatmap = false }) {
  const [mapStyle, setMapStyle] = useState('street');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [heatmapVisible, setHeatmapVisible] = useState(showHeatmap);

  // Filter out resolved/cancelled and incidents without coordinates
  const activeIncidents = alerts.filter(i =>
    i.status !== 'resolved' &&
    i.status !== 'cancelled' &&
    i.latitude &&
    i.longitude
  );

  const filteredIncidents = alerts.filter(i => {
    if (!i.latitude || !i.longitude) return false;
    if (!filters.status || filters.status === 'all') return true;
    if (i.status?.toLowerCase() !== filters.status.toLowerCase()) return false;
    const incidentDate = new Date(i.timestamp || i.data?.timestamp);
    return incidentDate >= new Date(filters.from || '2000-01-01');
  });

  // Use filtered when filters are active, otherwise fall back to active
  const markerIncidents = filteredIncidents.length > 0 ? filteredIncidents : activeIncidents;
  const heatmapIncidents = filteredIncidents.length > 0 ? filteredIncidents : activeIncidents;

  return (
    <div className="w-full h-full relative">
      {/* Layer Controls */}
      <div className="absolute top-3 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
          className="bg-white w-8 h-8 rounded border-2 border-gray-400 shadow-md hover:bg-gray-50 flex items-center justify-center"
          title="Layers"
        >
          <Layers size={18} className="text-gray-700" />
        </button>

        <button
          onClick={() => setHeatmapVisible(!heatmapVisible)}
          className={`w-8 h-8 rounded border-2 shadow-md flex items-center justify-center transition-all ${
            heatmapVisible
              ? 'bg-gradient-to-br from-red-500 to-orange-500 border-red-400 shadow-red-300 text-white'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
          title="Toggle Heatmap"
        >
          {heatmapVisible ? '🔥' : '🌡️'}
        </button>

        {isLayerMenuOpen && (
          <div className="absolute top-20 right-0 bg-white rounded border-2 border-gray-400 shadow-lg p-3 min-w-[150px]">
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

        <HeatmapLayer incidents={heatmapIncidents} visible={heatmapVisible} />

        {markerIncidents.map((incident) => (
          <MarkerWithClick
            key={`${incident.type}-${incident.id}`}
            position={[incident.latitude, incident.longitude]}
            icon={createAccidentIcon(incident.type, incident.data?.severity)}
            onClick={() => onMarkerClick(incident)}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default AccidentMap;
