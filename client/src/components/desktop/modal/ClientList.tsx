/* eslint-disable react-hooks/exhaustive-deps */
import EmptyData from '@/components/general/utils/EmptyData';
import { socketConnection } from '@/utils/helper';
import { SocketProps } from '@/utils/types/client.types';
import useDeviceState from '@/utils/state/deviceState';
import useUserState from '@/utils/state/userState';
import { Button, Modal, Table, TableProps, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { ClientProps } from '@/utils/types/modal.types';

const { Link } = Typography;

const ClientList: React.FC<ClientProps> = ({
  state,
  setState,
  listDevice,
  deleteClient,
  rejectClient,
}) => {
  const socket = socketConnection();
  const [listClient, setListClient] = useState<SocketProps[]>([]);
  const [disableChoice, setDisableChoice] = useState(false);

  const userState = useUserState();
  const deviceState = useDeviceState();

  const isDesktop = useMediaQuery({ query: '(min-width: 640px)' });

  // When push client to list
  useEffect(() => {
    const handleClientList = (data: SocketProps) => {
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

    socket.on(listDevice, handleClientList);

    return () => {
      socket.off(listDevice, handleClientList);
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

    socket.on(deleteClient, handleClientListUpdate);
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

    socket.on(rejectClient, handleRejectClient);
  }, [listClient, socket]);

  console.log(listClient);

  const columnsClient: TableProps<SocketProps>['columns'] = [
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
