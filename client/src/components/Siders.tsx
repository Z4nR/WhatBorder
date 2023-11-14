import React from 'react';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Avatar, Flex, Layout, Menu } from 'antd';
import logoWeb from '../assets/react.svg';

const { Sider } = Layout;

interface SidersProps {
  collapse: boolean;
}

const Siders: React.FC<SidersProps> = ({ collapse }) => {
  return (
    <Sider trigger={null} collapsible collapsed={collapse}>
      <Flex justify="center" style={{ padding: 10 }}>
        <Avatar src={logoWeb} size={30} />
      </Flex>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <UserOutlined />,
            label: 'Dashboard',
          },
          {
            key: '2',
            icon: <VideoCameraOutlined />,
            label: 'Place List',
          },
          {
            key: '3',
            icon: <UploadOutlined />,
            label: 'Compare Map',
          },
        ]}
      />
    </Sider>
  );
};

export default Siders;
