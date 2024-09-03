import { Breadcrumb, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ClientAddCoordinate: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Breadcrumb
        items={[
          {
            onClick: () => navigate('/'),
            title: <Text className="home-breadcrumb">Kembali</Text>,
          },
          {
            title: 'Tambahkan Koordinat',
          },
        ]}
      />
      <Title level={5} style={{ marginTop: '8px' }}>
        Pengaturan Koordinat
      </Title>
    </>
  );
};

export default ClientAddCoordinate;
