import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Col, Row, Typography } from 'antd';
import PlaceTypeList from '@/components/general/admin/place-type/PlaceTypeList';
import PlaceTypeForm from '@/components/general/admin/place-type/PlaceTypeForm';

const { Title } = Typography;

const PlaceTypePages: React.FC = () => {
  const navigate = useNavigate();
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
          <PlaceTypeForm />
        </Col>
        <Col xs={24} md={12}>
          <PlaceTypeList />
        </Col>
      </Row>
    </>
  );
};

export default PlaceTypePages;
