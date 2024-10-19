import CoordinateList from '@/components/desktop/create-location/CoordinateList';
import FormInputData from '@/components/desktop/create-location/FormInputData';
import MapView from '@/components/desktop/create-location/MapView';
import { socketConnection } from '@/utils/helper';
import useSocketState from '@/utils/state/client/clientState';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Result,
  Row,
  Space,
  Tabs,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { FileTextOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const layout = {
  labelCol: { span: 8 },
};

interface UpdateCoordinate {
  lat: number;
  long: number;
  client: string;
  desktop: string;
}

const CreateLocationPages: React.FC = () => {
  const [coordinateList, setCoordinateList] = useState<[number, number][]>([]);

  const addRef = useRef<(fieldsValue?: any, index?: number) => void>(() => {});

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const socket = socketConnection();

  const socketStateAdmin = useSocketState();

  useEffect(() => {
    const handleCenterPoint = (data: UpdateCoordinate) => {
      console.log(data);

      if (
        data.client === socketStateAdmin.client &&
        data.desktop === socketStateAdmin.desktop
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
  }, [form, socket, socketStateAdmin.client, socketStateAdmin.desktop]);

  useEffect(() => {
    const handlePlaceCoordinate = (data: UpdateCoordinate) => {
      console.log(data);

      if (
        data.client === socketStateAdmin.client &&
        data.desktop === socketStateAdmin.desktop
      ) {
        setCoordinateList((prevData) => [...prevData, [data.long, data.lat]]);

        if (addRef.current) {
          addRef.current([data.long, data.lat]);
        }
      }
    };

    socket.on('place-coordinate', handlePlaceCoordinate);

    return () => {
      socket.off('place-coordinate', handlePlaceCoordinate);
    };
  }, [socketStateAdmin.client, socketStateAdmin.desktop, socket]);

  console.log(coordinateList);

  const isDesktop = useMediaQuery({
    query: '(min-width: 500px)',
  });

  const onCreate = (values: any) => {
    console.log(values);

    // const data = {
    //   placeName: values.placename,
    //   placeOwner: values.placeowner,
    //   placeDescription: values.placedesc,
    //   placeAddress: values.placeaddress,
    //   placeType: values.placetype,
    //   placePoints: [values.placelat, values.placelong],
    // };
  };

  const onReset = () => {
    form.resetFields();
  };

  const menuItems = [
    {
      key: '1',
      children: <CoordinateList addRef={addRef} />,
      label: (
        <Tooltip title="Daftar Titik Sudut">
          <FileTextOutlined style={{ margin: '0 auto' }} />
        </Tooltip>
      ),
    },
    {
      key: '2',
      children: <MapView />,
      label: (
        <Tooltip title="Tampilan Pada Peta">
          <GlobalOutlined style={{ margin: '0 auto' }} />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          {
            onClick: () => {
              navigate('/');
              socketStateAdmin.clearSocket();
              socket.emit('backto-dashboard', '/');
            },
            title: (
              <Button type="link" className="home-breadcrumb">
                Kembali
              </Button>
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
          <Form
            {...layout}
            form={form}
            layout="vertical"
            name="create_place"
            initialValues={{ remember: true }}
            onFinish={onCreate}
          >
            <Row gutter={[16, 16]} wrap>
              <Col xs={24} md={12}>
                <FormInputData />
              </Col>
              <Col xs={24} md={12}>
                <Card>
                  <Tabs
                    defaultActiveKey="1"
                    centered
                    items={menuItems.map((item) => ({
                      key: item.key,
                      children: item.children,
                      label: item.label,
                    }))}
                  />
                </Card>
              </Col>
            </Row>
            <Form.Item style={{ marginTop: '1.5rem' }}>
              <Space
                align="end"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <Result
          status="404"
          title="Perangkat anda terlalu kecil"
          subTitle="Maaf, halaman yang Anda kunjungi tidak dapat ditampilkan secara baik pada perangkat Anda."
          extra={
            <Text style={{ fontSize: '12px' }}>
              Petunjuk: Buka secara lanskap / coba gunakan perangkat lainnya
            </Text>
          }
        />
      )}
    </>
  );
};

export default CreateLocationPages;
