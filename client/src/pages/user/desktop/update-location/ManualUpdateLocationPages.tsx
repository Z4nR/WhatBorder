import React, { useEffect, useState } from 'react';
import MapView from '@/components/desktop/form-location/MapView';
import EmptyData from '@/components/general/utils/EmptyData';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  message,
  Result,
  Row,
  Skeleton,
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
import { useNavigate, useParams } from 'react-router-dom';
import GeojsonFormat from '@/components/desktop/form-location/GeojsonFormat';
import UpdateCoordinateList from '@/components/desktop/form-location/update/UpdateCoordinateList';
import { editPlace, placeDetail } from '@/utils/networks';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  geojsonConstructor,
  geojsonDeconstructor,
} from '@/utils/geojson.template';
import FormData from '@/components/desktop/form-location/FormData';

const { Title, Text } = Typography;

const layout = {
  labelCol: { span: 8 },
};

const ManualUpdateLocationPages: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [centerPoint, setCenterPoint] = useState<[number, number] | null>(null);
  const [coordinateList, setCoordinateList] = useState<[number, number][]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['place-update', id],
    queryFn: async () => await placeDetail(id),
  });

  const [form] = Form.useForm();

  const isDesktop = useMediaQuery({
    query: '(min-width: 500px)',
  });

  const handleFetchData = (data: any) => {
    if (data) {
      const coordinate: [number, number][] = geojsonDeconstructor(
        data?.placeMap.place_geojson
      );
      console.log(coordinate);

      form.setFieldsValue({
        placename: data?.placeName,
        placeowner: data?.placeOwner,
        placeaddress: data?.placeAddress,
        placetype: data?.type.name,
        placedesc: data?.placeDescription,
        placelong: data?.placeCenterPoint?.[1],
        placelat: data?.placeCenterPoint?.[0],
      });

      setCenterPoint(data?.placeCenterPoint);
      setCoordinateList(coordinate);
    }
  };

  useEffect(() => {
    if (data) {
      handleFetchData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, form]);

  const geoJsonData: FeatureCollection | null =
    geojsonConstructor(coordinateList);
  console.log(geoJsonData);

  const menuItems = [
    {
      key: '1',
      children: centerPoint ? (
        <UpdateCoordinateList form={form} initiateValue={coordinateList} />
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
    mutationFn: (v: { id: any; data: any }) => editPlace(v.id, v.data),
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

  type CreateValue = {
    placename: string;
    placeowner: string;
    placedesc: string;
    placeaddress: string;
    placetype: string;
    placelat: number;
    placelong: number;
  };

  const onCreate = (values: CreateValue) => {
    const updateData = Object.fromEntries(
      Object.entries({
        placeName:
          values.placename !== data.placeName ? values.placename : null,
        placeOwner:
          values.placeowner !== data.placeOwner ? values.placeowner : null,
        placeDescription:
          values.placedesc !== data.placeDescription ? values.placedesc : null,
        placeAddress:
          values.placeaddress !== data.placeAddress
            ? values.placeaddress
            : null,
        placeType:
          values.placetype !== data.type?.name ? values.placetype : null,
        placePoints:
          values.placelat !== data.placeCenterPoint?.[0] ||
          values.placelong !== data.placeCenterPoint?.[1]
            ? [values.placelat, values.placelong]
            : null,
        placeGeojson:
          JSON.stringify(geoJsonData) !==
          JSON.stringify(data?.placeMap?.place_geojson)
            ? geoJsonData
            : null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).filter(([_, value]) => value !== null) // Hapus nilai yang tidak berubah
    );

    if (Object.keys(updateData).length === 0) {
      message.info('Tidak ada perubahan data');
      return;
    }

    mutate({ id, data: updateData });
  };

  const onReset = () => {
    // Reset form fields to initial values
    form.resetFields();

    // Call handleFetchData with the necessary data to reset state
    if (data) {
      handleFetchData(data);
    }
    message.info('Form berhasil disetel ulang');
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
                <Skeleton loading={isLoading} active paragraph={{ rows: 5 }}>
                  <FormData disable={false} />
                </Skeleton>
              </Col>
              <Col xs={24} md={12}>
                <Skeleton loading={isLoading} active paragraph={{ rows: 5 }}>
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
                </Skeleton>
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

export default ManualUpdateLocationPages;
