import {
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useAuthState from '../utils/state/auth/authState';
import useUserState from '../utils/state/user/userState';

const OptionMenu: React.FC = () => {
  const navigate = useNavigate();
  const authState = useAuthState();
  const userState = useUserState();

  const handleSignOut = () => {
    authState.deleteToken();
    userState.clearUser();

    navigate('/auth', { replace: true });
  };

  const items: MenuProps['items'] = [
    {
      label: <Link to={'/me'}>Profil</Link>,
      key: 'profile',
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      label: 'Keluar',
      key: 'signout',
      icon: <LogoutOutlined />,
      onClick: () => handleSignOut(),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Button style={{ marginRight: 24 }}>
        <Space>
          <SettingOutlined />
          Setelan
        </Space>
      </Button>
    </Dropdown>
  );
};

export default OptionMenu;
