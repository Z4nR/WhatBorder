import { Empty } from 'antd';

interface EmptyDesc {
  description: string;
}

const EmptyData: React.FC<EmptyDesc> = ({ description }) => {
  return (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />
  );
};

export default EmptyData;
