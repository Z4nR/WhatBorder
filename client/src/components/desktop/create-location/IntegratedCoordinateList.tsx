import React from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Typography } from 'antd';
import { IntegratedCoordinateListProps } from '@/utils/types/utils.types';

const { Text } = Typography;

const IntegratedCoordinateList: React.FC<IntegratedCoordinateListProps> = ({
  addRef,
  disable,
}) => {
  return (
    <>
      <Text>Titik Koordinat Batas Tempat (Longitude, Latitude)</Text>
      <div
        style={{ minHeight: '15.2vh', maxHeight: '60vh', overflowY: 'scroll' }}
      >
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
                            message: 'Harap masukkan nilai longitude.',
                          },
                        ]}
                        style={{ width: '100%', marginBottom: 0 }}
                        key={`${field.key}-integrated-longitude`}
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
                            message: 'Harap masukkan nilai latitude.',
                          },
                        ]}
                        style={{ width: '100%', marginBottom: 0 }}
                        key={`${field.key}-integrated-latitude`}
                      >
                        <Input
                          placeholder="Latitude"
                          style={{ width: '100%' }}
                        />
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
                {!disable && (
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
                )}
              </>
            );
          }}
        </Form.List>
      </div>
    </>
  );
};

export default IntegratedCoordinateList;
