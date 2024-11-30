import React, { useRef, useState } from 'react';
import {
  Button,
  Descriptions,
  GetRef,
  Input,
  message,
  Popconfirm,
  PopconfirmProps,
  Space,
  Table,
  TableColumnType,
  TableProps,
  Tag,
  Tooltip,
} from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {
  ProfilePlaceProps,
  TablePlaceProps,
} from '@/utils/types/profile.types';
import MapInProfile from '../map/MapInProfile';
import { dateFormatter } from '@/utils/helper';
import EmptyData from '../utils/EmptyData';

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof ProfilePlaceProps;

const ProfilePlaceList: React.FC<TablePlaceProps> = ({ data, loading }) => {
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
  ): TableColumnType<ProfilePlaceProps> => ({
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

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    console.log(e);
    message.success('Click on Yes');
  };

  const columns: TableProps<ProfilePlaceProps>['columns'] = [
    {
      title: 'Nama Tempat',
      dataIndex: 'place_name',
      key: 'place-name',
      ...getColumnSearchProps('place_name'),
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
            {type.name.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Tindakan',
      key: 'place-action',
      align: 'center',
      width: '150px',
      render: () => (
        <Space size="middle">
          <Tooltip title="Ubah Data Tempat" placement="bottom">
            <Button type="primary">
              <EditOutlined />
            </Button>
          </Tooltip>
          <Popconfirm
            title="Hapus akun"
            description="Yakin nih mau dihapus? Semua data tempat yang kamu tambahkan akan otomatis terhapus juga lho."
            onConfirm={confirm}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Hapus Data Tempat" placement="bottom">
              <Button danger>
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      size="small"
      sticky
      style={{ backgroundColor: 'transparent' }}
      loading={loading}
      columns={columns}
      dataSource={data}
      rowKey={({ place_id }) => place_id}
      locale={{
        emptyText: (
          <EmptyData description="Anda Belum Menambahkan Data Tempat" />
        ),
      }}
      expandable={{
        expandedRowRender: ({
          place_id,
          place_owner,
          place_description,
          place_map,
          place_center_point,
          place_address,
          type,
          created_at,
          updated_at,
        }) => (
          <div style={{ paddingInline: '8px', paddingBottom: '8px' }}>
            <Descriptions
              size="small"
              style={{ marginBottom: '1em' }}
              title="Info Tempat"
              items={[
                {
                  key: '1',
                  label: 'Ditambahkan Pada',
                  children: dateFormatter(created_at),
                },
                {
                  key: '2',
                  label: 'Diperbarui Pada',
                  children: dateFormatter(updated_at),
                },
                {
                  key: '3',
                  label: 'Pemilik Tempat',
                  children: place_owner ? place_owner : '-',
                },
                {
                  key: '4',
                  label: 'Alamat Tempat',
                  children: place_address,
                },
                {
                  key: '5',
                  label: 'Penjelasan Tempat',
                  children: place_description ? place_description : '-',
                },
              ]}
            />
            <MapInProfile
              place_center_point={place_center_point}
              place_id={place_id}
              color={type.color}
              place_map={place_map}
            />
          </div>
        ),
      }}
    />
  );
};

export default ProfilePlaceList;