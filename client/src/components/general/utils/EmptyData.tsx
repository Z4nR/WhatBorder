import { Empty } from 'antd';
import React from 'react';

interface EmptyDesc {
  description: string;
}

const EmptyData: React.FC<EmptyDesc> = ({ description }) => {
  return (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />
  );
};

export default EmptyData;
