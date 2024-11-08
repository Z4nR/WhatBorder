import { EmptyProps } from '@/utils/types/utils.types';
import { Empty } from 'antd';
import React from 'react';

const EmptyData: React.FC<EmptyProps> = ({ description }) => {
  return (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />
  );
};

export default EmptyData;
