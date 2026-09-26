import React from 'react';
import { superMenuList } from '@/utils/networks';
import { SuperRouteListProps } from '@/utils/types/admin.types';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Popconfirm,
  Space,
  Table,
  TableProps,
  Tag,
  Typography,
} from 'antd';
import EmptyData from '@/components/general/utils/EmptyData';

const { Text } = Typography;

const MenuSettingPages: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['role-access-list'],
    queryFn: async () => await superMenuList(),
  });

  const confirmUpdated = (id: string) => {
    console.log(id);
  };

  const confirmDeleted = (id: string) => {
    console.log(id);
  };

  const columns: TableProps<SuperRouteListProps>['columns'] = [
    {
      title: 'Nama Rute',
      dataIndex: 'routeName',
      key: 'route-name',
      render: (_, route) => {
        return <Text strong>{route.routeName}</Text>;
      },
    },
    {
      title: 'Rute Menu Halaman',
      dataIndex: 'pathRoute',
      key: 'path-route',
      render: (_, route) => {
        return <Tag>{route.pathRoute}</Tag>;
      },
    },
    {
      title: 'Rute Menu Sidebar',
      dataIndex: 'pathSide',
      key: 'path-side',
      render: (_, route) => {
        return <Tag>{route.pathSide}</Tag>;
      },
    },
    {
      title: 'Identitas Rute',
      dataIndex: 'pathKey',
      key: 'path-key',
      render: (_, route) => {
        return <Tag>{route.pathKey}</Tag>;
      },
    },
    {
      title: 'Urutan Menu',
      dataIndex: 'orderId',
      key: 'path-order',
      width: '100px',
      render: (_, route) => {
        return <Tag>{route.orderPath}</Tag>;
      },
    },
    {
      title: 'Aksi',
      key: 'route-action',
      align: 'center',
      render: (_, { routeId }) => {
        return (
          <Space>
            <Popconfirm
              placement="left"
              title="Yakin nih mau diupdate?"
              description="Harap lakukan penyesuaian agar tidak terjadi error"
              onConfirm={() => confirmUpdated(routeId)}
              okText="Yakin"
              cancelText="Tidak Dulu"
            >
              <Button variant="link" color="blue">
                Perbarui
              </Button>
            </Popconfirm>
            <Popconfirm
              placement="left"
              title="Yakin nih mau dihapus?"
              description="Semua data terkait pengguna ini akan hilang"
              onConfirm={() => confirmDeleted(routeId)}
              okText="Yakin"
              cancelText="Tidak Dulu"
            >
              <Button variant="link" color="red" size="small">
                Hapus
              </Button>
            </Popconfirm>
          </Space>
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
      rowKey={(record) => record.routeId}
      expandable={{
        rowExpandable: (record) => record.children.length > 0,
      }}
      locale={{
        emptyText: (
          <EmptyData description="Anda Belum Menambahkan Data Tempat" />
        ),
      }}
    />
  );
};

export default MenuSettingPages;
