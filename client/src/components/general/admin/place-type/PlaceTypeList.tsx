import React, { useRef, useState } from 'react';
import { buildingFilter } from '@/utils/networks';
import { BuildingListProps } from '@/utils/types/utils.types';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  ColorPicker,
  GetRef,
  Input,
  Space,
  Table,
  TableColumnType,
  TableProps,
} from 'antd';
import Highlighter from 'react-highlight-words';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import EmptyData from '../../utils/EmptyData';

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof BuildingListProps;

const PlaceTypeList: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['building-list'],
    queryFn: async () => await buildingFilter(),
  });

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<BuildingListProps> => ({
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

  const columns: TableProps<BuildingListProps>['columns'] = [
    {
      title: 'Nama Tempat',
      dataIndex: 'name',
      key: 'building-name',
      width: '250px',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Warna Label Tempat',
      dataIndex: 'label',
      key: 'building-label',
      width: '150px',
      align: 'center',
      render: (_, { label }) => (
        <ColorPicker defaultValue={label} showText disabled />
      ),
    },
    {
      title: 'Warna Peta Tempat',
      dataIndex: 'color',
      key: 'place-color',
      width: '150px',
      align: 'center',
      render: (_, { color }) => (
        <ColorPicker defaultValue={color} showText disabled />
      ),
    },
  ];

  return (
    <Table
      size="small"
      sticky
      style={{ background: 'transparent' }}
      loading={isLoading}
      columns={columns}
      rowKey={({ buildingId }) => buildingId}
      dataSource={data}
      locale={{
        emptyText: (
          <EmptyData description="Anda Belum Menambahkan Data Tempat" />
        ),
      }}
    />
  );
};

export default PlaceTypeList;
