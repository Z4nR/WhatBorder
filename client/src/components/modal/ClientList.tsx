import { socketConnection } from '@/utils/helper';
import { SocketData } from '@/utils/state/client/client.types';
import useDeviceState from '@/utils/state/device/deviceState';
import useUserState from '@/utils/state/user/userState';
import { Button, Modal, Table, TableProps, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import EmptyData from '../utils/EmptyData';

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

  const isDesktop = useMediaQuery({ query: '(min-width: 640px)' });

  // When push client to list
  useEffect(() => {
    const handleClientList = (data: SocketData) => {
      console.log(data);

      if (data.id === userState.name && data.desktop === deviceState.device) {
        setListClient((prevData) => {
          const exists = prevData.some(
            (client) =>
              client.uniqueCode === data.uniqueCode &&
              client.client === data.client
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
      socket.off('list-client', handleClientList);
    };
  }, [deviceState.device, socket, userState.name]);

  // When client logout
  useEffect(() => {
    const handleClientListUpdate = (data: { uniqueCode: string }) => {
      console.log(data);

      setListClient((prevData) =>
        prevData.filter((item) => item.uniqueCode !== data.uniqueCode)
      );
    };

    socket.on('delete-client', handleClientListUpdate);
  }, [socket]);

  // When client reject the permission and enable 'pilih perangkat' button
  useEffect(() => {
    const handleRejectClient = (data: { data: string }) => {
      console.log(data.data);

      const exists = listClient.some((client) => {
        console.log(client.client);

        return client.client === data.data;
      });

      if (exists) setDisableChoice(false);
    };

    socket.on('reject-client', handleRejectClient);
  }, [listClient, socket]);

  console.log(listClient);

  const columnsClient: TableProps<SocketData>['columns'] = [
    {
      title: 'Kode Perangkat',
      dataIndex: 'uniqueCode',
      key: 'client-code',
    },
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
      render: (_, { uniqueCode, id, desktop, client, mobile, type }) => (
        <Link
          disabled={disableChoice}
          onClick={() => {
            const data = { uniqueCode, id, desktop, client, mobile, type };
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

  if (isDesktop) {
    return (
      <Modal
        title="Daftar Perangkat Seluler Tertaut"
        open={state}
        centered
        maskClosable={false}
        footer={[
          <Button
            key="refresh"
            onClick={() => {
              socket.emit('search-client', {
                id: userState.name,
                desktop: deviceState.device,
              });
            }}
          >
            Cari Perangkat Lain
          </Button>,
        ]}
        onCancel={() => {
          setListClient([]);
          setState(false);
        }}
        width={700}
      >
        <Table
          style={{ height: listClient.length === 0 ? 'auto' : '450px' }}
          columns={columnsClient}
          dataSource={listClient}
          pagination={{ defaultPageSize: 2, position: ['topRight'] }}
          rowKey={({ uniqueCode }) => uniqueCode}
          locale={{
            emptyText: (
              <EmptyData description="Perangkat Client Tidak Ditemukan" />
            ),
          }}
        />
      </Modal>
    );
  }
};

export default ClientList;
