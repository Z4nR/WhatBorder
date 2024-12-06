import React from 'react';
import { Flex, Form, FormListFieldData, Input } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';

const CoordinateField: React.FC<{
  fields: FormListFieldData[];
  field: FormListFieldData;
  remove: (index: number | number[]) => void;
}> = ({ fields, field, remove }) => {
  return (
    <Form.Item style={{ marginBottom: 0 }} required={true} key={field.name}>
      <Flex gap={'middle'} style={{ width: '100%', marginTop: '0.5rem' }}>
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
          <Input placeholder="Longitude" disabled style={{ width: '100%' }} />
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
          <Input placeholder="Latitude" disabled style={{ width: '100%' }} />
        </Form.Item>

        {fields.length > 1 ? (
          <MinusCircleOutlined
            className="dynamic-delete-button"
            onClick={() => remove(field.name)}
          />
        ) : null}
      </Flex>
    </Form.Item>
  );
};

export default CoordinateField;
