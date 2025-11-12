import EmptyData from '@/components/general/utils/EmptyData';
import { superRoleList } from '@/utils/networks';
import { SuperRoleListProps } from '@/utils/types/admin.types';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Flex, Table, TableProps, Tag } from 'antd';
import React from 'react';

const RoleAccessSettingPages: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['role-access-list'],
    queryFn: async () => await superRoleList(),
  });

  const columns: TableProps<SuperRoleListProps>['columns'] = [
    {
      title: 'Nama Role',
      dataIndex: 'roleName',
      key: 'role-name',
      render: (_, tag) => {
        const color: string = tag.label;
        const admin: string = tag.roleName;
        return <Tag color={color}>{admin.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <Flex gap="1rem" align="start">
      <Card title="Daftar Role">
        <Table
          size="small"
          sticky
          style={{ backgroundColor: 'transparent' }}
          loading={isLoading}
          columns={columns}
          dataSource={data}
          rowKey={({ roleId }) => roleId}
          locale={{
            emptyText: (
              <EmptyData description="Anda Belum Menambahkan Data Tempat" />
            ),
          }}
        />
      </Card>
      <Card title="Pengaturan Akses Role" extra={<Button>Tambah Akses</Button>}>
        <Table
          size="small"
          sticky
          style={{ backgroundColor: 'transparent' }}
          loading={isLoading}
          columns={columns}
          dataSource={data}
          rowKey={({ roleId }) => roleId}
          locale={{
            emptyText: (
              <EmptyData description="Anda Belum Menambahkan Data Tempat" />
            ),
          }}
        />
      </Card>
    </Flex>
  );
};

export default RoleAccessSettingPages;
