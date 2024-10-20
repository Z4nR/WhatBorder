import { socketConnection } from '@/utils/helper';
import { Button, Card, Flex, Typography, Spin } from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

interface SocketConnect {
  client: string;
  desktop: string;
}

const AddCenterPoint: React.FC<SocketConnect> = ({ client, desktop }) => {
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [loading, setLoading] = useState(false);
  const [usingCoordinate, setUsingCoordinate] = useState(true);

  const socket = socketConnection();

  const findCoordinate = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLong(longitude);
        setUsingCoordinate(false);
        setLoading(false);
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      },
      (error) => {
        setLoading(false);
        console.error(`Error getting location: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );
  };

  return (
    <Card>
      <Text style={{ fontWeight: 'bold' }}>Tambahkan Titik Pusat Tempat</Text>
      <Button
        style={{ marginTop: '1rem', width: '100%' }}
        onClick={findCoordinate}
        disabled={loading}
      >
        {loading ? <Spin /> : 'Cari Titik Pusat'}
      </Button>
      <Flex style={{ paddingBlock: '1rem' }} gap={'small'} vertical>
        <Text>Latitude: {lat}</Text>
        <Text>Longitude: {long}</Text>
      </Flex>
      <Button
        disabled={usingCoordinate}
        style={{ width: '100%' }}
        onClick={() => {
          socket.emit('set-centerpoint', {
            lat: lat,
            long: long,
            client: client,
            desktop: desktop,
          });

          setUsingCoordinate(true);
        }}
      >
        Gunakan Koordinat
      </Button>
    </Card>
  );
};

export default AddCenterPoint;
