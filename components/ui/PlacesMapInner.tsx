'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons broken by webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Place {
  id: string;
  nameEn: string;
  nameFa: string;
  descriptionEn: string;
  descriptionFa: string;
  lat: number | null;
  lng: number | null;
  imageUrls: string[];
}

interface Props {
  places: Place[];
  selected: Place | null;
  onSelect: (p: Place) => void;
  locale: string;
}

function FlyTo({ place }: { place: Place | null }) {
  const map = useMap();
  useEffect(() => {
    if (place?.lat && place?.lng) {
      map.flyTo([place.lat, place.lng], 15, { duration: 1 });
    }
  }, [place, map]);
  return null;
}

export default function PlacesMapInner({ places, selected, onSelect, locale }: Props) {
  const isFa = locale === 'fa';
  const validPlaces = places.filter((p) => p.lat && p.lng);
  const center: [number, number] = validPlaces.length > 0
    ? [validPlaces[0].lat!, validPlaces[0].lng!]
    : [32.0, 53.0]; // default: central Iran

  return (
    <MapContainer center={center} zoom={13} style={{ width: '100%', height: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo place={selected} />
      {validPlaces.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat!, place.lng!]}
          eventHandlers={{ click: () => onSelect(place) }}
        >
          <Popup>
            <strong>{isFa ? place.nameFa : place.nameEn}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
