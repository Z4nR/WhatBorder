import { Button, message, Space, Steps, Typography } from 'antd';
import AddCenterPoint from './AddCenterPoint';
import React, { useEffect, useState } from 'react';
import AddPlacePattern from './AddPlacePattern';
import { socketConnection } from '@/utils/helper';
import useSocketState from '@/utils/state/client/clientState';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ClientAddCoordinate: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const socket = socketConnection();
  const socketState = useSocketState.useSocketClientState();

  useEffect(() => {
    const handleNavigate = (data: string) => {
      console.log(data);

      if (data) {
        socketState.clearSocket();
        navigate(data);
      }
    };

    socket.on('navigateto-dashboard', handleNavigate);

    return () => {
      socket.off('navigateto-dashboard', handleNavigate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: 'Titik Pusat',
      content: (
        <AddCenterPoint
          client={socketState.client}
          desktop={socketState.desktop}
        />
      ),
    },
    {
      title: 'Pola Tempat',
      content: (
        <AddPlacePattern
          client={socketState.client}
          desktop={socketState.desktop}
        />
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <>
      <Title level={5} style={{ marginTop: '8px' }}>
        Pengaturan Koordinat
      </Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Steps
          style={{ marginBottom: '0.75rem' }}
          responsive={false}
          current={current}
          items={items}
        />
        <div>{steps[current].content}</div>
        <div style={{ marginTop: 24 }}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Lanjut
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success('Processing complete!')}
            >
              Selesai
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Kembali
            </Button>
          )}
        </div>
      </Space>
    </>
  );
};

export default ClientAddCoordinate;
