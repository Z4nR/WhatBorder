import CoordinateList from '@/components/desktop/create-location/CoordinateList';
import FormInputData from '@/components/desktop/create-location/FormInputData';
import MapView from '@/components/desktop/create-location/MapView';
import { socketConnection } from '@/utils/helper';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  message,
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
import {
  FileTextOutlined,
  GlobalOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { FeatureCollection } from 'geojson';
import EmptyData from '@/components/general/utils/EmptyData';
import GeojsonFormat from '@/components/desktop/create-location/GeojsonFormat';
import { useMutation } from '@tanstack/react-query';
import { addNewPlace } from '@/utils/networks';
import useSocketState from '@/utils/state/clientState';
import { UpdateCoordinateProps } from '@/utils/types/map.types';

const { Title, Text } = Typography;

const layout = {
  labelCol: { span: 8 },
};

const CreateLocationIntegratedPages: React.FC = () => {
  const [centerPoint, setCenterPoint] = useState<[number, number] | null>(null);
  const [coordinateList, setCoordinateList] = useState<[number, number][]>([]);
  const [geojsonFormat, setGeojsonFormat] = useState<FeatureCollection | null>(
    null
  );

  const addRef = useRef<(fieldsValue?: any, index?: number) => void>(() => {});

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const socket = socketConnection();

  const socketStateAdmin = useSocketState();

  const isDesktop = useMediaQuery({
    query: '(min-width: 500px)',
  });

  useEffect(() => {
    const handleCenterPoint = (data: UpdateCoordinateProps) => {
      console.log(data);

      if (
        data.client === socketStateAdmin.client &&
        data.desktop === socketStateAdmin.desktop
      ) {
        setCenterPoint([data.lat, data.long]);
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
    const handlePlaceCoordinate = (data: UpdateCoordinateProps) => {
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

  const menuItems = [
    {
      key: '1',
      children: <CoordinateList addRef={addRef} disable={true} />,
      label: (
        <Tooltip title="Daftar Titik Sudut">
          <FileTextOutlined style={{ margin: '0 auto' }} />
        </Tooltip>
      ),
    },
    {
      key: '2',
      children:
        centerPoint && coordinateList.length !== 0 ? (
          <MapView
            centerPoint={centerPoint}
            mapData={coordinateList}
            setGeojsonFormat={setGeojsonFormat}
          />
        ) : (
          <EmptyData description="Lokasi Belum Ditentukan" />
        ),
      label: (
        <Tooltip title="Tampilan Pada Peta">
          <GlobalOutlined style={{ margin: '0 auto' }} />
        </Tooltip>
      ),
    },
    {
      key: '3',
      children:
        geojsonFormat !== null ? (
          <GeojsonFormat initialJson={geojsonFormat} />
        ) : (
          <EmptyData description="Lokasi Belum Ditentukan" />
        ),
      label: (
        <Tooltip title="Tampilan File GeoJSON">
          <CodeOutlined style={{ margin: '0 auto' }} />
        </Tooltip>
      ),
    },
  ];

  const { mutateAsync } = useMutation({
    mutationFn: addNewPlace,
    onSuccess: (data) => {
      message.open({
        type: 'success',
        content: data.message,
        duration: 3,
      });
    },
    onError: (error: any) => {
      message.open({
        type: 'error',
        content: error.response.data.message,
        duration: 5,
      });
    },
  });

  const onCreate = (values: any) => {
    const data = {
      placeName: values.placename,
      placeOwner: values.placeowner,
      placeDescription: values.placedesc,
      placeAddress: values.placeaddress,
      placeType: values.placetype,
      placePoints: [values.placelat, values.placelong],
      placeGeojson: geojsonFormat,
    };
    console.log(data);

    mutateAsync(data);
  };

  const onReset = () => {
    form.resetFields();
  };

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
            onValuesChange={(allValues) => {
              if (allValues.longlat) {
                console.log('Updated longlat array:', allValues.longlat);
                setCoordinateList(allValues.longlat);
              }
            }}
            onFinish={onCreate}
          >
            <Row gutter={[16, 16]} wrap>
              <Col xs={24} md={12}>
                <FormInputData disable={true} />
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

export default CreateLocationIntegratedPages;
