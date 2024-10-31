import { Card } from 'antd';
import React from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';

interface PreviewData {
  setLat: (value: React.SetStateAction<number>) => void;
  setLong: (value: React.SetStateAction<number>) => void;
  setPosition: (value: React.SetStateAction<[number, number] | null>) => void;
  position: any;
}

const MapPositionPreview: React.FC<PreviewData> = ({
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
        console.log(`Map clicked at Latitude: ${lat}, Longitude: ${lng}`);
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
