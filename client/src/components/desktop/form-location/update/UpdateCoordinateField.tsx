import React, { useEffect, useState } from 'react';
import { Flex, Form, FormInstance, FormListFieldData, Input } from 'antd';
import { MinusCircleOutlined, LockOutlined } from '@ant-design/icons';

const UpdateCoordinateField: React.FC<{
  lat: number;
  long: number;
  fields: FormListFieldData[];
  field: FormListFieldData;
  remove: (index: number) => void;
  form: FormInstance;
}> = ({ lat, long, fields, field, remove, form }) => {
  const [longitude, setLongitude] = useState(lat);
  const [latitude, setLatitude] = useState(long);
  const [isDisabled, setIsDisabled] = useState(true);

  // Watch for changes in the form and update state
  useEffect(() => {
    const updatedLat = form.getFieldValue(['longlat', field.name, 'lat']);
    const updatedLong = form.getFieldValue(['longlat', field.name, 'long']);

    if (updatedLat !== latitude || updatedLong !== longitude) {
      setLatitude(updatedLat);
      setLongitude(updatedLong);
    }
  }, [form, field.name, latitude, longitude]); // Re-run when form values change

  const toggleDisabled = () => setIsDisabled((prev) => !prev);

  return (
    <Form.Item style={{ marginBottom: 0 }} required={true} key={field.name}>
      <Flex gap={'middle'} style={{ width: '100%', marginTop: '0.5rem' }}>
        <Form.Item
          {...field}
          name={[field.name, 'long']}
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            { required: true, message: 'Harap masukkan nilai longitude.' },
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
          name={[field.name, 'lat']}
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            { required: true, message: 'Harap masukkan nilai latitude.' },
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

        {fields.length >= 1 && (
          <>
            <MinusCircleOutlined
              className="dynamic-delete-button"
              onClick={() => remove(field.name)}
            />
            <LockOutlined
              className="dynamic-lock-button"
              onClick={toggleDisabled}
              style={{ color: isDisabled ? 'red' : 'green', cursor: 'pointer' }}
            />
          </>
        )}
      </Flex>
    </Form.Item>
  );
};

export default UpdateCoordinateField;
