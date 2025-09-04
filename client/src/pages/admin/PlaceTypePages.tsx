import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Row, Tabs, Typography } from 'antd';
import PlaceTypeList from '@/components/general/admin/place-type/PlaceTypeList';
import PlaceTypeCreate from '@/components/general/admin/place-type/form/PlaceTypeCreate';
import PlaceTypeUpdate from '@/components/general/admin/place-type/form/PlaceTypeUpdate';
import { useQuery } from '@tanstack/react-query';
import { buildingFilter } from '@/utils/networks';

const { Title } = Typography;

const PlaceTypePages: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['building-list'],
    queryFn: async () => await buildingFilter(),
    staleTime: 0,
  });

  const menuItems = [
    {
      key: '1',
      children: <PlaceTypeCreate />,
      label: 'Tambah Jenis Tempat',
    },
    {
      key: '2',
      children: <PlaceTypeUpdate data={data ?? []} />,
      label: 'Ubah Jenis Tempat',
    },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          {
            onClick: () => {
              navigate(-1);
            },
            title: (
              <Button type="link" className="home-breadcrumb">
                Kembali
              </Button>
            ),
          },
          {
            title: 'Info Jenis Tempat',
          },
        ]}
      />
      <div>
        <Title level={5} style={{ marginTop: '8px' }}>
          Pengaturan Jenis Tempat
        </Title>
      </div>
      <Row gutter={[16, 16]} wrap>
        <Col xs={24} md={12}>
          <Card>
            <Tabs
              defaultActiveKey="1"
              items={menuItems.map((item) => ({
                key: item.key,
                children: item.children,
                label: item.label,
              }))}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <PlaceTypeList data={data ?? []} isLoading={isLoading} />
        </Col>
      </Row>
    </>
  );
};

export default PlaceTypePages;
