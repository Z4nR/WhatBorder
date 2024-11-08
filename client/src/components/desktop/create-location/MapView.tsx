import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { FeatureCollection } from 'geojson';
import geojsonTemplate from '@/utils/geojson.template';
import { useEffect } from 'react';
import { Typography } from 'antd';
import { MapViewProps } from '@/utils/types/map.types';

const { Text } = Typography;

const MapView: React.FC<MapViewProps> = ({
  centerPoint,
  mapData,
  setGeojsonFormat,
}) => {
  const geoJsonData: FeatureCollection = geojsonTemplate(mapData);
  console.log(geoJsonData);

  useEffect(() => {
    setGeojsonFormat(geoJsonData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Text>Tampilan Batas Tempat Pada Peta</Text>
      <MapContainer center={centerPoint} zoom={17} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapData && (
          <GeoJSON
            key={`map-data-${new Date().getMilliseconds()}`}
            data={geoJsonData}
          />
        )}
      </MapContainer>
    </>
  );
};

export default MapView;
