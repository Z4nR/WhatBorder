import ForgotPassword from '@/components/general/auth/ForgotPassword';
import Login from '@/components/general/auth/Login';
import Register from '@/components/general/auth/Register';
import {
  LoginOutlined,
  UserAddOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { Layout, Tabs, Tooltip } from 'antd';
import React from 'react';

const VerifPages: React.FC = () => {
  const menuItems = [
    {
      key: '1',
      children: <Login />,
      label: (
        <Tooltip title="Masuk Ke Laman">
          <LoginOutlined style={{ margin: '0 auto' }} />
        </Tooltip>
      ),
    },
    {
      key: '2',
      children: <Register />,
      label: (
        <Tooltip title="Daftar Sebagai Pengguna">
          <UserAddOutlined style={{ margin: '0 auto' }} />
        </Tooltip>
      ),
    },
    {
      key: '3',
      children: <ForgotPassword />,
      label: (
        <Tooltip title="Atur Ulang Sandi">
          <UnlockOutlined style={{ margin: '0 auto' }} />
        </Tooltip>
      ),
    },
  ];

  return (
    <Layout
      style={{
        minHeight: '100vh',
        justifyContent: 'center',
      }}
    >
      <Tabs
        defaultActiveKey="1"
        centered
        style={{
          marginInline: '1rem',
        }}
        items={menuItems.map((item) => ({
          key: item.key,
          children: item.children,
          label: item.label,
        }))}
      />
    </Layout>
  );
};

export default VerifPages;
