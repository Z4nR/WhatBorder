import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPages: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Result
      style={{ marginTop: '7%' }}
      status="404"
      title="404"
      subTitle="Maaf, halaman yang anda kunjungi tidak ditemukan."
      extra={
        <Button type="primary" onClick={() => navigate('/', { replace: true })}>
          Kembali ke Dashboard
        </Button>
      }
    />
  );
};

export default NotFoundPages;
