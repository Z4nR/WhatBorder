import PlaceList from '@/components/statistic/PlaceList';
import UserList from '@/components/statistic/UserList';
import { Layout, Tabs } from 'antd';

const StatisticPages: React.FC = () => {
  const menuItems = [
    {
      key: '1',
      children: <PlaceList />,
      label: 'Daftar Tempat',
    },
    {
      key: '2',
      children: <UserList />,
      label: 'Daftar Pengguna',
    },
  ];

  return (
    <Layout
      style={{
        minHeight: '100vh',
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
