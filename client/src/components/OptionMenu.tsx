import React from 'react';
import {
  SettingOutlined,
  UserOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';
import { Link } from 'react-router-dom';

const items: MenuProps['items'] = [
  {
    label: <Link to={'/me'}>Profile</Link>,
    key: 'profile',
    icon: <UserOutlined />,
  },
  {
    type: 'divider',
  },
  {
    label: 'Sign Out',
    key: 'signout',
    icon: <PoweroffOutlined />,
    onClick: () => signOutHandler(),
  },
];

const OptionMenu: React.FC = () => {
  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Button style={{ marginRight: 24 }}>
        <Space>
          <SettingOutlined />
          Settings
        </Space>
      </Button>
    </Dropdown>
  );
};

export default OptionMenu;

const signOutHandler = () => {
  console.log('Function not implemented.');
};
