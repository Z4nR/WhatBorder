import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const ChartGeoMap: React.FC = () => {
  return (
    <MapContainer center={[-1.2480891, 118]} zoom={5} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default ChartGeoMap;
