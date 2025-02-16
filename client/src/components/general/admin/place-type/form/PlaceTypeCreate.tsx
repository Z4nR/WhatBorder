import React, { useState } from 'react';
import {
  Card,
  ColorPicker,
  Form,
  Input,
  Typography,
  Alert,
  Flex,
  Button,
  Space,
} from 'antd';
import chroma from 'chroma-js';

const { Title } = Typography;

const generateColorPalette = (baseColor: string) => {
  const baseHSL = chroma(baseColor).hsl();
  const hue = baseHSL[0];
  const saturation = baseHSL[1] * 100; // Convert to percentage
  const baseLightness = baseHSL[2] * 100; // Convert to percentage

  if (saturation < 70 && baseLightness < 70) return null; // Block generation if both are < 70

  const lightnessLevels = [
    95.1,
    82.94,
    75.1,
    67.06,
    56.67,
    baseLightness,
    38.04,
    30.59,
    22.94,
    15.49,
  ];

  return lightnessLevels.map((l, index) =>
    index === 5 ? baseColor : chroma.hsl(hue, saturation / 100, l / 100).hex()
  );
};

const PlaceTypeCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [labelColor, setLabelColor] = useState('#1677ff');
  const [mapColor, setMapColor] = useState('#1677ff');

  const labelPalette = generateColorPalette(labelColor);
  const mapPalette = generateColorPalette(mapColor);

  const isLabelInvalid = !labelPalette;
  const isMapInvalid = !mapPalette;

  const onReset = () => {
    // Reset form fields to initial values
    form.resetFields();
  };

  return (
    <Card style={{ minHeight: '500px' }}>
      <Title level={4}>Tambah / Ubah Tipe Tempat</Title>
      <Form form={form} layout="vertical" name="place_type_form">
        <Form.Item
          label="Nama Tipe Tempat"
          name="placename"
          rules={[{ required: true, message: 'Nama Tipe Tempat wajib diisi' }]}
        >
          <Input placeholder="Masukkan nama tipe tempat" />
        </Form.Item>

        <div style={{ marginBottom: 16 }}>
          <Title level={5}>Tentukan Warna Dasar Label</Title>
          <ColorPicker
            style={{ marginBottom: 8 }}
            value={labelColor}
            onChange={(color) => setLabelColor(color.toHexString())}
            showText
            disabledAlpha
          />

          {isLabelInvalid && (
            <Alert
              message="Pilih warna dengan brightness dan saturation lebih tinggi dari 70!"
              type="warning"
              showIcon
            />
          )}

          {!isLabelInvalid && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                marginBottom: 16,
                gap: '2px',
              }}
            >
              {labelPalette.map((color, index) => (
                <div
                  className="color-palette-box"
                  key={index}
                  style={{
                    backgroundColor: color,
                    color: index < 5 ? 'black' : 'white',
                    fontWeight: index === 5 ? 'bold' : 'normal',
                  }}
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

        <div style={{ marginBottom: 16 }}>
          <Title level={5}>Tentukan Warna Dasar Peta</Title>
          <ColorPicker
            style={{ marginBottom: 8 }}
            value={mapColor}
            onChange={(color) => setMapColor(color.toHexString())}
            showText
            disabledAlpha
          />

          {isMapInvalid && (
            <Alert
              message="Pilih warna dengan brightness dan saturation lebih tinggi dari 70!"
              type="warning"
              showIcon
            />
          )}

          {!isMapInvalid && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
              {mapPalette.map((color, index) => (
                <div
                  className="color-palette-box"
                  key={index}
                  style={{
                    backgroundColor: color,
                    color: index < 5 ? 'black' : 'white',
                    fontWeight: index === 5 ? 'bold' : 'normal',
                  }}
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
          <Form.Item label="Warna Label Tempat Terpilih" name="label">
            <ColorPicker size="small" value={labelColor} showText disabled />
          </Form.Item>
          <Form.Item label="Warna Peta Tempat Terpilih" name="color">
            <ColorPicker size="small" value={labelColor} showText disabled />
          </Form.Item>
        </Flex>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'end' }}>
            <Button type="primary" htmlType="submit">
              Perbarui
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Ulangi
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PlaceTypeCreate;
