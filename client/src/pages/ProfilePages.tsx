import { dateFormatter } from '@/utils/helper';
import { profileUser } from '@/utils/networks';
import { useQuery } from '@tanstack/react-query';
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Descriptions,
  DescriptionsProps,
  Flex,
  GetRef,
  Input,
  message,
  Popconfirm,
  PopconfirmProps,
  Row,
  Skeleton,
  Space,
  Table,
  TableColumnType,
  TableProps,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import MapInProfile from '@/components/general/map/MapInProfile';
import { useNavigate } from 'react-router-dom';
import EmptyData from '@/components/general/utils/EmptyData';
import { useMediaQuery } from 'react-responsive';

const { Text } = Typography;

type InputRef = GetRef<typeof Input>;

interface DataType {
  place_id: string;
  place_owner: string;
  place_description: string;
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
  updated_at: Date;
}

type DataIndex = keyof DataType;

const ProfilePages: React.FC = () => {
  const navigate = useNavigate();

  const isMobile = useMediaQuery({
    query: '(max-width: 600px)',
  });

  const userProfile = useQuery({
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

  const itemsDescUser: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Dibuat Pada',
      children: dateFormatter(userProfile.data?.createdAt),
    },
    {
      key: '2',
      label: 'Status Akun',
      children: userProfile.data?.admin ? 'Pengelola' : 'Pengguna',
    },
    {
      key: '3',
      label: 'Deskripsi Akun',
      children: userProfile.data?.description
        ? userProfile.data?.description
        : '-',
    },
  ];

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    console.log(e);
    message.success('Click on Yes');
  };

  const columns: TableProps<DataType>['columns'] = [
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
            title="Delete the task"
            description="Are you sure to delete this task?"
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
    <>
      <Breadcrumb
        items={[
          {
            onClick: () => navigate('/'),
            title: (
              <Button type="link" className="home-breadcrumb">
                Kembali
              </Button>
            ),
          },
          {
            title: `Profil Pengguna`,
          },
        ]}
        style={{ marginBottom: '1rem' }}
      />
      <Flex gap={'middle'} vertical>
        <Skeleton
          loading={userProfile.isLoading}
          active
          avatar
          paragraph={{ rows: 2 }}
        >
          <Space direction={isMobile ? 'vertical' : 'horizontal'}>
            <Avatar
              size={48}
              style={{
                backgroundColor: '#1677ff',
              }}
            >
              {userProfile.data?.avatar}
            </Avatar>
            <Flex vertical>
              <Row>
                <Col flex="auto">
                  <Text
                    style={{ fontSize: '1rem' }}
                    strong
                    copyable={{
                      text: `${userProfile.data?.userName}`,
                      tooltips: ['Salin Username', 'Username Berhasil Disalin'],
                    }}
                  >
                    {userProfile.data?.fullName}
                  </Text>
                </Col>
                <Col flex="none">
                  <Space.Compact block>
                    <Tooltip title="Perbarui Profil">
                      <Button
                        className="icon-profile"
                        icon={<EditOutlined />}
                      />
                    </Tooltip>
                    <Tooltip title="Bagikan Profil">
                      <Button
                        className="icon-profile"
                        icon={<ShareAltOutlined />}
                      />
                    </Tooltip>
                    <Tooltip title="Hapus Profil">
                      <Button
                        className="icon-profile-danger"
                        icon={<DeleteOutlined />}
                      />
                    </Tooltip>
                  </Space.Compact>
                </Col>
              </Row>
              {userProfile.data && (
                <Text>
                  Terakhir Diperbarui{' '}
                  {formatDistanceToNow(parseISO(userProfile.data?.updatedAt), {
                    addSuffix: true,
                    locale: id,
                  })}
                </Text>
              )}
              <Descriptions size="small" items={itemsDescUser} />
            </Flex>
          </Space>
        </Skeleton>
        <Table
          size="small"
          sticky
          style={{ backgroundColor: 'transparent' }}
          loading={userProfile.isLoading}
          columns={columns}
          dataSource={userProfile.data?.place}
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
      </Flex>
    </>
  );
};

export default ProfilePages;
