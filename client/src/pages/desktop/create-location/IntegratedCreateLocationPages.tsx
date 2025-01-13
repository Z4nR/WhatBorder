import React, { useEffect, useRef, useState } from 'react';
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
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import {
  FileTextOutlined,
  GlobalOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { FeatureCollection } from 'geojson';
import EmptyData from '@/components/general/utils/EmptyData';
import MapView from '@/components/desktop/form-location/MapView';
import GeojsonFormat from '@/components/desktop/form-location/GeojsonFormat';
import { useMutation } from '@tanstack/react-query';
import { socketConnection } from '@/utils/helper';
import { addNewPlace } from '@/utils/networks';
import useSocketState from '@/utils/state/clientState';
import { UpdateCoordinateProps } from '@/utils/types/map.types';
import IntegratedCoordinateList from '@/components/desktop/form-location/create/IntegratedCoordinateList';
import { geojsonConstructor } from '@/utils/geojson.template';
import FormData from '@/components/desktop/form-location/FormData';

const { Title, Text } = Typography;

const layout = {
  labelCol: { span: 8 },
};

const IntegratedCreateLocationPages: React.FC = () => {
  const [centerPoint, setCenterPoint] = useState<[number, number] | null>(null);
  const [coordinateList, setCoordinateList] = useState<[number, number][]>([]);

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
        //Set center point when map is open and set form value base on socket data
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
        //When data receive from socket it will update the coordinate list
        setCoordinateList((prevData) => [...prevData, [data.long, data.lat]]);

        if (addRef.current) {
          //add reference data to current reference to update in coordinate list
          addRef.current([data.long, data.lat]);
        }
      }
    };

    socket.on('place-coordinate', handlePlaceCoordinate);

    return () => {
      socket.off('place-coordinate', handlePlaceCoordinate);
    };
  }, [socketStateAdmin.client, socketStateAdmin.desktop, socket]);

  const geoJsonData: FeatureCollection | null =
    geojsonConstructor(coordinateList);
  console.log(geoJsonData);

  const menuItems = [
    {
      key: '1',
      children: <IntegratedCoordinateList addRef={addRef} />,
      label: (
        <Tooltip title="Daftar Titik Sudut">
          <FileTextOutlined style={{ margin: '0 auto' }} />
        </Tooltip>
      ),
    },
    {
      key: '2',
      children:
        centerPoint && coordinateList.length > 0 && geoJsonData ? (
          <MapView centerPoint={centerPoint} mapData={geoJsonData} />
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
        geoJsonData !== null ? (
          <GeojsonFormat initialJson={geoJsonData} />
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

  const { mutate } = useMutation({
    mutationFn: addNewPlace,
    onSuccess: (data) => {
      message.open({
        type: 'success',
        content: data,
        duration: 3,
      });
      navigate(-1);
      socketStateAdmin.clearSocket();
      socket.emit('backto-dashboard', '/');
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
      placeGeojson: geoJsonData,
    };
    console.log(data);

    mutate(data);
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
              navigate(-1);
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
            Pengaturan Penambahan Tempat Terintegrasi
          </Title>
          <Form
            {...layout}
            form={form}
            layout="vertical"
            name="create_place"
            onValuesChange={(allValues) => {
              if (allValues.longlat) {
                console.log('Updated longlat array:', allValues.longlat);

                //Update the coordinate list when user update the array of coordinate
                setCoordinateList(allValues.longlat);
              }
            }}
            onFinish={onCreate}
          >
            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'end' }}>
                <Button type="primary" htmlType="submit">
                  Perbarui
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  Ulangi
                </Button>
              </Space>
            </Form.Item>
            <Row gutter={[16, 16]} wrap>
              <Col xs={24} md={12}>
                <FormData disable={true} />
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

export default IntegratedCreateLocationPages;
