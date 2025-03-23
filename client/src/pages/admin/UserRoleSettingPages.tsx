import React from 'react';
import { Breadcrumb, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import UserRoleList from '@/components/general/admin/user-action/UserRoleList';

const { Title } = Typography;

const UserRoleSettingPages: React.FC = () => {
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
        <UserRoleList />
      </div>
    </>
  );
};

export default UserRoleSettingPages;
