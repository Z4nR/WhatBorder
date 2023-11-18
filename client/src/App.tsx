import React, { useEffect, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Button, theme } from 'antd';
import Siders from './components/Siders';
import { Route, Routes } from 'react-router-dom';
import DashboardPages from './pages/DashboardPages';
import LoginPages from './pages/LoginPages';
import storage from './utils/storage';

const { Header, Content } = Layout;

const App: React.FC = () => {
  const [authUser, setAuthUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    setAuthUser(storage.getAccessToken('token'));
  }, []);

  if (!authUser) {
    return (
      <Layout
        style={{
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <Routes>
          <Route path="/*" element={<LoginPages />} />
        </Routes>
      </Layout>
    );
  }

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
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route path="/dashboard" element={<DashboardPages />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
