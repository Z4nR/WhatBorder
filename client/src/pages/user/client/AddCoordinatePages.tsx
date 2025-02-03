import React, { useEffect, useState } from 'react';
import { Button, Space, Steps, Typography } from 'antd';
import { socketConnection } from '@/utils/helper';
import { useNavigate } from 'react-router-dom';
import useSocketState from '@/utils/state/clientState';
import AddCenterPoint from '@/components/client/create-location/AddCenterPoint';
import AddPlacePattern from '@/components/client/create-location/AddPlacePattern';

const { Title } = Typography;

const AddCoordinatePages: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const socket = socketConnection();
  const socketStateClient = useSocketState();

  useEffect(() => {
    const handleNavigate = (data: string) => {
      console.log(data);

      if (data) {
        socketStateClient.clearSocket();
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
          client={socketStateClient.client}
          desktop={socketStateClient.desktop}
        />
      ),
    },
    {
      title: 'Pola Tempat',
      content: (
        <AddPlacePattern
          client={socketStateClient.client}
          desktop={socketStateClient.desktop}
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

export default AddCoordinatePages;
