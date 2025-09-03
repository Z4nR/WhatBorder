import React, { useRef, useState } from 'react';
import { adminRemoveUser, adminUserRoleList } from '@/utils/networks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  GetRef,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  TableColumnType,
  TableProps,
  Tag,
} from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { AdminUserOnlyTableProps } from '@/utils/types/admin.types';
import EmptyData from '../../utils/EmptyData';
import { dateFormatter } from '@/utils/helper';

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof AdminUserOnlyTableProps;

const UserRoleList: React.FC = () => {
  const client = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['user-list', 'only'],
    queryFn: async () => await adminUserRoleList(),
  });

  const { mutate } = useMutation({
    mutationFn: adminRemoveUser,
    onSuccess: (data) => {
      client.invalidateQueries({
        queryKey: ['admin-user-access'],
      });
      message.open({
        type: 'success',
        content: data,
        duration: 3,
      });
    },
    onError: (error: any) => {
      message.open({
        type: 'error',
        content: error.response.data.message,
        duration: 5,
      });
    },
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
  ): TableColumnType<AdminUserOnlyTableProps> => ({
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

  const confirmDeleted = (id: string) => {
    mutate(id);
  };

  const columns: TableProps<AdminUserOnlyTableProps>['columns'] = [
    {
      title: 'Nama Pengguna',
      dataIndex: 'userName',
      key: 'user-name',
      ...getColumnSearchProps('userName'),
    },
    {
      title: 'Status Pengguna',
      dataIndex: 'admin',
      key: 'user-role',
      render: (_, tag) => {
        const color: string = tag.role.label;
        const admin: string = tag.role.roleName;
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
      title: 'Aksi',
      key: 'role-action',
      align: 'center',
      width: '50px',
      render: (_, { userId }) => {
        return (
          <Popconfirm
            placement="left"
            title="Yakin nih mau dihapus?"
            description="Semua data terkait pengguna ini akan hilang"
            onConfirm={() => confirmDeleted(userId)}
            okText="Yakin"
            cancelText="Tidak Dulu"
          >
            <DeleteOutlined style={{ color: 'red' }} />
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <Table
      size="small"
      sticky
      style={{ backgroundColor: 'transparent' }}
      loading={isLoading}
      columns={columns}
      dataSource={data}
      rowKey={({ userId }) => userId}
      locale={{
        emptyText: (
          <EmptyData description="Anda Belum Menambahkan Data Tempat" />
        ),
      }}
    />
  );
};

export default UserRoleList;
