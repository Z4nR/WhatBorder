import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, theme } from 'antd';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;

const App: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
        Login
      </Title>
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
        style={{ maxWidth: 400 }}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
        style={{ maxWidth: 400 }}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Link to={''} className="login-form-forgot">
          Forgot password
        </Link>
      </Form.Item>

      <Form.Item style={{ marginBottom: 8 }}>
        <Button
          style={{ width: '100%', marginBottom: 8 }}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          Log in
        </Button>
        <Text style={{ paddingRight: 10 }}>Or</Text>
        <Link to={''}>Register Now!</Link>
      </Form.Item>
    </Form>
  );
};

export default App;
