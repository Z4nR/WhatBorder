import { PreviewMapProps } from '@/utils/types/map.types';
import { Card } from 'antd';
import React from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';

const MapPositionPreview: React.FC<PreviewMapProps> = ({
  position,
  setPosition,
  setLat,
  setLong,
}) => {
  const MapEventHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        setLat(lat);
        setLong(lng);
      },
    });
    return null;
  };

  const FlyToPosition = () => {
    const map = useMap();
    if (position) {
      map.flyTo(position, 17);
    }
    return null;
  };

  return (
    <Card>
      <MapContainer
        center={position || [-1.2480891, 118]}
        zoom={4}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <>
            <Marker position={position} />
            <FlyToPosition />{' '}
          </>
        )}
        <MapEventHandler />
      </MapContainer>
    </Card>
  );
};

export default MapPositionPreview;
