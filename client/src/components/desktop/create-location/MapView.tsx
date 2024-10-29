import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

interface CreateMapView {
  centerPoint: [number, number];
  mapData: any;
}

const MapView: React.FC<CreateMapView> = ({ centerPoint, mapData }) => {
  return (
    <MapContainer
      center={centerPoint ? centerPoint : [-1.2480891, 118]}
      zoom={4}
      scrollWheelZoom={true}
    >
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
  );
};

export default MapView;
