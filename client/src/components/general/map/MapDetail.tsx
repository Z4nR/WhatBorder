import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import FlyMapTo from './FlyMapTo';
import React from 'react';

interface MapDetailProps {
  data: {
    placeMap: any;
    placeId: string;
    type: {
      color: string;
    };
  };
  placeMap: any;
  position: any;
}

const MapDetail: React.FC<MapDetailProps> = ({ data, placeMap, position }) => {
  return (
    <MapContainer center={[-1.2480891, 118]} zoom={17} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data && data?.placeMap && <FlyMapTo position={position} />}
      {placeMap && (
        <GeoJSON
          key={`detil-map-${data?.placeId}`}
          data={placeMap}
          style={{ color: data.type.color }}
        />
      )}
    </MapContainer>
  );
};

export default MapDetail;
