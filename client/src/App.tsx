import React, { useEffect, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Button, theme } from 'antd';
import Siders from './components/Siders';
import { Route, Routes } from 'react-router-dom';
import DashboardPages from './pages/DashboardPages';
import LoginPages from './pages/LoginPages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

const { Header, Content } = Layout;

const App: React.FC = () => {
  const [authUser, setAuthUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {});

  if (!authUser) {
    return (
      <Layout
        style={{
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/*" element={<LoginPages />} />
          </Routes>
        </QueryClientProvider>
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
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/dashboard" element={<DashboardPages />} />
            </Routes>
          </QueryClientProvider>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
