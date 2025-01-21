import React from 'react';
import { Form, Typography } from 'antd';
import CreateCoordinateField from './CreateCoordinateField';

const { Text } = Typography;

const IntegratedCoordinateList: React.FC<{
  addRef: React.MutableRefObject<(fieldsValue?: any, index?: number) => void>;
}> = ({ addRef }) => {
  return (
    <>
      <Text>Titik Koordinat Batas Tempat (Longitude, Latitude)</Text>
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

export default IntegratedCoordinateList;
