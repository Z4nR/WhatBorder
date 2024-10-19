import { MapContainer, TileLayer } from 'react-leaflet';

const MapView: React.FC = () => {
  return (
    <MapContainer center={[-1.2480891, 118]} zoom={4} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default MapView;
