import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { AlertTriangle, Car } from 'lucide-react';

export const MAP_CENTER = [14.139, 122.763];
export const DEFAULT_ZOOM = 11;
export const MARKER_ZOOM = 18;

export const TILE_STYLES = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri'
  }
};

export const createAccidentIcon = (source, severity) => {
  // Crash icon — always red with a car icon
  if (source === 'crash') {
    const iconMarkup = renderToStaticMarkup(
      <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
        <Car size={24} strokeWidth={2.5} />
      </div>
    );
    return divIcon({
      html: iconMarkup,
      className: '',
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24]
    });
  }

  // Alert icon — color based on severity
  const severityStyles = {
    critical: { bg: 'bg-red-600',    text: 'text-white' },
    high:     { bg: 'bg-orange-500', text: 'text-white' },
    medium:   { bg: 'bg-yellow-500', text: 'text-white' },
    low:      { bg: 'bg-blue-500',   text: 'text-white' },
  };

  const style = severityStyles[severity] || severityStyles.medium;

  const iconMarkup = renderToStaticMarkup(
    <div className={`${style.bg} ${style.text} w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-xl`}>
      <AlertTriangle size={24} strokeWidth={2.5} />
    </div>
  );

  return divIcon({
    html: iconMarkup,
    className: '',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24]
  });
};
