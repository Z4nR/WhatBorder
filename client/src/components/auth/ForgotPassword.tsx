import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, theme } from 'antd';

const { Title } = Typography;

const ForgotPassword: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onFinish = (values: any) => {
    console.log(values);
  };

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
        Forgot Your Password
      </Title>
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
        style={{ maxWidth: 400 }}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
          autoComplete="off"
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
          Change Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ForgotPassword;
