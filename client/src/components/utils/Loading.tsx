import { Layout, Spin } from 'antd';

const Loading: React.FC = () => {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        justifyContent: 'center',
      }}
    >
      <Spin style={{ margin: '0 auto' }} tip="Loading..." size="large">
        <div className="content" />
      </Spin>
    </Layout>
  );
};

export default Loading;
