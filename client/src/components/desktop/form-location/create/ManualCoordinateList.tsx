import React, { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Form, FormInstance, Input, Typography } from 'antd';
import CreateCoordinateField from './CreateCoordinateField';

const { Text } = Typography;

const ManualCoordinateList: React.FC<{ form: FormInstance }> = ({ form }) => {
  const addRef = useRef<(fieldsValue?: any, index?: number) => void>();

  const handleRef = () => {
    const values = form.getFieldsValue(['longmanual', 'latmanual']);
    console.log('Longitude:', Number(values.longmanual));
    console.log('Latitude:', Number(values.latmanual));

    if (addRef.current) {
      addRef.current([Number(values.longmanual), Number(values.latmanual)]);
    }
  };

  return (
    <>
      <Text>Titik Koordinat Batas Tempat (Longitude, Latitude)</Text>
      <Form.Item style={{ marginBottom: 0 }} required={true}>
        <Flex gap={'middle'} style={{ width: '100%', marginTop: '0.5rem' }}>
          <Form.Item
            name="longmanual"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                required: true,
                message: 'Harap masukkan nilai longitude.',
              },
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
                required: true,
                message: 'Harap masukkan nilai latitude.',
              },
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
      <div style={{ maxHeight: '60vh', overflowY: 'scroll' }}>
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
                  <CreateCoordinateField
                    key={field.key}
                    fields={fields}
                    field={field}
                    remove={remove}
                  />
                ))}
              </>
            );
          }}
        </Form.List>
      </div>
    </>
  );
};

export default ManualCoordinateList;
