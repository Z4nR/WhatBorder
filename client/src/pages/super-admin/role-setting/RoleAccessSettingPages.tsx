import EmptyData from '@/components/general/utils/EmptyData';
import { superRoleList, superRouteRoleList } from '@/utils/networks';
import { SuperRoleRouteListProps } from '@/utils/types/admin.types';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  Popconfirm,
  Select,
  Space,
  Table,
  TableProps,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

const RoleAccessSettingPages: React.FC = () => {
  const [getIdRole, setIdRole] = useState<string | null>(null);

  const roleList = useQuery({
    queryKey: ['role-list'],
    queryFn: async () => await superRoleList(),
  });
  console.log(roleList);

  const roleRouteList = useQuery({
    queryKey: ['route-list', getIdRole],
    queryFn: async () => await superRouteRoleList(Number(getIdRole)),
  });
  console.log(roleRouteList);

  const confirmUpdated = (roleCode: number, routeId: string) => {
    console.log(roleCode, routeId);
  };

  const confirmDeleted = (roleCode: number, routeId: string) => {
    console.log(roleCode, routeId);
  };

  const columnsRoleRoute: TableProps<SuperRoleRouteListProps>['columns'] = [
    {
      title: 'Nama Rute',
      dataIndex: 'routeName',
      key: 'route-name',
      render: (_, route) => {
        return <Text strong>{route.routeName}</Text>;
      },
    },
    {
      title: 'Rute Menu',
      dataIndex: 'pathRoute',
      key: 'path-route',
      render: (_, route) => {
        const pathRoute = route.pathRoute !== null ? route.pathRoute : '-';
        const pathSide = route.pathSide !== null ? route.pathSide : '-';

        return (
          <div>
            Jalur Menu: <Tag>{pathRoute}</Tag>
            <br />
            Jalur Side Menu: <Tag>{pathSide}</Tag>
          </div>
        );
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
      align: 'center',
      width: '100px',
      responsive: ['md'],
      render: (_, route) => {
        return <Tag>{route.orderPath}</Tag>;
      },
    },
    {
      title: 'Role Akses',
      dataIndex: 'roleName',
      key: 'role-name',
      width: '150px',
      render: (_, route) => {
        return <Tag>{route.roleName}</Tag>;
      },
    },
    {
      title: 'Aksi',
      key: 'route-action',
      align: 'center',
      width: '100px',
      render: (_, route) => {
        return (
          <Space>
            {!route.roleCode && getIdRole && (
              <Popconfirm
                placement="left"
                title="Yakin nih mau diupdate?"
                description="Harap lakukan penyesuaian agar tidak terjadi error"
                onConfirm={() => confirmUpdated(Number(getIdRole), route.routeId)}
                okText="Yakin"
                cancelText="Tidak Dulu"
              >
                <Button variant="link" color="blue">
                  Tambah
                </Button>
              </Popconfirm>
            )}
            {route.roleCode && (
              <Popconfirm
                placement="left"
                title="Yakin nih mau dihapus?"
                description="Semua data terkait pengguna ini akan hilang"
                onConfirm={() => confirmDeleted(route.roleCode, route.routeId)}
                okText="Yakin"
                cancelText="Tidak Dulu"
              >
                <Button variant="link" color="red" size="small">
                  Hapus
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Card
      title="Pengaturan Akses Role"
      extra={
        <Space>
          <Select
            prefix="Role"
            placeholder="Pilih Role"
            style={{ width: 200 }}
            onChange={setIdRole}
            options={roleList.data}
            allowClear
            showSearch
          />
          <Button>Tambah Akses</Button>
        </Space>
      }
    >
      <Table
        size="small"
        sticky
        style={{ backgroundColor: 'transparent' }}
        loading={roleRouteList.isLoading}
        columns={columnsRoleRoute}
        dataSource={roleRouteList.data}
        rowKey={({ routeId }) => routeId}
        locale={{
          emptyText: (
            <EmptyData description="Anda Belum Menambahkan Data Tempat" />
          ),
        }}
        pagination={false}
      />
    </Card>
  );
};

export default RoleAccessSettingPages;
