import EmptyData from '@/components/general/utils/EmptyData';
import { superMenuList } from '@/utils/networks';
import { SuperRouteListProps } from '@/utils/types/admin.types';
import { useQuery } from '@tanstack/react-query';
import { Table, TableProps, Tag } from 'antd';
import React from 'react';

const MenuSettingPages: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['role-access-list'],
    queryFn: async () => await superMenuList(),
  });

  const columns: TableProps<SuperRouteListProps>['columns'] = [
    {
      title: 'Nama Route',
      dataIndex: 'routeName',
      key: 'route-name',
      render: (_, route) => {
        return <Tag>{route.routeName.toUpperCase()}</Tag>;
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
      rowKey={({ routeId }) => routeId}
      locale={{
        emptyText: (
          <EmptyData description="Anda Belum Menambahkan Data Tempat" />
        ),
      }}
    />
  );
};

export default MenuSettingPages;
