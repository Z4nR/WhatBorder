import React, { useState } from 'react';
import FormInputData from '@/components/desktop/create-location/FormInputData';
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
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import EmptyData from '@/components/general/utils/EmptyData';
import GeojsonFormat from '@/components/desktop/create-location/GeojsonFormat';
import { FeatureCollection } from 'geojson';
import MapView from '@/components/desktop/create-location/MapView';
import ManualCoordinateList from '@/components/desktop/create-location/ManualCoordinateList';

const { Title, Text } = Typography;

const layout = {
  labelCol: { span: 8 },
};

const ManualCreateLocationPages: React.FC = () => {
  const [centerPoint, setCenterPoint] = useState<[number, number] | null>(null);
  const [coordinateList, setCoordinateList] = useState<[number, number][]>([]);
  const [geojsonFormat, setGeojsonFormat] = useState<FeatureCollection | null>(
    null
  );

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const isDesktop = useMediaQuery({
    query: '(min-width: 500px)',
  });

  const menuItems = [
    {
      key: '1',
      children: <ManualCoordinateList disable={false} />,
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

              if (allValues.placelat && allValues.placelong) {
                console.log('Updated longlat array:', [
                  allValues.placelat,
                  allValues.placelong,
                ]);
                setCenterPoint([allValues.placelat, allValues.palcelong]);
              }
            }}
            onFinish={onCreate}
          >
            <Row gutter={[16, 16]} wrap>
              <Col xs={24} md={12}>
                <FormInputData disable={false} />
                <Form.Item style={{ marginTop: '1.5rem' }}>
                  <Space
                    align="end"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Button type="primary" htmlType="submit" disabled>
                      Submit
                    </Button>
                    <Button htmlType="button" disabled onClick={onReset}>
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

export default ManualCreateLocationPages;
