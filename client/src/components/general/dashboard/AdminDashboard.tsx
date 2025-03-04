import React from 'react';
import { getGreeting } from '@/utils/helper';
import useUserState from '@/utils/state/userState';
import { Card, Col, Flex, Row, Statistic, Tooltip, Typography } from 'antd';
import { CompassOutlined, TeamOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div style={{ minHeight: '100dvh' }}>
      <Row gutter={[16, 16]} wrap>
        <Col xs={24} md={12}>
          <Card actions={actions}>
            <Title level={3}>
              {greeting}, {username}
            </Title>
            <Flex gap={30} style={{ marginTop: '8px' }} wrap>
              <Statistic title={'Total Tempat'} value={2} />
              <Statistic title={'Baru Ditambahkan Bulan Ini'} value={2} />
            </Flex>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
