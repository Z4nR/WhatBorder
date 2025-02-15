import { Card, ColorPicker, Form, Input, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const PlaceTypeForm: React.FC = () => {
  const [form] = Form.useForm();
  return (
    <Card style={{ height: '500px' }}>
      <Title level={4}>Tambah / Ubah Tipe Tempat</Title>
      <Form form={form} layout="vertical" name="place_type_form">
        <Form.Item label="Nama Tipe Tempat" name="placename">
          <Input placeholder="Nama Tipe Tempat" />
        </Form.Item>
        <Form.Item label="Warna Label Tempat" name="label">
          <ColorPicker defaultValue="#1677ff" showText />
        </Form.Item>
        <Form.Item label="Warna Peta Tempat" name="color">
          <ColorPicker defaultValue="#1677ff" showText />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PlaceTypeForm;
