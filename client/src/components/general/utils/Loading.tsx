import { Layout, Spin } from 'antd';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        justifyContent: 'center',
      }}
    >
      <Spin style={{ margin: '0 auto' }} tip="Memuat..." size="large">
        <div className="content" />
      </Spin>
    </Layout>
  );
};

export default Loading;
