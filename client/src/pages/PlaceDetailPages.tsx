import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useMemo } from 'react';
import {
  Breadcrumb,
  Button,
  Descriptions,
  Flex,
  Skeleton,
  Tag,
  Typography,
} from 'antd';
import type { DescriptionsProps } from 'antd';
import { placeDetail } from '@/utils/networks';
import { dateFormatter } from '@/utils/helper';
import MapDetail from '@/components/general/map/MapDetail';

const { Title } = Typography;

const PlaceDetailPages: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending, isLoading } = useQuery({
    queryKey: ['place', id],
    queryFn: async () => await placeDetail(id),
  });

  const placeMap = useMemo(() => {
    if (isPending) return null;
    return data?.placeMap.place_geojson;
  }, [data, isPending]);

  let position = null;
  if (data) {
    const coordinates = data?.placeCenterPoint;
    if (coordinates && coordinates.length === 2) {
      position = coordinates;
    }
  }

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Terakhir Diperbarui',
      children: dateFormatter(data?.updatedAt),
    },
    {
      key: '2',
      label: 'Dibuat Oleh',
      children: <b>{data?.createdBy}</b>,
    },
    {
      key: '3',
      label: 'Alamat Tempat',
      children: data?.placeAddress,
    },
    {
      key: '4',
      label: 'Pemilik Tempat',
      children: data?.placeOwner ? data?.placeOwner : 'Pemilik Tidak Diketahui',
    },
    {
      key: '5',
      label: 'Keterangan',
      children: data?.placeDescription
        ? data?.placeDescription
        : 'Belum Ada Keterangan',
    },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          {
            onClick: () => navigate('/statistic'),
            title: (
              <Button type="link" className="home-breadcrumb">
                Kembali
              </Button>
            ),
          },
          {
            title: 'Rincian Tempat',
          },
        ]}
      />
      <Skeleton loading={isLoading} active title paragraph={{ rows: 1 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '0' }}>
          {data?.placeName}
        </Title>
        <Flex justify="center" align="center">
          <Tag style={{ margin: '0' }} color={data?.type.label}>
            {data?.type.name.toUpperCase()}
          </Tag>
        </Flex>
      </Skeleton>
      <Flex gap={'middle'} vertical={false} style={{ marginTop: '2rem' }} wrap>
        <MapDetail data={data} placeMap={placeMap} position={position} />
        <Skeleton loading={isLoading} style={{ width: '100%' }} active>
          <Descriptions
            style={{ width: '100%' }}
            column={1}
            bordered
            items={items}
          />
        </Skeleton>
      </Flex>
    </>
  );
};

export default PlaceDetailPages;
