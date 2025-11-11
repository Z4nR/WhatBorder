import EmptyData from '@/components/general/utils/EmptyData';
import { superRoleList } from '@/utils/networks';
import { SuperRoleListProps } from '@/utils/types/admin.types';
import { useQuery } from '@tanstack/react-query';
import { Button, Flex, Table, TableProps, Tag, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

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
    <Flex gap="1rem">
      <div style={{ marginBlock: '1rem' }}>
        <Title level={4}>Daftar Role</Title>
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
      </div>
      <div style={{ marginBlock: '1rem' }}>
        <Title level={4}>Pengaturan Akses Role</Title>
        <Flex justify="flex-end" style={{ marginBlock: '0.5rem' }}>
          <Button>Tambah Akses</Button>
        </Flex>
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
      </div>
    </Flex>
  );
};

export default RoleAccessSettingPages;
