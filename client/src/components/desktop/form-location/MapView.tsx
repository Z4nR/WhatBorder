import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Typography } from 'antd';
import { MapViewProps } from '@/utils/types/map.types';

const { Text } = Typography;

const MapView: React.FC<MapViewProps> = ({ centerPoint, mapData }) => {
  return (
    <>
      <Text>Tampilan Batas Tempat Pada Peta</Text>
      <MapContainer center={centerPoint} zoom={17} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapData && (
          <GeoJSON
            key={`map-data-${new Date().getMilliseconds()}`}
            data={mapData}
          />
        )}
      </MapContainer>
    </>
  );
};

export default MapView;
