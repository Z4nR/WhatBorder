import { Table } from 'antd';
import { TableUserProps } from '../../../utils/types/compare.types';
import EmptyData from '../utils/EmptyData';
import React from 'react';

const UserPlaceList: React.FC<TableUserProps> = (props) => {
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

export default UserPlaceList;
