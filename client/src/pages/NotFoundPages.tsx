import React from 'react';
import { Button, Result } from 'antd';

const NotFoundPages: React.FC = () => {
  return (
    <Result
      style={{ marginTop: '7%' }}
      status="404"
      title="404"
      subTitle="Maaf, halaman yang anda kunjungi tidak ditemukan."
      extra={
        <Button type="primary" onClick={() => window.history.back()}>
          Kembali ke Halaman Sebelumnya
        </Button>
      }
    />
  );
};

export default NotFoundPages;
