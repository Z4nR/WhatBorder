import { socketConnection } from '@/utils/helper';
import { SocketData } from '@/utils/state/client/client.types';
import useDeviceState from '@/utils/state/device/deviceState';
import useUserState from '@/utils/state/user/userState';
import { Modal, Table, TableProps, Typography } from 'antd';
import { useEffect, useState } from 'react';

const { Link } = Typography;

interface ModalSet {
  setState: (state: boolean) => void;
  state: boolean;
}

const ClientList: React.FC<ModalSet> = ({ state, setState }) => {
  const socket = socketConnection();
  const [listClient, setListClient] = useState<SocketData[]>([]);
  const [disableChoice, setDisableChoice] = useState(false);

  const userState = useUserState();
  const deviceState = useDeviceState();

  useEffect(() => {
    const handleClientList = (data: SocketData) => {
      console.log(data);

      if (data.id === userState.name && data.desktop === deviceState.device) {
        setListClient((prevData) => {
          const exists = prevData.some(
            (client) =>
              client.time === data.time && client.client === data.client
          );

          if (!exists) {
            return [...prevData, data];
          }

          return prevData;
        });
      }
    };

    socket.on('list-client', handleClientList);

    return () => {
      socket.off('list-client');
    };
  }, [socket, userState.name, deviceState.device]);

  useEffect(() => {
    const handleRejectClient = (data: { data: string }) => {
      console.log(data.data);

      const exists = listClient.some((client) => {
        console.log(client.client);

        return client.client === data.data;
      });
      console.log(exists);

      if (exists) setDisableChoice(false);
    };

    socket.on('reject-client', handleRejectClient);

    return () => {
      socket.off('reject-client');
    };
  }, [listClient, socket]);

  const columnsClient: TableProps<SocketData>['columns'] = [
    {
      title: 'User Agent',
      dataIndex: 'client',
      key: 'client-user-agent',
    },
    {
      title: 'Jenis Perangkat',
      dataIndex: 'type',
      key: 'client-type',
    },
    {
      title: 'Tindakan',
      key: 'desktop-action',
      align: 'center',
      width: '150px',
      render: (_, { time, id, desktop, client, mobile, type }) => (
        <Link
          disabled={disableChoice}
          onClick={() => {
            const data = { time, id, desktop, client, mobile, type };
            console.log(data);

            socket.emit('client', data);
            setDisableChoice(true);
          }}
        >
          Pilih Perangkat
        </Link>
      ),
    },
  ];

  return (
    <Modal
      title="Daftar Perangkat Tertaut"
      open={state}
      maskClosable={false}
      footer={null}
      onCancel={() => {
        setListClient([]);
        setState(false);
      }}
    >
      <Table
        columns={columnsClient}
        dataSource={listClient}
        rowKey={({ time }) => time.toString()}
      />
    </Modal>
  );
};

export default ClientList;
