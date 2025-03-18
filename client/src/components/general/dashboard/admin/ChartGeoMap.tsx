import React from 'react';
import { DashboardAdminChartProps } from '@/utils/types/admin.types';
import { Skeleton } from 'antd';
import {
  MapContainer,
  Marker,
  ScaleControl,
  TileLayer,
  Tooltip,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

const ChartGeoMap: React.FC<DashboardAdminChartProps> = ({ data, loading }) => {
  return (
    <Skeleton style={{ marginTop: '1rem' }} loading={loading} active>
      <MapContainer center={[-1.2480891, 118]} zoom={5} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup chuckedLoading>
          {data?.chartArea.map((item, index) => (
            <Marker
              key={index}
              position={[item.place_center_long, item.place_center_lat]}
            >
              <Tooltip>{item.place_name}</Tooltip>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <ScaleControl position="bottomleft" />
      </MapContainer>
    </Skeleton>
  );
};

export default ChartGeoMap;
