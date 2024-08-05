import { Modal } from 'antd';

interface ModalSet {
  state: boolean;
}

const ClientList: React.FC<ModalSet> = ({ state }) => {
  return (
    <Modal title="List Perangkat Tertaut" open={state}>
      <p>Contoh</p>
    </Modal>
  );
};

export default ClientList;
