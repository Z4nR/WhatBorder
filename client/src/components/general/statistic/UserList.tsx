import React, { useRef, useState } from 'react';
import { Button, GetRef, Input, Space, Table, TableColumnType } from 'antd';
import type { TableProps } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { dateFormatter } from '@/utils/helper';
import { userList } from '@/utils/networks';
import useUserState from '@/utils/state/userState';
import AdminList from './AdminList';
import EmptyData from '../utils/EmptyData';
import { UserListProps } from '@/utils/types/statistic.types';
import MiniStatisticProfile from '../modal/MiniStatisticProfile';

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof UserListProps;

const UserList: React.FC = () => {
  const [profileModal, setProfileModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const user = useUserState().role;

  const { data, isLoading } = useQuery({
    queryKey: ['user-all'],
    queryFn: async () => await userList(),
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
  ): TableColumnType<UserListProps> => ({
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

  const columns: TableProps<UserListProps>['columns'] = [
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
      responsive: ['md'],
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
      responsive: ['sm'],
      render: (_, time) => {
        const date = dateFormatter(time.createdAt);
        return <p>{date}</p>;
      },
    },
    {
      title: 'Aksi',
      key: 'user-action',
      width: '150px',
      align: 'center',
      render: (_, { userId }) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedUserId(userId);
            setProfileModal(true);
          }}
        >
          Rincian
        </Button>
      ),
    },
  ];

  return user ? (
    <AdminList />
  ) : (
    <>
      {profileModal && (
        <MiniStatisticProfile
          id={selectedUserId}
          state={profileModal}
          setState={setProfileModal}
        />
      )}
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
    </>
  );
};

export default UserList;
