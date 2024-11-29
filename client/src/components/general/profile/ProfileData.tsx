import React from 'react';
import { Avatar, Typography } from 'antd';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

const { Text } = Typography;

export const ProfileAvatar: React.FC<{ avatar: string }> = ({ avatar }) => {
  return (
    <Avatar
      size={48}
      style={{
        backgroundColor: '#1677ff',
      }}
    >
      {avatar}
    </Avatar>
  );
};

export const ProfileName: React.FC<{ fullname: string; username: string }> = ({
  fullname,
  username,
}) => {
  return (
    <Text
      style={{ fontSize: '1rem' }}
      strong
      copyable={{
        text: `${username}`,
        tooltips: ['Salin Username', 'Username Berhasil Disalin'],
      }}
    >
      {fullname}
    </Text>
  );
};

export const ProfileLastUpdate: React.FC<{ updatedAt: any }> = ({
  updatedAt,
}) => {
  return (
    <Text>
      Terakhir Diperbarui{' '}
      {formatDistanceToNow(parseISO(updatedAt), {
        addSuffix: true,
        locale: id,
      })}
    </Text>
  );
};
