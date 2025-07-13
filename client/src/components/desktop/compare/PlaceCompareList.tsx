import { Table } from 'antd';
import { TableCompareProps } from '../../../utils/types/compare.types';
import React from 'react';
import EmptyData from '@/components/general/utils/EmptyData';

const PlaceCompareList: React.FC<TableCompareProps> = (props) => {
  return (
    <Table
      bordered
      sticky
      style={{ backgroundColor: 'transparent' }}
      {...props}
      rowKey={({ placeId }) => placeId}
      locale={{
        emptyText: (
          <EmptyData description="Anda Tidak Memiliki Tempat Untuk Dibandingkan" />
        ),
      }}
    />
  );
};

export default PlaceCompareList;
