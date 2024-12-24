import React from 'react';
import { socketConnection } from '@/utils/helper';
import { deleteAccount } from '@/utils/networks';
import useAuthState from '@/utils/state/authState';
import useDeviceState from '@/utils/state/deviceState';
import useUserState from '@/utils/state/userState';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Form, Input, message, Modal, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DeleteProfileProps } from '@/utils/types/modal.types';

const { Text } = Typography;

const DeleteProfile: React.FC<DeleteProfileProps> = ({ setState, state }) => {
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const socket = socketConnection();

  const navigate = useNavigate();
  const authState = useAuthState();
  const userState = useUserState();
  const deviceState = useDeviceState();

  const { mutate } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (data) => {
      socket.emit('logout-device', {
        uniqueCode: deviceState.uniqueCode,
      });

      authState.deleteToken();
      userState.clearUser();
      deviceState.clearDevice();
      localStorage.clear();
      queryClient.clear();

      message.open({
        type: 'success',
        content: data,
        duration: 3,
      });

      setTimeout(() => {
        socket.removeAllListeners();
        navigate('/auth', { replace: true });
      }, 1000);
    },
    onError: (error: any) => {
      message.open({
        type: 'error',
        content: error.response.data.message,
        duration: 5,
      });
    },
  });

  const onCancel = () => {
    setState(false);
    form.resetFields();
  };

  const onDelete = (values: any) => {
    mutate(values);
  };

  const onOk = () => {
    form.submit();
  };

  return (
    <Modal
      title="Hapus Seluruh Data"
      open={state}
      centered
      width={300}
      maskClosable={false}
      cancelText="Batalkan"
      okText="Hapus Akun"
      onCancel={onCancel}
      onOk={onOk}
    >
      <Text>Info Info</Text>
      <Form
        form={form}
        name="delete_profil"
        onFinish={onDelete}
        layout="vertical"
      >
        <Form.Item name="password" label="Kata Sandi">
          <Input type="password" placeholder="Masukan Sandi Anda" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DeleteProfile;
