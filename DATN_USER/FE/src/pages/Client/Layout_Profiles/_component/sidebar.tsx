import React from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { Box, Heart, LogOut, User } from 'lucide-react';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'sub1',
    label: 'Thông tin tài khoản',
    icon: <User className='h-5' />,
    children: [
      { key: '1', label: 'Hồ sơ' },
      { key: '2', label: 'Địa chỉ' },
      { key: '3', label: 'Đổi mật khẩu' },
    ],
  },
  {
    key: 'sub2',
    label: 'Yêu thích',
    icon: <Heart className='h-5'/>,
  },
  {
    key: 'sub2',
    label: 'Đơn hàng của tôi',
    icon: <Box className='h-5'/>,
  },
  {
    type: 'divider',
  },
  {
    key: 'sub4',
    label: 'Đăng xuất',
    icon: <LogOut className='rotate-[180deg] h-5'/>,
  },
];

const Sidebar_Profile: React.FC = () => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  return (
    <Menu
      onClick={onClick}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};

export default Sidebar_Profile;