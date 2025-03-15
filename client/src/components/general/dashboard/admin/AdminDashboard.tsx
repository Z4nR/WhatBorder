import React from 'react';
import { getGreeting } from '@/utils/helper';
import useUserState from '@/utils/state/userState';
import {
  Card,
  Col,
  Flex,
  Row,
  Statistic,
  Tabs,
  Tooltip,
  Typography,
} from 'antd';
import { CompassOutlined, TeamOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { placeStatisticAdmin } from '@/utils/networks';
import { useQuery } from '@tanstack/react-query';
import ChartTotalBuilding from './ChartTotalBuilding';
import ChartCreateTime from './ChartCreateTime';
import ChartGeoMap from './ChartGeoMap';
import ChartUpdateTime from './ChartUpdateTime';

const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const greeting = getGreeting();

  const userState = useUserState();

  const username = userState.name;

  const actions: React.ReactNode[] = [
    <Tooltip title="Info Jenis Tempat">
      <HomeOutlined
        key="list-building"
        onClick={() => navigate('/place-type-action')}
      />
    </Tooltip>,
    <Tooltip title="Info Lokasi Tempat">
      <CompassOutlined
        key="list-place"
        onClick={() => navigate('/place-action')}
      />
    </Tooltip>,
    <Tooltip title="Info Pengguna">
      <TeamOutlined key="list-user" />
    </Tooltip>,
  ];

  const { data, isLoading } = useQuery({
    queryKey: ['place-statistic-admin'],
    queryFn: async () => await placeStatisticAdmin(),
  });

  const lineItems = [
    {
      key: '1',
      children: <ChartCreateTime data={data} loading={isLoading} />,
      label: 'Grafik Penambahan Data',
    },
    {
      key: '2',
      children: <ChartUpdateTime data={data} loading={isLoading} />,
      label: 'Grafik Perubahan Data',
    },
  ];

  const intervalItems = [
    {
      key: '1',
      children: <ChartTotalBuilding data={data} loading={isLoading} />,
      label: 'Grafik Data Tempat Keseluruhan',
    },
  ];

  return (
    <div style={{ minHeight: '100dvh' }}>
      <Card
        actions={actions}
        style={{ marginBottom: '1rem', maxWidth: 'fit-content' }}
      >
        <Title level={3}>
          {greeting}, {username}
        </Title>
        <Flex gap={30} style={{ marginTop: '8px' }} wrap>
          <Statistic title={'Total Tempat'} value={data?.totalPlace} />
          <Statistic
            title={'Baru Ditambahkan Bulan Ini'}
            value={data?.totalPlaceThisMonth}
          />
          <Statistic
            title={'Persentase Perubahan Data'}
            value={parseFloat(data?.percentageComparison)}
            precision={2}
            suffix="%"
            valueStyle={{
              color:
                data?.statusPercentage === 'increase'
                  ? 'green'
                  : data?.statusPercentage === 'decrease'
                  ? 'red'
                  : 'black',
            }}
          />
        </Flex>
      </Card>
      <Row gutter={[16, 16]} wrap>
        <Col xs={24} md={12}>
          <Tabs
            defaultActiveKey="1"
            centered
            items={lineItems.map((item) => ({
              key: item.key,
              children: item.children,
              label: item.label,
            }))}
          />
        </Col>
        <Col xs={24} md={12}>
          <Tabs
            defaultActiveKey="1"
            centered
            items={intervalItems.map((item) => ({
              key: item.key,
              children: item.children,
              label: item.label,
            }))}
          />
        </Col>
      </Row>
      <ChartGeoMap />
    </div>
  );
};

export default AdminDashboard;
