import { socketConnection } from '@/utils/helper';
import { buildingFilter } from '@/utils/networks';
import useSocketState from '@/utils/state/client/clientState';
import { useQuery } from '@tanstack/react-query';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface UpdateCoordinate {
  lat: number;
  long: number;
  client: string;
  desktop: string;
}

const DesktopCreateLocation: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const socket = socketConnection();

  const socketState = useSocketState.useSocketAdminState();

  useEffect(() => {
    const handleCenterPoint = (data: UpdateCoordinate) => {
      console.log(data);

      if (
        data.client === socketState.client &&
        data.desktop === socketState.desktop
      ) {
        form.setFieldsValue({
          placelat: data.lat,
          placelong: data.long,
        });
      }
    };

    socket.on('centerpoint', handleCenterPoint);

    return () => {
      socket.off('centerpoint', handleCenterPoint);
    };
  }, [form, socket, socketState.client, socketState.desktop]);

  const isDesktop = useMediaQuery({
    query: '(min-width: 500px)',
  });

  const building = useQuery({
    queryKey: ['building-filter'],
    queryFn: async () => await buildingFilter(),
  });

  const onCreate = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            onClick: () => navigate('/'),
            title: (
              <Text className="home-breadcrumb" style={{ cursor: 'pointer' }}>
                Kembali
              </Text>
            ),
          },
          {
            title: 'Tambahkan Rincian Tempat',
          },
        ]}
      />
      {isDesktop ? (
        <div>
          <Title level={5} style={{ marginTop: '8px' }}>
            Pengaturan Penambahan Tempat
          </Title>
          <Row gutter={[16, 16]} wrap>
            <Col xs={24} md={12}>
              <Card>
                <Form
                  {...layout}
                  form={form}
                  layout="vertical"
                  name="create_place"
                  className="create-place"
                  initialValues={{ remember: true }}
                  onFinish={onCreate}
                >
                  <Flex gap={'middle'} wrap>
                    <Form.Item
                      label="Nama"
                      name="placename"
                      rules={[
                        {
                          required: true,
                          message: 'Tolong Masukan Nama Tempat!',
                        },
                        {
                          max: 20,
                          message:
                            'Alamat yang anda masukan melebihi 20 karakter',
                        },
                      ]}
                      style={{ flexGrow: 1 }}
                    >
                      <Input placeholder="Nama Tempat" autoComplete="off" />
                    </Form.Item>
                    <Form.Item
                      label="Pemilik"
                      name="placeowner"
                      rules={[
                        {
                          max: 20,
                          message:
                            'Alamat yang anda masukan melebihi 20 karakter',
                        },
                      ]}
                      style={{ flexGrow: 1 }}
                    >
                      <Input placeholder="Pemilik Tempat" autoComplete="off" />
                    </Form.Item>
                  </Flex>
                  <Flex gap={'middle'} wrap>
                    <Form.Item
                      label="Alamat"
                      name="placeaddress"
                      rules={[
                        {
                          required: true,
                          message: 'Tolong Masukan Alamat Tempat!',
                        },
                        {
                          max: 50,
                          message:
                            'Alamat yang anda masukan melebihi 50 karakter',
                        },
                      ]}
                      style={{ flexGrow: 1 }}
                    >
                      <Input placeholder="Alamat Tempat" autoComplete="off" />
                    </Form.Item>
                    <Form.Item
                      label="Jenis"
                      name="placetype"
                      rules={[
                        {
                          required: true,
                          message: 'Tolong Pilih Jenis Tempat!',
                        },
                      ]}
                      style={{ flexGrow: 1 }}
                    >
                      <Select placeholder="Pilih Jenis Tempat" allowClear>
                        {building.data?.map((item: any) => (
                          <Option key={item.buildingId} value={item.buildingId}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Flex>
                  <Form.Item label="Deskripsi" name="placedesc">
                    <TextArea
                      showCount
                      maxLength={100}
                      placeholder="Tambahkan Deskripsi Tempat"
                      style={{ height: 120, resize: 'none' }}
                    />
                  </Form.Item>
                  <Text>Titik Tengah Tempat</Text>
                  <Flex gap={'middle'} wrap>
                    <Form.Item
                      label="Latitude"
                      name="placelat"
                      rules={[
                        {
                          required: true,
                          message: 'Data koordinat latitude tidak boleh kosong',
                        },
                      ]}
                      style={{ flexGrow: 1 }}
                    >
                      <Input placeholder="Latitude" disabled />
                    </Form.Item>
                    <Form.Item
                      label="Longitude"
                      name="placelong"
                      rules={[
                        {
                          required: true,
                          message:
                            'Data koordinat longitude tidak boleh kosong',
                        },
                      ]}
                      style={{ flexGrow: 1 }}
                    >
                      <Input placeholder="Longitude" disabled />
                    </Form.Item>
                  </Flex>
                  <Form.Item {...tailLayout}>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                      <Button htmlType="button" onClick={onReset}>
                        Reset
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <MapContainer
                  center={[-1.2480891, 118]}
                  zoom={4}
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
        </div>
      ) : (
        <Empty
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
          description={
            <Text>
              Maaf ukuran layar terlalu kecil. <br /> Harap gunakan layar ukuran
              lebih besar untuk proses lebih optimal.
            </Text>
          }
        />
      )}
    </>
  );
};

export default DesktopCreateLocation;
