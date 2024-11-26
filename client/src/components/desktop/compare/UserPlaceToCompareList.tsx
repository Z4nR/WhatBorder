import { Table } from 'antd';
import { TableUserProps } from '../../../utils/types/compare.types';
import React from 'react';
import EmptyData from '@/components/general/utils/EmptyData';

const UserPlaceToCompareList: React.FC<TableUserProps> = (props) => {
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

export default UserPlaceToCompareList;
