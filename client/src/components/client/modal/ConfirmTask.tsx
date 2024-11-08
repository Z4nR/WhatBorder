import React from 'react';
import { ConfirmProps } from '@/utils/types/modal.types';
import { Modal, Typography } from 'antd';

const { Text } = Typography;

const ConfirmTask: React.FC<ConfirmProps> = ({
  title,
  okText,
  cancelText,
  onOk,
  onCancel,
  open,
  taskType,
}) => {
  return (
    <Modal
      title={title}
      open={open}
      centered
      closable={false}
      maskClosable={false}
      okText={okText}
      cancelText={cancelText}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Text>
        Perangkat ini dipilih sebagai media untuk {taskType} titik koordinat
        tempat. <br /> Silahkan Tekan Setujui apabila menyetujuinya
      </Text>
    </Modal>
  );
};

export default ConfirmTask;
