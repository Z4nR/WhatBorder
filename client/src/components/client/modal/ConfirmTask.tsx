import { Modal, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

interface ClientModal {
  title: string;
  okText: string;
  cancelText: string;
  onOk: () => void;
  onCancel: () => void;
  open: boolean;
  taskType: string;
}

const ConfirmTask: React.FC<ClientModal> = ({
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
