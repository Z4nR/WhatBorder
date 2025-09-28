import React from 'react';
import { Breadcrumb, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import UserActiveList from '@/components/general/admin/user-action/UserActiveList';

const { Title } = Typography;

const UserActiveStatusSettingPages: React.FC = () => {
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
            title: 'Info Pengguna',
          },
        ]}
      />
      <div>
        <Title level={5} style={{ marginTop: '8px' }}>
          Pengaturan Data Pengguna
        </Title>
        <UserActiveList />
      </div>
    </>
  );
};

export default UserActiveStatusSettingPages;
