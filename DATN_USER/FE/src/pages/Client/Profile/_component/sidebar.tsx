import type { MenuProps } from "antd";
import { Menu, Modal } from "antd";
import { BellRing, Box, LogOut, User } from "lucide-react";
import React, { useState } from "react";
import { LiaShippingFastSolid } from "react-icons/lia";
import { SiAwssecretsmanager } from "react-icons/si";
import { NavLink } from "react-router-dom";
import useLogout from "../../../../common/hooks/Auth/Logout";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem;
}

const Sidebar_Profile: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roleAdmin = user?.user?.role;
  const { mutate } = useLogout();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    mutate();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const items: MenuItem[] = [
    getItem("Thông tin tài khoản", "1", <User className="h-5" />, [
      getItem(<NavLink to="/profile">Hồ sơ</NavLink>, "1-1"),
      getItem(<NavLink to="/profile/address">Địa chỉ</NavLink>, "1-2"),
      getItem(
        <NavLink to="/profile/change-password">Đổi mật khẩu</NavLink>,
        "1-3"
      )
    ]),
    // getItem(
    //   <NavLink to="/favourite">Yêu thích</NavLink>,
    //   "2",
    //   <Heart className="h-5" />
    // ),
    getItem(
      <NavLink to={`/profile/list_order`}>Đơn hàng của tôi</NavLink>,
      "3",
      <Box className="h-5" />
    ),
    getItem(
      <NavLink to={`/profile/notification`}>Thông báo</NavLink>,
      "10",
      <BellRing className="h-5" />
    ),
    ...(roleAdmin === "admin"
      ? [
          getItem(
            <NavLink to={`/admin`}>Chế độ quản lý</NavLink>,
            "4",
            <SiAwssecretsmanager className="w-5 h-10 bold-icon" />
          )
        ]
      : []),
    ...(roleAdmin === "courier"
      ? [
          getItem(
            <NavLink to={`/admin/orders`}>Đơn hàng cần giao</NavLink>,
            "4",
            <LiaShippingFastSolid className="w-5 h-10 bold-icon" />
          )
        ]
      : []),
    {
      type: "divider"
    },
    getItem(
      <p onClick={showModal}>Đăng xuất</p>,
      "5",
      <LogOut className="h-5 " />
    )
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  return (
    <>
      <Menu
        onClick={onClick}
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
        className="p-2"
      />
      <Modal
        title="Bạn có chắc muốn đăng xuất không?"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Đăng xuất"
        cancelText="Trở lại"
      >
        <p>Tài khoản của bạn sẽ được đăng xuất</p>
      </Modal>
    </>
  );
};

export default Sidebar_Profile;
