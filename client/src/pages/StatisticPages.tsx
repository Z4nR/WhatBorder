import AdminList from '@/components/general/statistic/AdminList';
import PlaceList from '@/components/general/statistic/PlaceList';
import UserList from '@/components/general/statistic/UserList';
import useUserState from '@/utils/state/userState';
import { Layout, Tabs } from 'antd';
import React from 'react';

const StatisticPages: React.FC = () => {
  const role = useUserState().role;

  const menuItems = [
    {
      key: '1',
      children: <PlaceList />,
      label: 'Daftar Tempat',
    },
    {
      key: '2',
      children: role === 3 ? <UserList /> : <AdminList />,
      label: 'Daftar Pengguna',
    },
  ];

  return (
    <Layout
      style={{
        backgroundColor: 'transparent',
      }}
    >
      <Tabs
        defaultActiveKey="1"
        items={menuItems.map((item) => ({
          key: item.key,
          children: item.children,
          label: item.label,
        }))}
      />
    </Layout>
  );
};

export default StatisticPages;
