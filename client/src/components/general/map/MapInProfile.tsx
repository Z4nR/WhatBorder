import { MapInProfileProps } from '@/utils/types/profile.types';
import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

const MapInProfile: React.FC<MapInProfileProps> = ({
  place_id,
  place_center_point,
  place_map,
  color,
}) => {
  return (
    <MapContainer center={place_center_point} zoom={20} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {place_map && (
        <GeoJSON
          key={`detil-map-${place_id}`}
          data={place_map?.place_geojson}
          style={{ color: color }}
        />
      )}
    </MapContainer>
  );
};

export default MapInProfile;
