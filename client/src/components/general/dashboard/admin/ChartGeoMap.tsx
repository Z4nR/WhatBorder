import React, { useEffect, useState } from 'react';
import {
  DashboardAdminChartProps,
  DashboardAdminMapProps,
} from '@/utils/types/admin.types';
import { Skeleton } from 'antd';
import {
  CircleMarker,
  MapContainer,
  ScaleControl,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';

const groupByLocation = (data: DashboardAdminMapProps[]) => {
  const groupedMap = new Map<
    string,
    { item: DashboardAdminMapProps; count: number }
  >();

  data.forEach((item) => {
    const key = `${item.place_center_long},${item.place_center_lat}`; // Unique key for location

    if (!groupedMap.has(key)) {
      groupedMap.set(key, { item, count: 1 });
    } else {
      groupedMap.get(key)!.count += 1;
    }
  });

  return Array.from(groupedMap.values()); // Convert back to an array
};

const CircleMarkerMap: React.FC<{
  item: DashboardAdminMapProps;
  count: number;
}> = ({ item, count }) => {
  const map = useMap();
  const [radius, setRadius] = useState(20); // Default radius

  useEffect(() => {
    const updateRadius = () => {
      const zoom = map.getZoom();
      let newRadius = 50 / zoom; // Adjust dynamically

      // Scale based on count
      newRadius *= Math.log(count + 1); // Increase with count

      // Clamp between min and max values
      newRadius = Math.max(20, Math.min(50, newRadius));

      setRadius(newRadius);
    };

    map.on('zoomend', updateRadius);
    updateRadius(); // Initial set

    return () => {
      map.off('zoomend', updateRadius);
    };
  }, [map, count]);

  // Scale font size dynamically based on radius
  const fontSize = Math.max(10, radius * 0.8); // Ensures readability

  return (
    <CircleMarker
      center={[item.place_center_long, item.place_center_lat]}
      radius={radius}
      pathOptions={{
        fillOpacity: 1,
        fillColor: 'red',
        color: 'black',
        weight: 1,
      }}
    >
      <Tooltip
        permanent
        direction="center"
        offset={[0, 0]}
        className="custom-tooltip"
      >
        <span
          style={{
            fontSize: `${fontSize}px`, // Dynamic font size
            fontWeight: 'bold',
          }}
        >
          {count}
        </span>
      </Tooltip>
    </CircleMarker>
  );
};

const ChartGeoMap: React.FC<DashboardAdminChartProps> = ({ data, loading }) => {
  const groupedData = groupByLocation(data?.chartArea || []);

  return (
    <Skeleton style={{ marginTop: '1rem' }} loading={loading} active>
      <MapContainer center={[-1.2480891, 118]} zoom={5} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {groupedData.map(({ item, count }, index) => (
          <CircleMarkerMap key={index} item={item} count={count} />
        ))}
        <ScaleControl position="bottomleft" />
      </MapContainer>
    </Skeleton>
  );
};

export default ChartGeoMap;
