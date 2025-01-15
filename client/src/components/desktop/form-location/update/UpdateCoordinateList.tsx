import React, { useEffect, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Form, FormInstance, Input, Typography } from 'antd';
import UpdateCoordinateField from './UpdateCoordinateField';

const { Text } = Typography;

const UpdateCoordinateList: React.FC<{
  form: FormInstance;
  initiateValue: [number, number][] | null;
}> = ({ form, initiateValue }) => {
  const addRef = useRef<(fieldsValue?: any, index?: number) => void>();

  // Set initial values for Form.List from initiateValue
  useEffect(() => {
    if (initiateValue) {
      const formattedValues = initiateValue.map(([long, lat]) => ({
        long,
        lat,
      }));
      form.setFieldsValue({ longlat: formattedValues });
    }
  }, [initiateValue, form]);

  const handleRef = () => {
    const values = form.getFieldsValue(['longmanual', 'latmanual']);
    console.log('Longitude:', Number(values.longmanual));
    console.log('Latitude:', Number(values.latmanual));

    // Add new coordinate to the Form.List
    if (addRef.current) {
      addRef.current({
        long: Number(values.longmanual),
        lat: Number(values.latmanual),
      });
    }
  };

  return (
    <div style={{ height: '63vh', overflowY: 'scroll' }}>
      <Text>Titik Koordinat Batas Tempat (Longitude, Latitude)</Text>
      <Form.Item style={{ marginBottom: 0 }} required={true}>
        <Flex gap={'middle'} style={{ width: '100%', marginTop: '0.5rem' }}>
          <Form.Item
            name="longmanual"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                pattern: /^-?\d+\.\d+$/,
                message: 'Masukkan format angka yang valid',
              },
            ]}
            style={{ width: '100%', marginBottom: 0 }}
          >
            <Input placeholder="Longitude" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="latmanual"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                pattern: /^-?\d+\.\d+$/,
                message: 'Masukkan format angka yang valid',
              },
            ]}
            style={{ width: '100%', marginBottom: 0 }}
          >
            <Input placeholder="Latitude" style={{ width: '100%' }} />
          </Form.Item>
        </Flex>
      </Form.Item>
      <Form.Item>
        <Button
          type="dashed"
          onClick={() => handleRef()}
          style={{ width: '60%', marginTop: '10px' }}
          icon={<PlusOutlined />}
        >
          Tambah Koordinat
        </Button>
      </Form.Item>
      <Form.List
        name="longlat"
        rules={[
          {
            validator: async (_, longlat) => {
              if (!longlat || longlat.length < 3) {
                return Promise.reject(
                  new Error('Setidaknya Masukkan Tiga Titik Koordinat')
                );
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }) => {
          addRef.current = add;
          return (
            <>
              {fields.map((field) => (
                <UpdateCoordinateField
                  key={field.key}
                  fields={fields}
                  field={field}
                  remove={remove}
                  lat={form.getFieldValue(['longlat', field.name, 'lat'])}
                  long={form.getFieldValue(['longlat', field.name, 'long'])}
                />
              ))}
            </>
          );
        }}
      </Form.List>
    </div>
  );
};

export default UpdateCoordinateList;
