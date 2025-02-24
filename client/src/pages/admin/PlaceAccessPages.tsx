import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Typography } from 'antd';
import AdminPlaceList from '@/components/general/admin/place-action/AdminPlaceList';

const { Title } = Typography;

const PlaceAccessPages: React.FC = () => {
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
            title: 'Info Tempat',
          },
        ]}
      />
      <div>
        <Title level={5} style={{ marginTop: '8px' }}>
          Pengaturan Data Tempat
        </Title>
        <AdminPlaceList />
      </div>
    </>
  );
};

export default PlaceAccessPages;
