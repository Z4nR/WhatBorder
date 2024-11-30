import React, { useState } from 'react';
import { socketConnection } from '@/utils/helper';
import { Row, Col, Card, Button, Flex, Typography, Spin } from 'antd';
import MapPositionPreview from './MapPositionPreview';
import { SocketConnectProps } from '@/utils/types/map.types';

const { Text } = Typography;

const AddPlacePattern: React.FC<SocketConnectProps> = ({ client, desktop }) => {
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [loading, setLoading] = useState(false);
  const [usingCoordinate, setUsingCoordinate] = useState(true);
  const [position, setPosition] = useState<[number, number] | null>(null);

  const socket = socketConnection();

  const findCoordinate = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLong(longitude);
        setPosition([latitude, longitude]);
        setUsingCoordinate(false);
        setLoading(false);
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error('User denied the request for Geolocation.');
            break;
          case error.POSITION_UNAVAILABLE:
            console.error('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            console.error('The request to get user location timed out.');
            break;
          default:
            console.error('An unknown error occurred.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Row gutter={[16, 16]} wrap>
      <Col xs={24} md={12}>
        <Card>
          <Text>Tambahkan Titik Sudut Batas Tempat</Text>
          <Button
            style={{ marginTop: '1rem', width: '100%' }}
            onClick={findCoordinate}
            disabled={loading}
          >
            {loading ? <Spin /> : 'Cari Titik Sudut Batas'}
          </Button>
          <Flex style={{ paddingBlock: '1rem' }} gap={'small'} vertical>
            <Text>Longitude: {long}</Text>
            <Text>Latitude: {lat}</Text>
          </Flex>
          <Button
            disabled={usingCoordinate}
            style={{ width: '100%' }}
            onClick={() => {
              socket.emit('set-place-coordinate', {
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
      </Col>
      <Col xs={24} md={12}>
        <MapPositionPreview
          position={position}
          setPosition={setPosition}
          setLat={setLat}
          setLong={setLong}
        />
      </Col>
    </Row>
  );
};

export default AddPlacePattern;
