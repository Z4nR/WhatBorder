import React, { useState } from 'react';
import {
  Input,
  ColorPicker,
  Alert,
  Flex,
  Space,
  Button,
  Form,
  Typography,
  Select,
} from 'antd';
import { BuildingListProps } from '@/utils/types/utils.types';
import { PlaceTypeUpdateProps } from '@/utils/types/admin.types';
import { generateColorPalette } from '@/utils/helper';

const { Title, Text } = Typography;
const { Option } = Select;

const PlaceTypeUpdate: React.FC<{ data: BuildingListProps[] }> = ({ data }) => {
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
      form.setFieldValue('labelupdate', color);
      setSelectedLabelColor(color);
    }
  };

  const handleMapChange = (color: string) => {
    if (color) {
      form.setFieldValue('colorupdate', color);
      setSelectedMapColor(color);
    }
  };

  const handleSelectChange = (value: string) => {
    const selected = data.find(
      (item: BuildingListProps) => item.buildingId === value
    );

    if (selected) {
      form.setFieldsValue({
        nameupdate: selected.name,
        labelupdate: selected.label,
        colorupdate: selected.color,
      });

      setGenerateColor(selected.label);
    }
  };

  const onUpdate = (values: PlaceTypeUpdateProps) => {
    console.log(values);
  };

  const onReset = () => {
    // Reset form fields to initial values
    if (selectedLabelColor !== null || selectedMapColor !== null) {
      setSelectedLabelColor(null);
      setSelectedMapColor(null);
    }
    form.resetFields();
  };

  return (
    <div style={{ minHeight: '500px' }}>
      <Form
        form={form}
        layout="vertical"
        name="place_type_update"
        onFinish={onUpdate}
      >
        <Text>Pilih Jenis Tempat Yang Ingin Diubah : </Text>
        <Select
          style={{ marginBlock: 8, width: '100%' }}
          placeholder="Pilih Jenis Tempat"
          onChange={handleSelectChange}
        >
          {data?.map((item: BuildingListProps) => (
            <Option key={item.buildingId} value={item.buildingId}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Form.Item
          label="Nama Tipe Tempat"
          name="nameupdate"
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
                      selectedLabelColor === color ? 'not-allowed' : 'pointer',
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
              Perbarui
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

export default PlaceTypeUpdate;
