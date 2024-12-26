import React from 'react';
import { MiniToolProps } from '@/utils/types/profile.types';
import { Button, Space, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { shareLink } from '@/utils/helper';

const ProfileMiniTool: React.FC<MiniToolProps> = ({
  setEdit,
  setDelete,
  myId,
}) => {
  const shareProfile = () => {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
    shareLink(`${baseUrl}statistic/user/${myId}`);
  };

  return (
    <Space.Compact block>
      <Tooltip title="Perbarui Profil">
        <Button
          className="icon-profile"
          icon={<EditOutlined />}
          onClick={() => setEdit(true)}
        />
      </Tooltip>
      <Tooltip title="Bagikan Profil">
        <Button
          className="icon-profile"
          icon={<ShareAltOutlined />}
          onClick={() => shareProfile()}
        />
      </Tooltip>
      <Tooltip title="Hapus Profil">
        <Button
          className="icon-profile-danger"
          icon={<DeleteOutlined />}
          onClick={() => setDelete(true)}
        />
      </Tooltip>
    </Space.Compact>
  );
};

export default ProfileMiniTool;
