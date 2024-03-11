import { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Button, Typography, theme } from 'antd';
import Siders from '../components/Siders';
import { Outlet } from 'react-router-dom';
import useUserState from '../utils/state/user/userState';
import OptionMenu from '../components/OptionMenu';
import { getGreeting } from '../utils/helper';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const LayoutPages: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const username = useUserState().name;
  const greeting = getGreeting();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Siders collapse={collapsed} />
      <Layout>
        <Header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
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
          <Text strong style={{ margin: '0 16px' }}>
            {greeting}, {username}
          </Text>
          <OptionMenu />
        </Header>
        <Content
          style={{
            margin: '16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: 8,
            overflowY: 'scroll',
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
          <Text>Create by Zulham 👋</Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutPages;
