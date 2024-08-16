import {
  Button,
  GetRef,
  Input,
  Space,
  Table,
  TableColumnType,
  Tag,
} from 'antd';
import type { TableProps } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { placeList } from '@/utils/networks';
import { dateFormatter } from '@/utils/helper';

type InputRef = GetRef<typeof Input>;
interface DataType {
  placeId: string;
  placeName: string;
  placeAddress: string;
  type: {
    name: string;
    label: string;
  };
  createdBy: string;
  createdAt: Date;
}

type DataIndex = keyof DataType;

const PlaceList: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['place-all'],
    queryFn: async () => await placeList(),
  });

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm({ closeDropdown: true });
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Cari
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              confirm({ closeDropdown: true });
            }}
            size="small"
            style={{ width: 90 }}
          >
            Hapus
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Tutup
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Nama Tempat',
      dataIndex: 'placeName',
      key: 'place-name',
      ...getColumnSearchProps('placeName'),
    },
    {
      title: 'Alamat',
      dataIndex: 'placeAddress',
      key: 'place-address',
      responsive: ['lg'],
    },
    {
      title: 'Tipe',
      dataIndex: 'placeType',
      key: 'place-type',
      width: '150px',
      responsive: ['sm'],
      render: (_, { type }) => {
        return (
          <Tag style={{ margin: '0' }} color={type.label}>
            {type.name}
          </Tag>
        );
      },
    },
    {
      title: 'Oleh',
      dataIndex: 'createdBy',
      key: 'place-creator',
      align: 'center',
      width: '150px',
      responsive: ['md'],
    },
    {
      title: 'Ditambahkan Pada',
      dataIndex: 'createdAt',
      key: 'place-create',
      align: 'center',
      width: '150px',
      responsive: ['md'],
      sorter: (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'ascend',
      render: (_, { createdAt }) => {
        const date = dateFormatter(createdAt);
        return <p>{date}</p>;
      },
    },
    {
      title: 'Tindakan',
      key: 'place-action',
      align: 'center',
      width: '150px',
      render: (_, { placeId }) => (
        <Link to={`/${placeId}/detil`}>Lihat Detil</Link>
      ),
    },
  ];

  return (
    <Table
      sticky
      style={{ backgroundColor: 'transparent' }}
      columns={columns}
      dataSource={data}
      rowKey={({ placeId }) => placeId}
    />
  );
};

export default PlaceList;
