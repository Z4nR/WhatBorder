import { EditProfileProps } from '@/utils/types/modal.types';
import { Modal } from 'antd';
import React from 'react';

const EditProfile: React.FC<EditProfileProps> = ({
  state,
  setState,
  initialValue,
}) => {
  const handleOnCancel = () => {
    setState(false);
  };
  const handleOnEditProfile = () => {
    setState(false);
  };

  console.log(initialValue);

  return (
    <Modal
      title="Ubah Data Profil"
      open={state}
      centered
      maskClosable={false}
      cancelText="Batalkan"
      okText="Perbarui Data"
      onCancel={handleOnCancel}
      onOk={handleOnEditProfile}
    >
      <p>Testing</p>
    </Modal>
  );
};

export default EditProfile;
