import { buildingFilter } from '@/utils/networks';
import { useQuery } from '@tanstack/react-query';
import { Card, Flex, Form, Input, Select, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const { Text } = Typography;
const { Option } = Select;

const FormInputData: React.FC = () => {
  const building = useQuery({
    queryKey: ['building-filter'],
    queryFn: async () => await buildingFilter(),
  });

  return (
    <Card>
      <Flex className="flex-form-item" wrap>
        <Form.Item
          className="form-item-location"
          label="Nama"
          name="placename"
          rules={[
            {
              required: true,
              message: 'Tolong Masukan Nama Tempat!',
            },
            {
              max: 20,
              message: 'Alamat yang anda masukan melebihi 20 karakter',
            },
          ]}
        >
          <Input placeholder="Nama Tempat" autoComplete="off" />
        </Form.Item>
        <Form.Item
          className="form-item-location"
          label="Pemilik"
          name="placeowner"
          rules={[
            {
              max: 20,
              message: 'Alamat yang anda masukan melebihi 20 karakter',
            },
          ]}
        >
          <Input placeholder="Pemilik Tempat" autoComplete="off" />
        </Form.Item>
      </Flex>
      <Flex className="flex-form-item" wrap>
        <Form.Item
          className="form-item-location"
          label="Alamat"
          name="placeaddress"
          rules={[
            {
              required: true,
              message: 'Tolong Masukan Alamat Tempat!',
            },
            {
              max: 50,
              message: 'Alamat yang anda masukan melebihi 50 karakter',
            },
          ]}
        >
          <Input placeholder="Alamat Tempat" autoComplete="off" />
        </Form.Item>
        <Form.Item
          className="form-item-location"
          label="Jenis"
          name="placetype"
          rules={[
            {
              required: true,
              message: 'Tolong Pilih Jenis Tempat!',
            },
          ]}
        >
          <Select placeholder="Pilih Jenis Tempat" allowClear>
            {building.data?.map((item: any) => (
              <Option key={item.buildingId} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Flex>
      <Form.Item label="Deskripsi" name="placedesc">
        <TextArea
          showCount
          maxLength={100}
          placeholder="Tambahkan Deskripsi Tempat"
          style={{ height: 120, resize: 'none' }}
        />
      </Form.Item>
      <Text>Titik Tengah Tempat</Text>
      <Flex className="flex-form-item" wrap>
        <Form.Item
          className="form-item-location"
          label="Latitude"
          name="placelat"
          rules={[
            {
              required: true,
              message: 'Data koordinat latitude tidak boleh kosong',
            },
          ]}
        >
          <Input placeholder="Latitude" disabled />
        </Form.Item>
        <Form.Item
          className="form-item-location"
          label="Longitude"
          name="placelong"
          rules={[
            {
              required: true,
              message: 'Data koordinat longitude tidak boleh kosong',
            },
          ]}
        >
          <Input placeholder="Longitude" disabled />
        </Form.Item>
      </Flex>
    </Card>
  );
};

export default FormInputData;
