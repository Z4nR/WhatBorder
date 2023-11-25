import { forgetPassword } from '../../utils/networks';
import {
  LockOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Typography, theme } from 'antd';

const { Title } = Typography;

const ForgotPassword: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { mutate } = useMutation({
    mutationFn: forgetPassword,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error: any) => {
      console.log(error.response.data.message);
    },
  });

  const onFinish = (values: any) => {
    console.log(values);
    mutate(values);
  };

  return (
    <Form
      name="normal_forget"
      className="forget-form"
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
        name="newpass"
        rules={[{ required: true, message: 'Please input your Password!' }]}
        style={{ maxWidth: 400 }}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Password"
          autoComplete="off"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>
      <Form.Item
        name="verify"
        rules={[{ required: true, message: 'Please verify your Password!' }]}
        style={{ maxWidth: 400 }}
      >
        <Input
          prefix={<SafetyOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Verify Your Password"
          autoComplete="off"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 8 }}>
        <Button
          style={{ width: '100%', marginBottom: 8 }}
          type="primary"
          htmlType="submit"
          className="forget-form-button"
        >
          Change Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ForgotPassword;
