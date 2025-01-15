import React, { useState } from 'react';
import { Flex, Form, FormListFieldData, Input } from 'antd';
import { MinusCircleOutlined, LockOutlined } from '@ant-design/icons';

const UpdateCoordinateField: React.FC<{
  lat: number;
  long: number;
  fields: FormListFieldData[];
  field: FormListFieldData;
  remove: (index: number | number[]) => void;
}> = ({ lat, long, fields, field, remove }) => {
  const [isDisabled, setIsDisabled] = useState(true);

  const toggleDisabled = () => {
    setIsDisabled((prev) => !prev);
  };

  return (
    <Form.Item style={{ marginBottom: 0 }} required={true} key={field.name}>
      <Flex gap={'middle'} style={{ width: '100%', marginTop: '0.5rem' }}>
        <Form.Item
          {...field}
          initialValue={long}
          name={[field.name, 0]} // First part of the coordinate
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            {
              required: true,
              message: 'Harap masukkan nilai longitude.',
            },
          ]}
          style={{ width: '100%', marginBottom: 0 }}
          key={`${field.key}-update-longitude`}
        >
          <Input
            placeholder="Longitude"
            disabled={isDisabled}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          {...field}
          initialValue={lat}
          name={[field.name, 1]} // Second part of the coordinate
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            {
              required: true,
              message: 'Harap masukkan nilai latitude.',
            },
          ]}
          style={{ width: '100%', marginBottom: 0 }}
          key={`${field.key}-update-latitude`}
        >
          <Input
            placeholder="Latitude"
            disabled={isDisabled}
            style={{ width: '100%' }}
          />
        </Form.Item>

        {fields.length >= 1 ? (
          <>
            <MinusCircleOutlined
              className="dynamic-delete-button"
              onClick={() => remove(field.name)}
            />
            <LockOutlined
              className="dynamic-lock-button"
              onClick={toggleDisabled} // Toggle the disabled state
              style={{ color: isDisabled ? 'red' : 'green', cursor: 'pointer' }}
            />
          </>
        ) : null}
      </Flex>
    </Form.Item>
  );
};

export default UpdateCoordinateField;
