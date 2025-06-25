import React from 'react';
import { MapInTableProps } from '@/utils/types/map.types';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

const MapInProfile: React.FC<MapInTableProps> = ({
  placeId,
  placeCenterPoint,
  placeMap,
  color,
}) => {
  return (
    <MapContainer center={placeCenterPoint} zoom={20} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {placeMap && (
        <GeoJSON
          key={`detil-map-${placeId}`}
          data={placeMap?.placeGeojson}
          style={{ color: color }}
        />
      )}
    </MapContainer>
  );
};

export default MapInProfile;
