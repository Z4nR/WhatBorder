import useSocketState from '@/utils/state/client/clientState';
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography } from 'antd';
import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { socketConnection } from '@/utils/helper';

const { Title, Text } = Typography;

const ClientAddCoordinate: React.FC = () => {
  const navigate = useNavigate();
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [usingCoordinate, setUsingCoordinate] = useState(false);

  const socket = socketConnection();
  const socketState = useSocketState.useSocketClientState();

  const findCoordinate = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLong(longitude);
        setUsingCoordinate(true);
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      },
      (error) => {
        console.error(`Error getting location: ${error.message}`);
      }
    );
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            onClick: () => navigate('/'),
            title: <Text className="home-breadcrumb">Kembali</Text>,
          },
          {
            title: 'Tambahkan Koordinat',
          },
        ]}
      />
      <Title level={5} style={{ marginTop: '8px' }}>
        Pengaturan Koordinat
      </Title>
      <Row gutter={[16, 16]} wrap>
        <Col xs={24} md={12}>
          <Card>
            <Text style={{ fontWeight: 'bold' }}>
              Tambahkan Titik Pusat Tempat
            </Text>
            <Button
              style={{ marginTop: '1rem', width: '100%' }}
              onClick={findCoordinate}
            >
              Cari Titik Pusat
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
                  client: socketState.client,
                  desktop: socketState.desktop,
                });

                setUsingCoordinate(false);
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
    </>
  );
};

export default ClientAddCoordinate;
