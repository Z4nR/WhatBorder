import { profileUser } from '@/utils/networks';
import { useQuery } from '@tanstack/react-query';
import { Col, Flex, Row, Skeleton, Space } from 'antd';
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
import ProfileMiniTool from '@/components/general/profile/ProfileMiniTool';
import DeleteProfile from '@/components/general/modal/DeleteProfile';

const ProfilePages: React.FC = () => {
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [deleteProfileModal, setDeleteProfileModal] = useState(false);

  const isMobile = useMediaQuery({
    query: '(max-width: 600px)',
  });

  const { data, isLoading } = useQuery({
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
            username: data?.userName,
            fullname: data?.fullName,
            description: data?.description,
          }}
        />
      )}
      {deleteProfileModal && (
        <DeleteProfile
          state={deleteProfileModal}
          setState={setDeleteProfileModal}
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
                  <ProfileMiniTool
                    setEdit={setEditProfileModal}
                    setDelete={setDeleteProfileModal}
                    myId={data?.me}
                  />
                </Col>
              </Row>
              {data && <ProfileLastUpdate loginAt={data?.loginAt} />}
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
