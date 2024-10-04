import { Table } from 'antd';
import { TableUserProps } from '../../utils/state/compare/compare.types';
import EmptyData from '../utils/EmptyData';

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
