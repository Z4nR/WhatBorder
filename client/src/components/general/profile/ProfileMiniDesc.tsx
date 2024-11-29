import { dateFormatter } from '@/utils/helper';
import { ProfileMiniDescription } from '@/utils/types/profile.types';
import { Descriptions, DescriptionsProps } from 'antd';
import React from 'react';

const ProfileMiniDesc: React.FC<ProfileMiniDescription> = ({
  createdAt,
  admin,
  description,
}) => {
  const itemsDescUser: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Dibuat Pada',
      children: dateFormatter(createdAt),
    },
    {
      key: '2',
      label: 'Status Akun',
      children: admin ? 'Pengelola' : 'Pengguna',
    },
    {
      key: '3',
      label: 'Deskripsi Akun',
      children: description ? description : '-',
    },
  ];

  return <Descriptions size="small" items={itemsDescUser} />;
};

export default ProfileMiniDesc;
