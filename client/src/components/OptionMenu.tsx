import React, { useState } from 'react';
import {
  SettingOutlined,
  UserOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

const items: MenuProps['items'] = [
  {
    label: 'Settings',
    key: 'setting',
    icon: <SettingOutlined />,
    children: [
      {
        label: 'Profile',
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
      },
    ],
  },
];

const OptionMenu: React.FC = () => {
  const [current, setCurrent] = useState('');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      mode="horizontal"
      items={items}
      selectedKeys={[current]}
    />
  );
};

export default OptionMenu;
