import {
  LockOutlined,
  UserOutlined,
  IdcardOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Form,
  FormInstance,
  Input,
  Typography,
  message,
  theme,
} from 'antd';
import { Navigate } from 'react-router-dom';
import { useRef } from 'react';
import useAuthState from '@/utils/state/auth/authState';
import { registerAcc } from '@/utils/networks';

const { Title } = Typography;

const Register: React.FC = () => {
  const authState = useAuthState();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const formRef = useRef<FormInstance | null>(null);

  const { mutate } = useMutation({
    mutationFn: registerAcc,
    onSuccess: (data) => {
      authState.setToken({
        accessToken: data.accessToken,
      });
      formRef.current?.resetFields();
      message.open({
        type: 'success',
        content: data.message,
        duration: 3,
      });
    },
    onError: (error: any) => {
      {
        message.open({
          type: 'error',
          content: error.response.data.message,
          duration: 5,
          className: 'custom-class',
          style: {
            marginTop: '20vh',
          },
        });
      }
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
      name="normal_regist"
      className="regist-form"
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
      ref={(form) => {
        formRef.current = form;
      }}
      onFinish={onFinish}
    >
      <Title level={4} style={{ paddingBottom: 16 }}>
        Buat Akun
      </Title>
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Masukan Nama Pengguna!' }]}
        style={{ maxWidth: 400 }}
      >
        <Input
          count={{
            show: true,
            max: 10,
          }}
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Nama Pengguna"
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item
        name="fullname"
        rules={[{ required: true, message: 'Masukan Nama Lengkap Anda!' }]}
        style={{ maxWidth: 400 }}
      >
        <Input
          count={{
            show: true,
            max: 30,
          }}
          prefix={<IdcardOutlined className="site-form-item-icon" />}
          placeholder="Nama Lengkap"
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Masukan Kata Sandi!' }]}
        style={{ maxWidth: 400 }}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Kata Sandi"
          autoComplete="off"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>
      <Form.Item
        name="verify"
        rules={[{ required: true, message: 'Verifikasi Kata Sandi!' }]}
        style={{ maxWidth: 400 }}
      >
        <Input
          prefix={<SafetyOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Verifikasi Kata Sandi"
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item
        name="code"
        rules={[
          {
            required: true,
            message: 'Masukkan Kode Keamanan Anda!',
            pattern: /^[0-9]{6}$/,
          },
        ]}
        style={{ maxWidth: 400 }}
      >
        <Input
          count={{
            show: true,
            max: 6,
          }}
          prefix={<SafetyOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Masukkan Angka Ajaib Anda"
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: 8 }}>
        <Button
          style={{ width: '100%', marginBottom: 8 }}
          type="primary"
          htmlType="submit"
          className="regist-form-button"
        >
          Buat Akun
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
