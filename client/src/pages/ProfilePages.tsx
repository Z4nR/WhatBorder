import { profileUser } from '@/utils/networks';
import { useQuery } from '@tanstack/react-query';
import { Button, Col, Flex, Row, Skeleton, Space, Tooltip } from 'antd';
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

  const myProfile = useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => await profileUser(),
  });

  return (
    <>
      {editProfileModal && (
        <EditProfile
          state={editProfileModal}
          setState={setEditProfileModal}
          initialValue={{
            username: myProfile.data?.userName,
            fullname: myProfile.data?.fullName,
            description: myProfile.data?.description,
          }}
        />
      )}
      <BreadcrumbComponent title="Profil Pengguna" buttonTitle="Kembali" />
      <Flex gap={'middle'} vertical>
        <Skeleton
          loading={myProfile.isLoading}
          active
          avatar
          paragraph={{ rows: 2 }}
        >
          <Space direction={isMobile ? 'vertical' : 'horizontal'}>
            <ProfileAvatar avatar={myProfile.data?.avatar} />
            <Flex vertical>
              <Row>
                <Col flex="auto">
                  <ProfileName
                    fullname={myProfile.data?.fullName}
                    username={myProfile.data?.userName}
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
              {myProfile.data && (
                <ProfileLastUpdate updatedAt={myProfile.data?.updatedAt} />
              )}
              <ProfileMiniDesc
                createdAt={myProfile.data?.createdAt}
                admin={myProfile.data?.admin}
                description={myProfile.data?.description}
              />
            </Flex>
          </Space>
        </Skeleton>
        <ProfilePlaceList
          data={myProfile.data?.place}
          loading={myProfile.isLoading}
        />
      </Flex>
    </>
  );
};

export default ProfilePages;
