import { Table, Tag } from 'antd';
import type { TableProps } from 'antd/es/table';
import { useQuery } from '@tanstack/react-query';
import { placeList } from '../../utils/networks';
import { Link } from 'react-router-dom';

interface DataType {
  placeId: string;
  placeName: string;
  placeAddress: string;
  placeType: string;
  createdBy: string;
  createdAt: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'placeName',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'Address',
    dataIndex: 'placeAddress',
    key: 'address',
  },
  {
    title: 'Tipe',
    dataIndex: 'placeType',
    key: 'type',
    width: '10%',
    render: (_, tag) => {
      let color: string = '';
      if (tag.placeType === 'Bangunan') {
        color = 'volcano';
      }
      return <Tag color={color}>{tag.placeType.toUpperCase()}</Tag>;
    },
  },
  {
    title: 'Pembuat',
    dataIndex: 'createdBy',
    key: 'creator',
    align: 'center',
    width: '10%',
  },
  {
    title: 'Ditambahkan Pada',
    dataIndex: 'createdAt',
    key: 'date',
    align: 'center',
    width: '15%',
    render: (_, time) => {
      const date = new Date(time.createdAt).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return <p>{date}</p>;
    },
  },
  {
    title: 'Tindakan',
    key: 'action',
    fixed: 'right',
    align: 'center',
    width: '10%',
    render: (_, detail) => (
      <Link to={`/${detail.placeId}/detil`}>Lihat Detil</Link>
    ),
  },
];

const PlaceList: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['place-all'],
    queryFn: async () => await placeList(),
  });

  return (
    <Table
      sticky
      scroll={{ x: 1000 }}
      style={{ backgroundColor: 'transparent' }}
      columns={columns}
      dataSource={data}
      pagination={{ position: ['bottomCenter'] }}
    />
  );
};

export default PlaceList;
