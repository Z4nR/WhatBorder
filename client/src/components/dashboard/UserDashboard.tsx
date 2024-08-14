import React, { useEffect, useState } from 'react';
import { Chart } from '@antv/g2';
import { AimOutlined, ShakeOutlined, UserOutlined } from '@ant-design/icons';
import {
  Card,
  Col,
  Flex,
  FloatButton,
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

const UserDashboard: React.FC = () => {
  const [modal, setModal] = useState(false);
  const userState = useUserState();
  const deviceState = useDeviceState();
  const greeting = getGreeting();
  const socket = socketConnection();

  const username = userState.name;
  const mobile = deviceState.mobile;

  const actions: React.ReactNode[] = [
    <Tooltip title="Buat Koneksi">
      <ShakeOutlined
        key="connect"
        onClick={() => {
          socket.emit('search-client', {
            id: userState.name,
            requestAgent: deviceState.device,
          });

          setModal(true);
        }}
      />
    </Tooltip>,
    <Tooltip title="Profil">
      <UserOutlined key="profil" />
    </Tooltip>,
  ];

  const isFLoatingButton = useMediaQuery({
    query: '(max-width: 430px)',
  });
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
    socket.on('get-client', (data) => {
      console.log(data);

      if (
        data.id === userState.name &&
        data.requestAgent !== deviceState.device &&
        mobile
      ) {
        socket.emit('set-list', {
          id: data.id,
          requestAgent: data.requestAgent,
          client: deviceState.device,
          type: deviceState.type,
        });
      }
    });
  }, [deviceState.device, deviceState.type, mobile, socket, userState.name]);

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

  return (
    <div style={{ minHeight: '100dvh' }}>
      {modal && <ClientList state={modal} setState={setModal} />}
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
      {isFLoatingButton && mobile && (
        <FloatButton
          style={{ width: '56px', height: '56px' }}
          icon={<AimOutlined style={{ fontSize: '28px' }} />}
          shape="square"
          type="primary"
          tooltip="Tambah Tempat"
        />
      )}
    </div>
  );
};

export default UserDashboard;
