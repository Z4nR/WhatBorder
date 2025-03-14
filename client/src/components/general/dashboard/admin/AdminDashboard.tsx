import React from 'react';
import { getGreeting } from '@/utils/helper';
import useUserState from '@/utils/state/userState';
import { Card, Col, Flex, Row, Statistic, Tooltip, Typography } from 'antd';
import { CompassOutlined, TeamOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { placeStatisticAdmin } from '@/utils/networks';
import { useQuery } from '@tanstack/react-query';
import ChartTotalBuilding from './ChartTotalBuilding';
import ChartCreateTime from './ChartCreateTime';

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

  return (
    <div style={{ minHeight: '100dvh' }}>
      <Row gutter={[16, 16]} wrap>
        <Col xs={24} md={12}>
          <Card actions={actions}>
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
        </Col>
        <Col xs={24} md={12}>
          <ChartTotalBuilding data={data} loading={isLoading} />
          <ChartCreateTime data={data} loading={isLoading} />
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
