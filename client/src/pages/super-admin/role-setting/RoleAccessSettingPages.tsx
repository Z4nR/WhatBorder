import EmptyData from '@/components/general/utils/EmptyData';
import { superRoleList } from '@/utils/networks';
import { SuperRoleListProps } from '@/utils/types/admin.types';
import { useQuery } from '@tanstack/react-query';
import { Table, TableProps, Tag } from 'antd';
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
  );
};

export default RoleAccessSettingPages;
