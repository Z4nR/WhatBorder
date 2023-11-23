import React from 'react';
import { Layout, Tabs } from 'antd';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';

const VerifPages: React.FC = () => {
  const menuItems = [
    {
      key: '1',
      children: <Login />,
      label: 'Login',
    },
    {
      key: '2',
      children: <Register />,
      label: 'Register',
    },
    {
      key: '3',
      children: <ForgotPassword />,
      label: 'Password?',
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
