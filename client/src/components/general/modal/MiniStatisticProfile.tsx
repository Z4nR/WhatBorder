import React from 'react';
import { dateFormatter } from '@/utils/helper';
import { userResume } from '@/utils/networks';
import { useQuery } from '@tanstack/react-query';
import { Button, Descriptions, DescriptionsProps, Modal, Skeleton } from 'antd';
import { StatisticProps } from '@/utils/types/modal.types';
import { useNavigate } from 'react-router-dom';

const MiniStatisticProfile: React.FC<StatisticProps> = ({
  id,
  state,
  setState,
}) => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['user-mini-profile', id],
    queryFn: async () => await userResume(id),
  });

  const itemDescSimple: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Dibuat Pada',
      children: dateFormatter(data?.createdAt),
    },
    {
      key: '2',
      label: 'Nama Akun',
      children: data?.userName,
    },
    {
      key: '3',
      label: 'Nama Pengguna',
      children: data?.fullName,
    },
    {
      key: '4',
      label: 'Deskripsi Akun',
      children: data?.description ? data?.description : '-',
    },
    {
      key: '5',
      label: 'Jumlah Tempat',
      children: data?.Count.place,
    },
  ];

  return (
    <Modal
      title="Profil Singkat"
      open={state}
      maskClosable={false}
      centered
      footer={() => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/statistic/user/${id}`);
            setState(false);
          }}
        >
          Kunjungi Profil
        </Button>
      )}
      onCancel={() => {
        setState(false);
      }}
    >
      <Skeleton loading={isLoading} paragraph={{ rows: 4 }}>
        <Descriptions layout="vertical" size="small" items={itemDescSimple} />
      </Skeleton>
    </Modal>
  );
};

export default MiniStatisticProfile;
