import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { Descriptions, Flex, Skeleton, Typography } from 'antd';
import type { DescriptionsProps } from 'antd';
import { placeDetail } from '@/utils/networks';
import { dateFormatter } from '@/utils/helper';
import MapDetail from '@/components/map/MapDetail';

const { Title } = Typography;

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

  let position = null;
  if (data) {
    const coordinates =
      data?.placeMap.place_geojson.features[0].properties.coordinates;
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
        <MapDetail data={data} placeMap={placeMap} position={position} />
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
