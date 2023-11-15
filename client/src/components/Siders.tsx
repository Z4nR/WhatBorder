import React from 'react';
import { Link } from 'react-router-dom';
import { BiSolidDashboard, BiSolidMap, BiSolidMapAlt } from 'react-icons/bi';
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
      icon: <BiSolidDashboard />,
      label: 'Dashboard',
      link: '/dashboard',
    },
    {
      key: '2',
      icon: <BiSolidMap />,
      label: 'Place List',
      link: '/place-list',
    },
    {
      key: '3',
      icon: <BiSolidMapAlt />,
      label: 'Compare Map',
      link: '/compare-map',
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
        defaultSelectedKeys={['1']}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: <Link to={item.link}>{item.label}</Link>,
        }))}
      />
    </Sider>
  );
};

export default Siders;
