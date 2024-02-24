import { placeDetail } from '../utils/networks';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useEffect, useMemo } from 'react';
import { Descriptions, Flex, Skeleton, Typography } from 'antd';
import type { DescriptionsProps } from 'antd';
import { dateFormatter } from '../utils/helper';

const { Title } = Typography;

interface FlyMapToProps {
  position: [number, number] | null;
}

const FlyMapTo: React.FC<FlyMapToProps> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    console.log('Position:', position); // Log position to debug
    if (position && position.length === 2) {
      map.flyTo(position);
    }
  }, [position, map]);

  return null;
};

const PlaceDetail: React.FC = () => {
  const { id } = useParams();

  const { data, isPending, isLoading } = useQuery({
    queryKey: ['place', id],
    queryFn: async () => await placeDetail(id),
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const placeMap = useMemo(() => {
    if (isPending) return null;
    return data?.placeMap.place_geojson;
  }, [data, isPending]);

  console.log(data);

  let position = null;
  if (data) {
    const coordinates =
      data?.placeMap.place_geojson.features[0].properties.coordinates.reverse();
    console.log('Coordinates:', coordinates);
    if (coordinates && coordinates.length === 2) {
      position = coordinates;
    }
  }

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Terakhir Diperbarui',
      children: `${dateFormatter(data?.updateAt)}`,
    },
    {
      key: '2',
      label: 'Dibuat Oleh',
      children: <b>{data?.createdBy}</b>,
    },
    {
      key: '3',
      label: 'Alamat Tempat',
      children: `${data?.placeAddress}`,
    },
    {
      key: '4',
      label: 'Pemilik Tempat',
      children: `${
        data?.placeOwner ? data?.placeOwner : 'Pemilik Tidak Diketahui'
      }`,
    },
    {
      key: '5',
      label: 'Keterangan',
      children: `${
        data?.placeDescription ? data?.placeDescription : 'Belum Ada Keterangan'
      }`,
    },
  ];

  return (
    <>
      <Skeleton loading={isLoading} active title paragraph={{ rows: 0 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '0' }}>
          {data?.placeName}
        </Title>
      </Skeleton>
      <Flex gap={'middle'} vertical={false} style={{ marginTop: '2rem' }}>
        <MapContainer
          center={[-1.2480891, 118]}
          zoom={17}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {data && data?.placeMap && <FlyMapTo position={position} />}
          {placeMap && (
            <GeoJSON
              key={`detil-map-${data?.placeId}`}
              data={placeMap}
              style={{ fillColor: '#11648e' }}
            />
          )}
        </MapContainer>
        <Skeleton loading={isLoading} style={{ width: '50%' }} active>
          <Descriptions
            style={{ width: '50%' }}
            column={1}
            bordered
            items={items}
          />
        </Skeleton>
      </Flex>
    </>
  );
};

export default PlaceDetail;
