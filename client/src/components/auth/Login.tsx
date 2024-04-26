import { loginAcc } from '../../utils/networks';
import useAuthState from '../../utils/state/auth/authState';
import { useMutation } from '@tanstack/react-query';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, message, theme } from 'antd';
import { Navigate } from 'react-router-dom';

const { Title } = Typography;

const Login: React.FC = () => {
  const authState = useAuthState();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { mutate } = useMutation({
    mutationFn: loginAcc,
    onSuccess: (data) => {
      authState.setToken({
        accessToken: data.accessToken,
      });
      message.open({
        type: 'success',
        content: data.message,
        duration: 3,
      });
    },
    onError: (error: any) => {
      error.response.data.message.map((msg:any) => {
          message.open({
            type: 'error',
            content: msg,
            duration: 5,
          });
      })
    },
  });

  const onFinish = (values: any) => {
    mutate(values);
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
      initialValues={{ remember: true }}
      onFinish={onFinish}
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
