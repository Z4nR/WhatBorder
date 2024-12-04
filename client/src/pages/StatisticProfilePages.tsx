import {
  ProfileAvatar,
  ProfileLastUpdate,
  ProfileName,
} from '@/components/general/profile/ProfileData';
import ProfileMiniDesc from '@/components/general/profile/ProfileMiniDesc';
import ProfilePlaceList from '@/components/general/profile/ProfilePlaceList';
import BreadcrumbComponent from '@/components/general/utils/Breadcrumb';
import { userDetail } from '@/utils/networks';
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
import { ShareAltOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';

const StatisticProfilePages: React.FC = () => {
  const { id } = useParams();

  const isMobile = useMediaQuery({
    query: '(max-width: 600px)',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: async () => await userDetail(id),
  });

  const shareProfile = () => {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`${baseUrl}${data?.me}`)
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
                    copy={true}
                  />
                </Col>
                <Col flex="none">
                  <Space.Compact block>
                    <Tooltip title="Bagikan Profil">
                      <Button
                        className="icon-profile"
                        icon={<ShareAltOutlined />}
                        onClick={() => shareProfile()}
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
          action={false}
        />
      </Flex>
    </>
  );
};

export default StatisticProfilePages;