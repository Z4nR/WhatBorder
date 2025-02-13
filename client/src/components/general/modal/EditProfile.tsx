import { editProfileUser } from '@/utils/networks';
import { EditProfileProps } from '@/utils/types/modal.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Input, message, Modal } from 'antd';
import React from 'react';

const EditProfile: React.FC<EditProfileProps> = ({
  state,
  setState,
  initialValue,
}) => {
  const [form] = Form.useForm();

  const client = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: editProfileUser,
    onSuccess: (data) => {
      client.invalidateQueries({
        queryKey: ['my-profile'],
      });
      setState(false);
      message.open({
        type: 'success',
        content: data,
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

  const onCancel = () => {
    setState(false);
    form.resetFields();
  };

  type EditValue = {
    username: string;
    fullname: string;
    description: string;
  };

  const onEdit = (values: EditValue) => {
    const updateData = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => value !== initialValue[key as keyof EditValue]
      )
    );

    if (Object.keys(updateData).length === 0) {
      message.info('Tidak ada perubahan data');
      return;
    }

    mutate(updateData);
  };

  const onOk = () => {
    form.submit();
  };

  return (
    <Modal
      title="Ubah Data Profil"
      open={state}
      centered
      maskClosable={false}
      cancelText="Batalkan"
      okText="Perbarui Data"
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form
        form={form}
        name="edit_profil"
        onFinish={onEdit}
        initialValues={initialValue}
        layout="vertical"
      >
        <Form.Item name="username" label="Nama Panggilan">
          <Input placeholder="Masukkan Nama Panggilan" />
        </Form.Item>
        <Form.Item name="fullname" label="Nama Lengkap">
          <Input placeholder="Masukkan Nama Lengkap" />
        </Form.Item>
        <Form.Item name="description" label="Keterangan Akun">
          <Input placeholder="Deskripsikan Akun Ini" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfile;
