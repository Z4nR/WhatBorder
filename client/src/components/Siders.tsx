import { Link } from 'react-router-dom';
import {
  AppstoreOutlined,
  BlockOutlined,
  FundViewOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

const Siders: React.FC = () => {
  const menuItems = [
    {
      key: '1',
      icon: <AppstoreOutlined />,
      label: <Link to={'/'}>Beranda Anda</Link>,
    },
    {
      key: '2',
      icon: <FundViewOutlined />,
      label: <Link to={'/place-list'}>Statistik Data</Link>,
    },
    {
      key: '3',
      icon: <BlockOutlined />,
      label: <Link to={'/compare-map'}>Bandingkan Tempat</Link>,
    },
  ];

  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
        }))}
      />
    </Sider>
  );
};

export default Siders;
