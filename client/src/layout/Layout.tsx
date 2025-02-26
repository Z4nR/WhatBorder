import { Button, Layout, Space, Typography, theme } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Siders from '@/layout/Siders';
import { getGreeting, socketConnection } from '@/utils/helper';
import { useQueryClient } from '@tanstack/react-query';
import useAuthState from '@/utils/state/authState';
import useUserState from '@/utils/state/userState';
import useDeviceState from '@/utils/state/deviceState';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const LayoutPages: React.FC = () => {
  const queryClient = useQueryClient();
  const socket = socketConnection();

  const navigate = useNavigate();
  const authState = useAuthState();
  const userState = useUserState();
  const deviceState = useDeviceState();
  const location = useLocation();

  const username = userState.name;
  const greeting = getGreeting();

  const handleSignOut = () => {
    socket.emit('logout-device', {
      uniqueCode: deviceState.uniqueCode,
    });

    authState.deleteToken();
    userState.clearUser();
    deviceState.clearDevice();
    localStorage.clear();
    queryClient.clear();

    setTimeout(() => {
      socket.removeAllListeners();
      navigate('/auth', { replace: true });
    }, 1000);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100dvh' }}>
      <Siders />
      <Layout style={{ overflowY: 'scroll' }}>
        <Header
          style={{
            display: 'flex',
            justifyContent:
              location.pathname !== '/' ? 'space-between' : 'flex-end',
            alignItems: 'center',
            padding: 0,
            background: colorBgContainer,
            position: 'sticky',
            top: 0,
            right: 0,
            zIndex: 11,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          {location.pathname !== '/' && (
            <Text strong style={{ margin: '0 16px' }}>
              {greeting}, {username}
            </Text>
          )}
          <Button style={{ marginRight: 24 }} onClick={() => handleSignOut()}>
            <Space>
              Keluar
              <LogoutOutlined />
            </Space>
          </Button>
        </Header>
        <Content
          style={{
            margin: '16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            paddingTop: 4,
            fontSize: '1rem',
            textAlign: 'center',
          }}
        >
          <Text>Created by Ijan</Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutPages;
