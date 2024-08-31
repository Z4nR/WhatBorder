import { Table } from 'antd';
import { TableUserProps } from '../../utils/state/compare/compare.types';

const UserPlaceList: React.FC<TableUserProps> = (props) => {
  return (
    <Table
      bordered
      sticky
      style={{ backgroundColor: 'transparent' }}
      {...props}
      rowKey={({ placeId }) => placeId}
    />
  );
};

export default UserPlaceList;
