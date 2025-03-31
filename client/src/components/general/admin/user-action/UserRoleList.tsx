import { adminUserRoleList } from '@/utils/networks';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const UserRoleList: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['user-list', 'only'],
    queryFn: async () => await adminUserRoleList(),
  });

  console.log(data);

  return <p>Ini Halaman Role User</p>;
};

export default UserRoleList;
