import React from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Typography } from 'antd';

const { Text } = Typography;

interface AddRef {
  addRef: React.MutableRefObject<(fieldsValue?: any, index?: number) => void>;
}

const CoordinateList: React.FC<AddRef> = ({ addRef }) => {
  return (
    <>
      <Text>Titik Koordinat Batas Tempat (Longitude, Latitude)</Text>
      <Form.List
        name="longlat"
        rules={[
          {
            validator: async (_, latlong) => {
              if (!latlong || latlong.length < 3) {
                return Promise.reject(
                  new Error('Setidaknya Masukkan Tiga Titik Koordinat')
                );
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => {
          addRef.current = add;

          return (
            <>
              {fields.map((field) => (
                <Form.Item
                  style={{ marginBottom: 0 }}
                  required={true}
                  key={field.name}
                >
                  <Flex
                    gap={'middle'}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 0]} // First part of the coordinate
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          message: 'Please input the longitude.',
                        },
                      ]}
                      style={{ width: '100%', marginBottom: 0 }}
                      key={`${field.key}-longitude`}
                    >
                      <Input
                        placeholder="Longitude"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 1]} // Second part of the coordinate
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          message: 'Please input the latitude.',
                        },
                      ]}
                      style={{ width: '100%', marginBottom: 0 }}
                      key={`${field.key}-latitude`}
                    >
                      <Input placeholder="Latitude" style={{ width: '100%' }} />
                    </Form.Item>

                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Flex>
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '60%', marginTop: '10px' }}
                  icon={<PlusOutlined />}
                >
                  Add field
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          );
        }}
      </Form.List>
    </>
  );
};

export default CoordinateList;
