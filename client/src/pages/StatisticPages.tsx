import { Layout, Tabs } from 'antd';
import PlaceList from '../components/statistic/PlaceList';
import UserList from '../components/statistic/UserList';

const StatisticPages: React.FC = () => {
  const menuItems = [
    {
      key: '1',
      children: <PlaceList />,
      label: 'Place List',
    },
    {
      key: '2',
      children: <UserList />,
      label: 'User List',
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
        centered
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
