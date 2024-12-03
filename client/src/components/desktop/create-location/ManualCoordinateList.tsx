import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Typography } from 'antd';
import CoordinateField from './CoordinateField';

const { Text } = Typography;

const ManualCoordinateList: React.FC = () => {
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
            return (
              <>
                {fields.map((field) => (
                  <CoordinateField
                    fields={fields}
                    field={field}
                    remove={remove}
                  />
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
      </div>
    </>
  );
};

export default ManualCoordinateList;
