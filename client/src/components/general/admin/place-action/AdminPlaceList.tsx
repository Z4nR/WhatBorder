import React, { useRef, useState } from 'react';
import { adminPlaceAccess, adminRemoveAccess } from '@/utils/networks';
import { AdminPlaceTableProps } from '@/utils/types/map.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Descriptions,
  GetRef,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  TableColumnType,
  TableProps,
  Tag,
  Typography,
} from 'antd';
import Highlighter from 'react-highlight-words';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import MapInProfile from '../../map/MapInProfile';
import { dateFormatter } from '@/utils/helper';
import EmptyData from '../../utils/EmptyData';

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof AdminPlaceTableProps;

const { Text } = Typography;

const AdminPlaceList: React.FC = () => {
  const client = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-place-access'],
    queryFn: async () => await adminPlaceAccess(),
    staleTime: 5 * 60 * 1000,
  });

  const { mutate } = useMutation({
    mutationFn: adminRemoveAccess,
    onSuccess: (data) => {
      client.invalidateQueries({
        queryKey: ['admin-place-access'],
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
  ): TableColumnType<AdminPlaceTableProps> => ({
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

  const columns: TableProps<AdminPlaceTableProps>['columns'] = [
    {
      title: 'Nama Tempat',
      dataIndex: 'placeName',
      key: 'place-name',
      ...getColumnSearchProps('placeName'),
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'place-type',
      width: '150px',
      responsive: ['md'],
      render: (_, { type }) => {
        return (
          <Tag style={{ margin: '0' }} color={type.label}>
            {type.name.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Pembuat',
      dataIndex: 'createdBy',
      key: 'place-creator',
      align: 'center',
      width: '150px',
      responsive: ['sm'],
      ...getColumnSearchProps('createdBy'),
      render: (_, { createdBy }) => {
        return <Text strong>{createdBy}</Text>;
      },
    },
    {
      title: 'Aksi',
      key: 'place-action',
      align: 'center',
      width: '50px',
      render: (_, { placeId }) => {
        return (
          <Popconfirm
            placement="left"
            title="Yakin nih mau dihapus?"
            description="Semua data terkait tempat ini akan hilang"
            onConfirm={() => confirmDeleted(placeId)}
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
      rowKey={({ placeId }) => placeId}
      locale={{
        emptyText: (
          <EmptyData description="Anda Belum Menambahkan Data Tempat" />
        ),
      }}
      expandable={{
        expandedRowRender: ({
          placeId,
          placeOwner,
          placeDescription,
          placeMap,
          placeCenterPoint,
          placeAddress,
          type,
          createdAt,
          updatedAt,
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
                  children: dateFormatter(createdAt),
                },
                {
                  key: '2',
                  label: 'Diperbarui Pada',
                  children: dateFormatter(updatedAt),
                },
                {
                  key: '3',
                  label: 'Pemilik Tempat',
                  children: placeOwner ? placeOwner : '-',
                },
                {
                  key: '4',
                  label: 'Alamat Tempat',
                  children: placeAddress,
                },
                {
                  key: '5',
                  label: 'Penjelasan Tempat',
                  children: placeDescription ? placeDescription : '-',
                },
              ]}
            />
            <MapInProfile
              place_center_point={placeCenterPoint}
              place_id={placeId}
              color={type.color}
              place_map={placeMap}
            />
          </div>
        ),
      }}
    />
  );
};

export default AdminPlaceList;
