import {
  LockOutlined,
  UserOutlined,
  IdcardOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyOutlined,
  KeyOutlined,
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
import CryptoJS from 'crypto-js';
import { getDeviceType } from '@/utils/helper';
import useDeviceState from '@/utils/state/device/deviceState';

const { Title } = Typography;

interface RegisterData {
  username: string;
  fullname: string;
  password: string;
  verify: string;
  code: string;
}

const Register: React.FC = () => {
  const authState = useAuthState();
  const deviceState = useDeviceState();

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const formRef = useRef<FormInstance | null>(null);

  const userAgent = navigator.userAgent;
  const deviceType = getDeviceType(userAgent);

  const { mutate } = useMutation({
    mutationFn: registerAcc,
    onSuccess: (data) => {
      authState.setToken({
        accessToken: data.accessToken,
      });
      deviceState.setDevice({
        device: userAgent,
        type: deviceType.device,
        mobile: deviceType.mobile,
      });
      formRef.current?.resetFields();
      message.open({
        type: 'success',
        content: data.message,
        duration: 3,
      });
    },
    onError: (error: any) => {
      error.response.data.message.map((msg: any) => {
        message.open({
          type: 'error',
          content: msg,
          duration: 5,
        });
      });
    },
  });

  const onFinish = (values: RegisterData) => {
    const pw = CryptoJS.AES.encrypt(
      values.password,
      import.meta.env.VITE_SECRET
    ).toString();

    mutate({
      username: values.username,
      fullname: values.fullname,
      password: import.meta.env.VITE_USER + pw,
      verify: values.verify,
      code: values.code,
    });
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
        formRef.current = form as FormInstance | null;
      }}
      onFinish={onFinish}
    >
      <Title level={4} style={{ paddingBottom: 16 }}>
        Buat Akun
      </Title>
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
        name="username"
        rules={[{ required: true, message: 'Masukan Nama Pengguna!' }]}
        style={{ maxWidth: 400 }}
      >
        <Input
          count={{
            show: true,
            max: 8,
          }}
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Nama Pengguna"
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
        <Input.Password
          prefix={<SafetyOutlined className="site-form-item-icon" />}
          placeholder="Verifikasi Kata Sandi"
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item
        label="Kode Ajaib"
        name="code"
        tooltip="Gunakan Kode Khusus Untuk Merubah Kata Sandi"
        extra="Ingat Kode Anda Dengan Baik"
        rules={[
          {
            required: true,
            message: 'Masukkan Kode Ajaib Anda!',
          },
          {
            pattern: /^[0-9]{6}$/,
            message: 'Masukkan Kode Berupa 6 Angka',
          },
        ]}
        style={{ maxWidth: 400 }}
      >
        <Input.Password
          count={{
            show: true,
            max: 6,
          }}
          prefix={<KeyOutlined className="site-form-item-icon" />}
          placeholder="Masukkan Kode Ajaib"
          autoComplete="off"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
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
