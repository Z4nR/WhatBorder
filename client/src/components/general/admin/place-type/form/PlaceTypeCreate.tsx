import React, { useState } from 'react';
import {
  ColorPicker,
  Form,
  Input,
  Typography,
  Alert,
  Flex,
  Button,
  Space,
  message,
} from 'antd';
import { PlaceTypeCreateProps } from '@/utils/types/admin.types';
import { generateColorPalette } from '@/utils/helper';
import { adminNewPlaceType } from '@/utils/networks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const { Title } = Typography;

const PlaceTypeCreate: React.FC = () => {
  const client = useQueryClient();

  const [form] = Form.useForm();

  const [generateColor, setGenerateColor] = useState('#1677ff');
  const generatePalette = generateColorPalette(generateColor);
  const isColorInvalid = !generatePalette;

  const [selectedLabelColor, setSelectedLabelColor] = useState<string | null>(
    null
  );
  const [selectedMapColor, setSelectedMapColor] = useState<string | null>(null);

  const handleLabelChange = (color: string) => {
    if (color) {
      form.setFieldValue('labelcreate', color);
      setSelectedLabelColor(color);
    }
  };

  const handleMapChange = (color: string) => {
    if (color) {
      form.setFieldValue('colorcreate', color);
      setSelectedMapColor(color);
    }
  };

  const { mutate } = useMutation({
    mutationFn: adminNewPlaceType,
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ['building-list'] });
      message.open({
        type: 'success',
        content: data,
        duration: 3,
      });

      form.resetFields();
      setSelectedLabelColor(null);
      setSelectedMapColor(null);
      setGenerateColor('#1677ff');
    },
    onError: (error: any) => {
      message.open({
        type: 'error',
        content: error.response.data.message,
        duration: 5,
      });
    },
  });

  const onCreate = (values: PlaceTypeCreateProps) => {
    const data = {
      name: values.namecreate,
      color: values.colorcreate,
      label: values.labelcreate,
    };

    mutate(data);
  };

  const onReset = () => {
    // Reset form fields to initial values
    setSelectedLabelColor(null);
    setSelectedMapColor(null);
    form.resetFields();
  };

  return (
    <div style={{ minHeight: '500px' }}>
      <Form
        form={form}
        layout="vertical"
        name="place_type_create"
        onFinish={onCreate}
      >
        <Form.Item
          label="Nama Tipe Tempat"
          name="namecreate"
          rules={[{ required: true, message: 'Nama Tipe Tempat wajib diisi' }]}
        >
          <Input placeholder="Masukkan nama tipe tempat" />
        </Form.Item>
        <div style={{ marginBottom: 16 }}>
          <ColorPicker
            style={{ marginBottom: 8 }}
            value={generateColor}
            onChange={(color) => setGenerateColor(color.toHexString())}
            showText
            disabledAlpha
          />
          <Title level={5}>Tentukan Warna Dasar Label</Title>

          {isColorInvalid && (
            <Alert
              message="Pilih warna dengan brightness lebih tinggi dari 30 dan saturation lebih tinggi dari 30!"
              type="warning"
              showIcon
            />
          )}

          {!isColorInvalid && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                marginBottom: 16,
                gap: '2px',
              }}
            >
              {generatePalette.map((color, index) => (
                <div
                  className="color-palette-box"
                  key={index}
                  style={{
                    backgroundColor: color,
                    color: index < 5 ? 'black' : 'white',
                    fontWeight: index === 5 ? 'bold' : 'normal',
                    opacity: selectedMapColor === color ? 0.5 : 1, // Disable if already selected in Map
                    cursor:
                      selectedMapColor === color ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => handleLabelChange(color)}
                >
                  <span style={{ fontSize: '10px', fontWeight: 'bold' }}>
                    L-{index + 1}
                  </span>
                  <span
                    className="color-palette-code"
                    style={{ fontSize: '12px' }}
                  >
                    {color.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Title level={5}>Tentukan Warna Dasar Peta</Title>
          {isColorInvalid && (
            <Alert
              message="Pilih warna dengan brightness lebih tinggi dari 30 dan saturation lebih tinggi dari 30!"
              type="warning"
              showIcon
            />
          )}

          {!isColorInvalid && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
              {generatePalette.map((color, index) => (
                <div
                  className="color-palette-box"
                  key={index}
                  style={{
                    backgroundColor: color,
                    color: index < 5 ? 'black' : 'white',
                    fontWeight: index === 5 ? 'bold' : 'normal',
                    opacity: selectedLabelColor === color ? 0.5 : 1, // Disable if already selected in Label
                    cursor:
                      selectedLabelColor === color ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => handleMapChange(color)}
                >
                  <span style={{ fontSize: '10px', fontWeight: 'bold' }}>
                    L-{index + 1}
                  </span>
                  <span
                    className="color-palette-code"
                    style={{ fontSize: '12px' }}
                  >
                    {color.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Flex justify="space-around">
          <Form.Item label="Warna Label Tempat Terpilih" name="labelcreate">
            <ColorPicker size="small" value={generateColor} showText disabled />
          </Form.Item>
          <Form.Item label="Warna Peta Tempat Terpilih" name="colorcreate">
            <ColorPicker size="small" value={generateColor} showText disabled />
          </Form.Item>
        </Flex>
        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'end' }}>
            <Button type="primary" htmlType="submit">
              Simpan
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Ulangi
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PlaceTypeCreate;
