import { dateFormatter } from '@/utils/helper';
import { profileUser } from '@/utils/networks';
import { useQuery } from '@tanstack/react-query';
import {
  Avatar,
  Button,
  Descriptions,
  DescriptionsProps,
  Dropdown,
  Flex,
  GetRef,
  Input,
  Skeleton,
  Space,
  Table,
  TableColumnType,
  TableProps,
  Tag,
  Typography,
} from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined, MoreOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import MapInProfile from '@/components/map/MapInProfile';

const { Text, Paragraph } = Typography;

type InputRef = GetRef<typeof Input>;

interface DataType {
  place_id: string;
  place_name: string;
  place_address: string;
  place_center_point: any;
  place_map: any;
  type: {
    name: string;
    label: string;
    color: string;
  };
  created_at: Date;
}

type DataIndex = keyof DataType;

const ProfilePages: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => await profileUser(),
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

  const items = [
    { key: '1', label: 'Action 1' },
    { key: '2', label: 'Action 2' },
  ];

  const itemsDescription: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Dibuat Pada',
      children: dateFormatter(data?.createdAt),
    },
    {
      key: '2',
      label: 'Status Akun',
      children: data?.admin ? 'Pengelola' : 'Pengguna',
    },
    {
      key: '3',
      label: 'Deskripsi Akun',
      children: data?.description === null ? '-' : data?.description,
    },
  ];

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Nama Tempat',
      dataIndex: 'place_name',
      key: 'place-name',
      ...getColumnSearchProps('place_name'),
    },
    {
      title: 'Alamat',
      dataIndex: 'place_address',
      key: 'place-address',
      responsive: ['xl'],
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
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
      title: 'Ditambahkan Pada',
      dataIndex: 'created_at',
      key: 'place-create',
      align: 'center',
      width: '150px',
      responsive: ['md'],
      sorter: (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'ascend',
      render: (_, { created_at }) => {
        const date = dateFormatter(created_at);
        return <p>{date}</p>;
      },
    },
    {
      title: 'Tindakan',
      key: 'place-action',
      align: 'center',
      width: '80px',
      render: () => (
        <Space size="middle">
          <Dropdown menu={{ items }}>
            <span style={{ cursor: 'pointer' }}>
              <MoreOutlined />
            </span>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <Flex gap={'middle'} vertical>
      <Skeleton loading={isLoading} active title paragraph={{ rows: 2 }}>
        <Space>
          <Avatar
            size={{ md: 48, lg: 48, xl: 48 }}
            style={{ backgroundColor: '#1677ff' }}
          >
            {data?.avatar}
          </Avatar>
          <Flex vertical>
            <Text
              style={{ fontSize: '1rem' }}
              strong
              copyable={{
                text: `${data?.userName}`,
                tooltips: ['Salin Username', 'Username Berhasil Disalin'],
              }}
            >
              {data?.fullName}
            </Text>
            {data && (
              <Text>
                Terakhir Diperbarui{' '}
                {formatDistanceToNow(parseISO(data?.updateAt), {
                  addSuffix: true,
                  locale: id,
                })}
              </Text>
            )}
            <Descriptions items={itemsDescription} />
          </Flex>
        </Space>
      </Skeleton>
      <Table
        size="small"
        sticky
        style={{ backgroundColor: 'transparent' }}
        columns={columns}
        dataSource={data?.place}
        rowKey={({ place_id }) => place_id}
        expandable={{
          expandedRowRender: ({
            place_id,
            place_map,
            place_center_point,
            type,
          }) => (
            <div>
              <MapInProfile
                place_center_point={place_center_point}
                place_id={place_id}
                color={type.color}
                place_map={place_map}
              />
              <Paragraph>Lorem Ipsum</Paragraph>
            </div>
          ),
        }}
      />
    </Flex>
  );
};

export default ProfilePages;
