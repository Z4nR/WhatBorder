import { socketConnection } from '@/utils/helper';
import { Row, Col, Card, Button, Flex, Typography } from 'antd';
import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const { Text } = Typography;

interface SocketConnect {
  client: string;
  desktop: string;
}

const AddPlacePattern: React.FC<SocketConnect> = ({ client, desktop }) => {
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
    <Row gutter={[16, 16]} wrap>
      <Col xs={24} md={12}>
        <Card>
          <Text>Tambahkan Titik Sudut Batas Tempat</Text>
          <Button
            style={{ marginTop: '1rem', width: '100%' }}
            onClick={findCoordinate}
            disabled={loading}
          >
            Cari Titik Sudut Batas
          </Button>
          <Flex style={{ paddingBlock: '1rem' }} gap={'small'} vertical>
            <Text>Longitude: {long}</Text>
            <Text>Latitude: {lat}</Text>
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
            Pakai Koordinat
          </Button>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card>
          <MapContainer
            center={[-1.2480891, 118]}
            zoom={8}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        </Card>
      </Col>
    </Row>
  );
};

export default AddPlacePattern;
