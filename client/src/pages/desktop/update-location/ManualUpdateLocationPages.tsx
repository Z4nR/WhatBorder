import React, { useState } from 'react';
import FormInputData from '@/components/desktop/form-location/FormInputData';
import MapView from '@/components/desktop/form-location/MapView';
import EmptyData from '@/components/general/utils/EmptyData';
import geojsonTemplate from '@/utils/geojson.template';
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
import {
  FileTextOutlined,
  GlobalOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { FeatureCollection } from 'geojson';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import GeojsonFormat from '@/components/desktop/form-location/GeojsonFormat';
import UpdateCoordinateList from '@/components/desktop/form-location/update/UpdateCoordinateList';

const { Title, Text } = Typography;

const layout = {
  labelCol: { span: 8 },
};

const ManualUpdateLocationPages: React.FC = () => {
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
        <UpdateCoordinateList form={form} />
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
            title: 'Perbarui Rincian Tempat',
          },
        ]}
      />
      {isDesktop ? (
        <div>
          <Title level={5} style={{ marginTop: '8px' }}>
            Pengaturan Pembaharuan Tempat Manual
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
                  Perbarui
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

export default ManualUpdateLocationPages;
