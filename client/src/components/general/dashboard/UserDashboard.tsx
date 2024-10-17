import React, { useEffect, useState } from 'react';
import { Chart } from '@antv/g2';
import { ShakeOutlined, UserOutlined } from '@ant-design/icons';
import {
  Card,
  Col,
  Flex,
  Row,
  Skeleton,
  Statistic,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useQuery } from '@tanstack/react-query';
import { placeStatistic } from '@/utils/networks';
import { dateFormatter, getGreeting, socketConnection } from '@/utils/helper';
import useUserState from '@/utils/state/user/userState';
import { useMediaQuery } from 'react-responsive';
import useDeviceState from '@/utils/state/device/deviceState';
import useSocketState from '@/utils/state/client/clientState';
import { useNavigate } from 'react-router-dom';
import { SocketData } from '@/utils/state/client/client.types';
import ClientList from '@/components/desktop/modal/ClientList';
import EmptyData from '../utils/EmptyData';
import ConfirmTask from '@/components/client/modal/ConfirmTask';

const { Title, Text } = Typography;

interface Statistic {
  buildingName: string;
  placeCount: number;
  color: string;
}

interface DataType {
  placeId: string;
  placeName: string;
  placeType: {
    name: string;
    label: string;
  };
  createdAt: Date;
}

interface DesktopData {
  id: string;
  desktop: string;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [clientModal, setClientModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [mobileClient, setMobileClient] = useState<SocketData>();
  const greeting = getGreeting();
  const socket = socketConnection();

  const userState = useUserState();
  const deviceState = useDeviceState();
  const socketAdminState = useSocketState.useSocketAdminState();
  const socketClientState = useSocketState.useSocketClientState();

  const username = userState.name;
  const uniqueCode = deviceState.uniqueCode;
  const mobile = deviceState.mobile;

  const actions: React.ReactNode[] = [
    <Tooltip title="Buat Koneksi">
      <ShakeOutlined
        key="connect"
        onClick={() => {
          socket.emit('search-client', {
            id: userState.name,
            desktop: deviceState.device,
          });

          setClientModal(true);
        }}
      />
    </Tooltip>,
    <Tooltip title="Profil">
      <UserOutlined key="profile" onClick={() => navigate('/profile')} />
    </Tooltip>,
  ];

  const isUserMiniTool = useMediaQuery({
    query: '(min-width: 640px)',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['place-statistic'],
    queryFn: async () => await placeStatistic(),
  });

  useEffect(() => {
    if (!data) return;

    const chart = new Chart({
      container: 'statistic',
      autoFit: true,
    });

    const chartData = data?.detail.map((item: Statistic) => ({
      Jenis: item.buildingName,
      Jumlah: item.placeCount,
      color: item.color,
    }));

    chart
      .interval()
      .data(chartData)
      .encode('x', 'Jenis')
      .encode('y', 'Jumlah')
      .encode('color', 'Jenis')
      .style('minHeight', 10)
      .scale('color', {
        range: chartData.map((item: Statistic) => item.color),
      });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data]);

  // When get client device
  useEffect(() => {
    const handleGetClient = (data: DesktopData) => {
      console.log(data);

      if (
        data.id === userState.name &&
        data.desktop !== deviceState.device &&
        mobile
      ) {
        console.log(deviceState);

        socket.emit('set-list', {
          id: data.id,
          desktop: data.desktop,
          uniqueCode: uniqueCode,
          client: deviceState.device,
          type: deviceState.type,
          mobile: deviceState.mobile,
        });
      }
    };

    socket.on('get-client', handleGetClient);

    return () => {
      socket.off('get-client', handleGetClient);
    };
  }, [deviceState, mobile, socket, uniqueCode, userState.name]);

  // When device choose as client
  useEffect(() => {
    const handleChooseClient = (data: SocketData) => {
      console.log(data);

      if (
        data.id === userState.name &&
        data.client === deviceState.device &&
        data.uniqueCode === deviceState.uniqueCode &&
        data.mobile &&
        mobile
      ) {
        setMobileClient(data);
        setConfirmModal(true);
      }
    };

    socket.on('choosen-client', handleChooseClient);

    return () => {
      socket.off('choosen-client', handleChooseClient);
    };
  }, [
    deviceState.device,
    deviceState.type,
    deviceState.uniqueCode,
    mobile,
    mobileClient,
    socket,
    userState.name,
  ]);

  // When client accept the process
  useEffect(() => {
    const handleNavigation = (data: SocketData) => {
      console.log(data);

      if (
        data.client === deviceState.device &&
        data.uniqueCode === deviceState.uniqueCode
      ) {
        socketClientState.setSocket(data);
        navigate('/location/new/coordinate');
      }

      if (data.desktop === deviceState.device) {
        socketAdminState.setSocket(data);
        navigate('/location/new');
      }
    };

    socket.on('accept-client', handleNavigation);

    return () => {
      socket.off('accept-client', handleNavigation);
    };
  }, [
    deviceState.device,
    deviceState.uniqueCode,
    navigate,
    socket,
    socketAdminState,
    socketClientState,
  ]);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Nama Tempat',
      dataIndex: 'placeName',
      key: 'place-name',
    },
    {
      title: 'Tipe',
      dataIndex: 'placeType',
      key: 'place-type',
      render: (_, { placeType }) => (
        <Tag style={{ margin: '0' }} color={placeType.label}>
          {placeType.name}
        </Tag>
      ),
    },
    {
      title: 'Ditambahkan Pada',
      dataIndex: 'createdAt',
      key: 'place-create',
      align: 'center',
      responsive: ['sm'],
      render: (_, { createdAt }) => <p>{dateFormatter(createdAt)}</p>,
    },
  ];

  const handleOnCancel = () => {
    socket.emit('reject-choice', { data: mobileClient?.client });
    setConfirmModal(false);
  };

  const handleOnConfirm = () => {
    socket.emit('accept-choice', mobileClient);
    setConfirmModal(false);
  };

  return (
    <div style={{ minHeight: '100dvh' }}>
      {clientModal && (
        <ClientList
          state={clientModal}
          setState={setClientModal}
          listDevice="list-client-create"
          rejectClient="reject-client-create"
          deleteClient="delete-client-create"
        />
      )}
      {confirmModal &&
        mobile &&
        mobileClient?.id === userState.name &&
        mobileClient?.client === deviceState.device && (
          <ConfirmTask
            title="Konfirmasi Penerimaan Tugas"
            open={confirmModal}
            okText="Setuju"
            cancelText="Tolak"
            onCancel={handleOnCancel}
            onOk={handleOnConfirm}
            taskType="memasukkan"
          />
        )}
      <Row gutter={[16, 16]} wrap>
        <Col xs={24} md={12}>
          <Card actions={isUserMiniTool && !mobile ? actions : undefined}>
            <Title level={3}>
              {greeting}, {username}
            </Title>
            <Text>
              Kode Perangkat Tertaut: <b>{uniqueCode}</b>
            </Text>
            <Flex gap={30} style={{ marginTop: '8px' }} wrap>
              <Statistic title={'Total Tempat'} value={data?.totalPlace} />
              <Statistic title={'Baru Ditambahkan Bulan Ini'} value={2} />
            </Flex>
          </Card>
          <Skeleton style={{ marginTop: '1rem' }} loading={isLoading} active>
            <div id="statistic"></div>
          </Skeleton>
        </Col>
        <Col xs={24} md={12}>
          <Flex vertical gap={'large'}>
            <div>
              <Text strong style={{ fontSize: '1rem' }}>
                Data 10 Tempat Terbaru Ditambahkan
              </Text>
              <Table
                style={{
                  maxHeight: '700px',
                  width: '100%',
                  marginTop: '0.7rem',
                }}
                pagination={false}
                loading={isLoading}
                columns={columns}
                dataSource={data?.newPlace}
                rowKey={({ placeId }) => placeId}
                locale={{
                  emptyText: (
                    <EmptyData description="Belum Ada Tempat Baru Yang Ditambahkan" />
                  ),
                }}
              />
            </div>
          </Flex>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;