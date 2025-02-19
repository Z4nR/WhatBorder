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
} from 'antd';
import chroma from 'chroma-js';

const { Title } = Typography;

const generateColorPalette = (baseColor: string) => {
  const baseHSL = chroma(baseColor).hsl();
  const hue = baseHSL[0];
  const saturation = baseHSL[1] * 100; // Convert to percentage
  const baseLightness = baseHSL[2] * 100; // Convert to percentage

  if (saturation < 30 || baseLightness < 30) {
    return null;
  }

  // Generate 5 lighter shades (L1–L5)
  const lighterShades = Array.from({ length: 5 }, (_, i) => {
    const factor = (5 - i) / 5; // Creates a scale from 1 to 0
    return Math.min(92, baseLightness + factor * (92 - baseLightness)); // Prevent exceeding 95%
  });

  // Generate 4 darker shades (L7–L10)
  const darkerShades = Array.from({ length: 4 }, (_, i) => {
    const factor = (i + 1) / 5; // Creates a scale from 0 to 1
    return Math.max(7, baseLightness - factor * (baseLightness - 7)); // Prevent going below 5%
  });

  // Combine lightest to darkest with baseColor in the middle (L6)
  const lightnessLevels = [...lighterShades, baseLightness, ...darkerShades];

  return lightnessLevels.map((l) =>
    chroma.hsl(hue, saturation / 100, l / 100).hex()
  );
};

const PlaceTypeCreate: React.FC = () => {
  const [form] = Form.useForm();

  const [generateColor, setGenerateColor] = useState('#1677ff');
  const generatePalette = generateColorPalette(generateColor);
  const isColorInvalid = !generatePalette;

  const handleLabelChange = (color: string) => {
    if (color) {
      form.setFieldValue('labelupdate', color);
    }
  };

  const handleMapChange = (color: string) => {
    if (color) {
      form.setFieldValue('colorupdate', color);
    }
  };

  const onCreate = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    // Reset form fields to initial values
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
          name="typenamecreate"
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
          <Form.Item label="Warna Label Tempat Terpilih" name="labelupdate">
            <ColorPicker size="small" value={generateColor} showText disabled />
          </Form.Item>
          <Form.Item label="Warna Peta Tempat Terpilih" name="colorupdate">
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
