import React, { useEffect } from 'react';
import { getGreeting } from '@/utils/helper';
import useUserState from '@/utils/state/userState';
import {
  Card,
  Col,
  Flex,
  Row,
  Skeleton,
  Statistic,
  Tooltip,
  Typography,
} from 'antd';
import { CompassOutlined, TeamOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DashboardChartProps } from '@/utils/types/statistic.types';
import { placeStatisticAdmin } from '@/utils/networks';
import { useQuery } from '@tanstack/react-query';
import { Chart } from '@antv/g2';

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

  useEffect(() => {
    if (!data) return;

    const chart = new Chart({
      container: 'statistic',
      autoFit: true,
    });

    const chartData = data?.detail.map((item: DashboardChartProps) => ({
      Jenis: item.buildingName,
      Jumlah: item.placeCount,
      Bulan: item.month,
      color: item.color,
    }));

    // Extract unique colors from transformedData
    const uniqueColors = [
      ...new Set(chartData.map((item: DashboardChartProps) => item.color)),
    ];

    chart
      .line()
      .data(chartData)
      .encode('x', 'Bulan')
      .encode('y', 'Jumlah')
      .encode('color', 'Jenis')
      .scale('color', {
        range: uniqueColors,
      })
      .style('minHeight', 10)
      .animate('enter', { type: 'pathIn', duration: 1000 });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data]);

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
          <Skeleton style={{ marginTop: '1rem' }} loading={isLoading} active>
            <div id="statistic"></div>
          </Skeleton>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
