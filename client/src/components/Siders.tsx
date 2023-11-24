import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppstoreOutlined,
  BlockOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { Avatar, Flex, Layout, Menu } from 'antd';
import logoWeb from '../assets/react.svg';

const { Sider } = Layout;

interface SidersProps {
  collapse: boolean;
}

const Siders: React.FC<SidersProps> = ({ collapse }) => {
  const menuItems = [
    {
      key: '1',
      icon: <AppstoreOutlined />,
      label: <Link to={'/'}>Dashboard</Link>,
    },
    {
      key: '2',
      icon: <EnvironmentOutlined />,
      label: <Link to={'/place-list'}>Place List</Link>,
    },
    {
      key: '3',
      icon: <BlockOutlined />,
      label: <Link to={'/compare-map'}>Compare Map</Link>,
    },
  ];

  return (
    <Sider trigger={null} collapsible collapsed={collapse}>
      <Flex justify="center" style={{ padding: 10 }}>
        <Avatar src={logoWeb} size={30} />
      </Flex>
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
