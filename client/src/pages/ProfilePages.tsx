import { profileUser } from '@/utils/networks';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Col,
  Flex,
  message,
  Row,
  Skeleton,
  Space,
  Tooltip,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import BreadcrumbComponent from '@/components/general/utils/Breadcrumb';
import EditProfile from '@/components/general/modal/EditProfile';
import ProfilePlaceList from '@/components/general/profile/ProfilePlaceList';
import {
  ProfileAvatar,
  ProfileLastUpdate,
  ProfileName,
} from '@/components/general/profile/ProfileData';
import ProfileMiniDesc from '@/components/general/profile/ProfileMiniDesc';

const ProfilePages: React.FC = () => {
  const [editProfileModal, setEditProfileModal] = useState(false);

  const isMobile = useMediaQuery({
    query: '(max-width: 600px)',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => await profileUser(),
  });

  const shareProfile = () => {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`${baseUrl}statistic/user/${data?.me}`)
        .then(() => {
          message.info('Tautan berhasil disalin ke clipboard!');
        })
        .catch((err) => {
          message.error('Gagal menyalin tautan: ', err);
        });
    } else {
      message.error('Clipboard API tidak mendukung peramban versi ini.');
    }
  };

  return (
    <>
      {editProfileModal && (
        <EditProfile
          state={editProfileModal}
          setState={setEditProfileModal}
          initialValue={{
            username: data?.userName,
            fullname: data?.fullName,
            description: data?.description,
          }}
        />
      )}
      <BreadcrumbComponent title="Profil Pengguna" buttonTitle="Kembali" />
      <Flex gap={'middle'} vertical>
        <Skeleton loading={isLoading} active avatar paragraph={{ rows: 2 }}>
          <Space direction={isMobile ? 'vertical' : 'horizontal'}>
            <ProfileAvatar avatar={data?.avatar} />
            <Flex vertical>
              <Row>
                <Col flex="auto">
                  <ProfileName
                    fullname={data?.fullName}
                    username={data?.userName}
                    copy={false}
                  />
                </Col>
                <Col flex="none">
                  <Space.Compact block>
                    <Tooltip title="Perbarui Profil">
                      <Button
                        className="icon-profile"
                        icon={<EditOutlined />}
                        onClick={() => setEditProfileModal(true)}
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
                      />
                    </Tooltip>
                  </Space.Compact>
                </Col>
              </Row>
              {data && <ProfileLastUpdate updatedAt={data?.updatedAt} />}
              <ProfileMiniDesc
                createdAt={data?.createdAt}
                admin={data?.admin}
                description={data?.description}
              />
            </Flex>
          </Space>
        </Skeleton>
        <ProfilePlaceList
          data={data?.place}
          loading={isLoading}
          action={true}
        />
      </Flex>
    </>
  );
};

export default ProfilePages;
