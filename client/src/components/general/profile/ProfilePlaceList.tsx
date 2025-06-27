import React, { useRef, useState } from 'react';
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
  Tooltip,
} from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { TablePlaceProps } from '@/utils/types/profile.types';
import MapInProfile from '../map/MapInProfile';
import { dateFormatter } from '@/utils/helper';
import EmptyData from '../utils/EmptyData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { placeDelete } from '@/utils/networks';
import { useNavigate } from 'react-router-dom';
import { PlaceTableProps } from '@/utils/types/map.types';

type InputRef = GetRef<typeof Input>;

type DataIndex = keyof PlaceTableProps;

const ProfilePlaceList: React.FC<TablePlaceProps> = ({
  data,
  loading,
  action,
}) => {
  const client = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: placeDelete,
    onSuccess: (data) => {
      client.invalidateQueries({
        queryKey: ['my-profile'],
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
  ): TableColumnType<PlaceTableProps> => ({
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

  const columns: TableProps<PlaceTableProps>['columns'] = [
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
      width: action ? '150px' : '250px',
      responsive: ['sm'],
      render: (_, { type }) => {
        return (
          <Tag style={{ margin: '0' }} color={type.label}>
            {type.name.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  if (action) {
    columns.push({
      title: 'Aksi',
      key: 'place-action',
      align: 'center',
      width: '150px',
      render: (_, { placeId }) => (
        <Space size="middle">
          <Tooltip title="Ubah Data Tempat" placement="bottom">
            <Button
              type="primary"
              onClick={() => navigate(`/location/update/manual/${placeId}`)}
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Popconfirm
            placement="left"
            title="Yakin nih mau dihapus?"
            description="Semua data terkait tempat ini akan hilang"
            onConfirm={() => confirmDeleted(placeId)}
            okText="Yakin"
            cancelText="Tidak Dulu"
          >
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    });
  }

  return (
    <Table
      size="small"
      sticky
      style={{ backgroundColor: 'transparent' }}
      loading={loading}
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
              placeCenterPoint={placeCenterPoint}
              placeId={placeId}
              color={type.color}
              placeMap={placeMap}
            />
          </div>
        ),
      }}
    />
  );
};

export default ProfilePlaceList;
