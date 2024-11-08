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
import React, { useRef, useState } from 'react';
import { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { dateFormatter } from '@/utils/helper';
import { adminUserList } from '@/utils/networks';
import EmptyData from '../utils/EmptyData';
import { AdminListProps } from '@/utils/types/statistic.types';

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof AdminListProps;

const AdminList: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['user-all-admin'],
    queryFn: async () => await adminUserList(),
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
  ): TableColumnType<AdminListProps> => ({
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

  const columns: TableProps<AdminListProps>['columns'] = [
    {
      title: 'Nama Pengguna',
      dataIndex: 'userName',
      key: 'user-name',
      ...getColumnSearchProps('userName'),
    },
    {
      title: 'Deskripsi Pengguna',
      dataIndex: 'description',
      key: 'user-desc',
      responsive: ['lg'],
    },
    {
      title: 'Tipe',
      dataIndex: 'userType',
      key: 'user-type',
      align: 'center',
      width: '150px',
      responsive: ['sm'],
      render: (_, tag) => {
        const color: string = tag.admin === false ? 'volcano' : 'green';
        const admin: string = tag.admin === false ? 'Pengguna' : 'Admin';
        return <Tag color={color}>{admin.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Ditambahkan Pada',
      dataIndex: 'createdAt',
      key: 'user-create',
      align: 'center',
      sorter: (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'ascend',
      responsive: ['md'],
      render: (_, time) => {
        const date = dateFormatter(time.createdAt);
        return <p>{date}</p>;
      },
    },
    {
      title: 'Tindakan',
      key: 'user-action',
      width: '150px',
      align: 'center',
      render: (_, detail) => (
        <Link to={`/${detail.userId}/info`}>Lihat Pengguna</Link>
      ),
    },
  ];

  return (
    <Table
      sticky
      style={{ backgroundColor: 'transparent' }}
      loading={isLoading}
      columns={columns}
      dataSource={data}
      rowKey={({ userId }) => userId}
      locale={{
        emptyText: <EmptyData description="Data Pengguna Kosong" />,
      }}
    />
  );
};

export default AdminList;
