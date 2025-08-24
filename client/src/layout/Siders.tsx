import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { useState, CSSProperties } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRoute } from '@/utils/networks';
import useAuthState from '@/utils/state/authState';
import buildSiderMenuItems from '@/components/general/utils/SiderRegistry';

const { Sider } = Layout;

const Siders: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const isSideStyle = useMediaQuery({
    query: '(max-width: 992px)',
  });

  const triggerStyle: CSSProperties = {
    position: 'fixed',
    top: 50,
    left: collapsed ? 0 : 200,
    fontSize: 20,
    zIndex: 99,
    cursor: 'pointer',
    color: 'white',
    padding: '8px 12px 8px 10px',
    borderRadius: '0 5px 5px 0',
    backgroundColor: '#001529',
    transition: collapsed ? 'left 0.2s ease' : 'left 0.23s ease',
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const siderStyle: CSSProperties = isSideStyle
    ? { position: 'fixed', height: '100vh', zIndex: 100 }
    : {};

  const { data } = useQuery({
    queryKey: ['routes'],
    queryFn: async () => await getRoute(),
    enabled: !!useAuthState().accessToken,
  });

  const asideData = data ? buildSiderMenuItems(data) : [];

  return (
    <>
      {isSideStyle && (
        <div style={triggerStyle} onClick={toggleCollapsed}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      )}

      <Sider
        style={siderStyle}
        breakpoint="lg"
        collapsedWidth="0"
        collapsible={isSideStyle}
        collapsed={isSideStyle ? collapsed : false}
        trigger={null}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard_admin', 'dashboard_user']}
          items={asideData}
        />
      </Sider>
    </>
  );
};

export default Siders;
