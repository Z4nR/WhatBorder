import React, { useEffect, useState } from 'react';
import { Chart } from '@antv/g2';
import { ShakeOutlined, UserOutlined } from '@ant-design/icons';
import {
  Card,
  Col,
  Flex,
  Modal,
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
import ClientList from '../modal/ClientList';

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

interface ChoosenClient {
  time: number;
  id: string;
  desktop: string;
  client: string;
  type: string;
  mobile: boolean;
}

const UserDashboard: React.FC = () => {
  const [clientModal, setClientModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [mobileClient, setMobileClient] = useState<ChoosenClient>();
  const greeting = getGreeting();
  const socket = socketConnection();

  const userState = useUserState();
  const deviceState = useDeviceState();
  const username = userState.name;
  const mobile = deviceState.mobile;
  const time = Math.floor(new Date().getTime() / 1000);

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
      <UserOutlined key="profil" />
    </Tooltip>,
  ];

  const isUserMiniTool = useMediaQuery({
    query: '(min-width: 600px)',
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

  useEffect(() => {
    const handleGetClient = (data: DesktopData) => {
      console.log(data);

      if (
        data.id === userState.name &&
        data.desktop !== deviceState.device &&
        mobile
      ) {
        socket.emit('set-list', {
          time: time,
          id: data.id,
          desktop: data.desktop,
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
  }, [
    deviceState.device,
    deviceState.mobile,
    deviceState.type,
    mobile,
    socket,
    time,
    userState.name,
  ]);

  useEffect(() => {
    const handleChooseClient = (data: ChoosenClient) => {
      console.log(data);

      if (
        data.id === userState.name &&
        data.client === deviceState.device &&
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
    mobile,
    mobileClient,
    socket,
    userState.name,
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

  const handlerOnCancel = () => {
    socket.emit('reject-choice', { data: mobileClient?.time });
    setConfirmModal(false);
  };

  return (
    <div style={{ minHeight: '100dvh' }}>
      {clientModal && (
        <ClientList state={clientModal} setState={setClientModal} />
      )}
      {confirmModal &&
        mobile &&
        mobileClient?.id === userState.name &&
        mobileClient?.client === deviceState.device && (
          <Modal
            title="Konfirmasi Penerimaan Tugas"
            open={confirmModal}
            centered
            maskClosable={false}
            okText="Setuju"
            cancelText="Tolak"
            onCancel={() => handlerOnCancel()}
          >
            <Text>
              Perangkat ini dipilih sebagai media untuk memasukkan titik
              koordinat tempat. <br /> Silahkan Tekan Setujui apabila
              menyetujuinya
            </Text>
          </Modal>
        )}
      <Row gutter={[16, 16]} wrap>
        <Col xs={24} md={12}>
          <Card actions={isUserMiniTool && !mobile ? actions : undefined}>
            <Title level={3}>
              {greeting}, {username}
            </Title>
            <Flex gap={30} wrap>
              <Statistic title={'Total Tempat'} value={2} />
              <Statistic title={'Baru Ditambahkan'} value={2} />
            </Flex>
          </Card>
          <Skeleton loading={isLoading} active>
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
                columns={columns}
                dataSource={data?.newPlace}
                rowKey={({ placeId }) => placeId}
              />
            </div>
          </Flex>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;
