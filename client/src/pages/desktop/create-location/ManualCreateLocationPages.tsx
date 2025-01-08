import React, { useState } from 'react';
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
import {
  FileTextOutlined,
  GlobalOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { FeatureCollection } from 'geojson';
import EmptyData from '@/components/general/utils/EmptyData';
import FormInputData from '@/components/desktop/form-location/FormInputData';
import GeojsonFormat from '@/components/desktop/form-location/GeojsonFormat';
import MapView from '@/components/desktop/form-location/MapView';
import geojsonTemplate from '@/utils/geojson.template';
import { addNewPlace } from '@/utils/networks';
import { useMutation } from '@tanstack/react-query';
import ManualCoordinateList from '@/components/desktop/form-location/create/ManualCoordinateList';

const { Title, Text } = Typography;

const layout = {
  labelCol: { span: 8 },
};

const ManualCreateLocationPages: React.FC = () => {
  const [centerPoint, setCenterPoint] = useState<[number, number] | null>(null);
  const [coordinateList, setCoordinateList] = useState<[number, number][]>([]);

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const isDesktop = useMediaQuery({
    query: '(min-width: 500px)',
  });

  const geoJsonData: FeatureCollection | null = geojsonTemplate(coordinateList);
  console.log(geoJsonData);

  const menuItems = [
    {
      key: '1',
      children: centerPoint ? (
        <ManualCoordinateList form={form} />
      ) : (
        <EmptyData description="Harap Tambahkan Titik Pusat Terlebih Dahulu" />
      ),
      label: (
        <Tooltip title="Daftar Titik Sudut">
          <FileTextOutlined style={{ margin: '0 auto' }} />
        </Tooltip>
      ),
    },
    {
      key: '2',
      children:
        centerPoint && coordinateList.length !== 0 && geoJsonData ? (
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
            Pengaturan Penambahan Tempat Manual
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

              if (allValues.placelat || allValues.placelong) {
                setCenterPoint((prevState) => {
                  if (prevState) {
                    // Ensure exactly two numbers are returned: [number, number]
                    const newLat = allValues.placelat
                      ? Number(allValues.placelat)
                      : prevState[0];
                    const newLong = allValues.placelong
                      ? Number(allValues.placelong)
                      : prevState[1];
                    return [newLat, newLong] as [number, number]; // Explicitly type as [number, number]
                  } else {
                    // If prevState is null, initialize with default values: [number, number]
                    const newCenterPoint: [number, number] = [
                      allValues.placelat ? Number(allValues.placelat) : 0, // Default to 0 if lat is missing
                      allValues.placelong ? Number(allValues.placelong) : 0, // Default to 0 if long is missing
                    ];
                    return newCenterPoint;
                  }
                });
              }
            }}
            onFinish={onCreate}
          >
            <Row gutter={[16, 16]} wrap>
              <Col xs={24} md={12}>
                <FormInputData disable={false} />
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
                  Tambahkan
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  Ulangi
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

export default ManualCreateLocationPages;
