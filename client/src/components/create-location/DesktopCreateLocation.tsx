import { Breadcrumb, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const DesktopCreateLocation: React.FC = () => {
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
            title: 'Tambahkan Rincian Tempat',
          },
        ]}
      />
      <Title level={5} style={{ marginTop: '8px' }}>
        Pengaturan Penambahan Tempat
      </Title>
    </>
  );
};

export default DesktopCreateLocation;
