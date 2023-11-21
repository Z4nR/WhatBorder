import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Button, Typography, theme } from 'antd';
import Siders from '../components/Siders';
import { Outlet } from 'react-router-dom';
import useUserState from '../utils/state/user/userState';

const { Header, Content } = Layout;
const { Text } = Typography;

const LayoutPages: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const username = () => useUserState.getState().name;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Siders collapse={collapsed} />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: 'sticky',
            top: 0,
            right: 0,
            zIndex: 11,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Text>{username()}</Text>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPages;
