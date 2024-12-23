import { useMutation } from '@tanstack/react-query';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, message, theme } from 'antd';
import { Navigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { getDeviceType } from '@/utils/helper';
import useDeviceState from '@/utils/state/deviceState';
import { customAlphabet } from 'nanoid';
import useAuthState from '@/utils/state/authState';
import { loginAcc } from '@/utils/networks';
import React from 'react';
import { LoginProps } from '@/utils/types/auth.types';

const { Title } = Typography;

const Login: React.FC = () => {
  const authState = useAuthState();
  const deviceState = useDeviceState();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const userAgent = navigator.userAgent;
  const deviceType = getDeviceType(userAgent);

  const nanoid = customAlphabet('1234567890ABCDEFGHIJ', 10);

  const { mutate } = useMutation({
    mutationFn: loginAcc,
    onSuccess: (data) => {
      authState.setToken({
        accessToken: data.accessToken,
      });
      deviceState.setDevice({
        uniqueCode: nanoid(5),
        device: userAgent,
        type: deviceType.device,
        mobile: deviceType.mobile,
      });
      message.open({
        type: 'success',
        content: data.message,
        duration: 3,
      });
    },
    onError: (error: any) => {
      message.open({
        type: 'error',
        content: error.response.data.message,
        duration: 5,
      });
    },
  });

  const onLogin = (values: LoginProps) => {
    const pw = CryptoJS.AES.encrypt(
      values.password,
      import.meta.env.VITE_SECRET
    ).toString();

    mutate({
      username: values.username,
      password: import.meta.env.VITE_USER + pw,
    });
  };

  if (authState.accessToken) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <Form
      name="normal_login"
      className="login-form"
      style={{
        maxWidth: '400px',
        width: '100%',
        margin: '0 auto',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        background: colorBgContainer,
      }}
      onFinish={onLogin}
    >
      <Title level={4} style={{ paddingBottom: 16 }}>
        Masuk
      </Title>
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Tolong Masukan Nama Pengguna!' }]}
        style={{ maxWidth: 400 }}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Nama Pengguna"
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Tolong Masukan Kata Sandi!' }]}
        style={{ maxWidth: 400 }}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Kata Sandi"
          autoComplete="off"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 8 }}>
        <Button
          style={{ width: '100%', marginBottom: 8 }}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          Masuk
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
