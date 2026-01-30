import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapController({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 14);
    }
  }, [center, map]);

  return null;
}
