import { socketConnection } from '@/utils/helper';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';

interface ModalSet {
  setState: (state: boolean) => void;
  state: boolean;
}

const ClientList: React.FC<ModalSet> = ({ state, setState }) => {
  const socket = socketConnection();
  const [listClient, setListClient] = useState([]);

  useEffect(() => {
    socket.on('list-client', (data) => {
      console.log(data);
    });
  }, []);

  return (
    <Modal
      title="List Perangkat Tertaut"
      open={state}
      onOk={() => setState(false)}
      onCancel={() => setState(false)}
    >
      <p>Contoh</p>
    </Modal>
  );
};

export default ClientList;
