import React from "react";
import Sidebar_Dashboard from "../components/common/Admin/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Admin/Header/Header";
import { CheckAuths } from "../common/hooks/Auth/useAuthorization";
import MessAdmin from "../pages/Admin/Messenger/MessAdmin";

const AdminLayout: React.FC = () => {
  return (
    <CheckAuths roles={["admin", "courier"]}>
      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <div className="w-[250px] bg-[#1C2434] pt-4 border-r z-[100] border-gray-600 fixed top-0 left-0 h-full">
          <Sidebar_Dashboard />
        </div>

        {/* Main content */}
        <div className="flex-1 ml-[250px] bg-[#F1F5F9] flex flex-col">
          <div className="fixed top-0 left-[250px] w-[calc(100%-200px)] bg-[#171821] text-gray-100 z-10">
            <Header />
          </div>
          <div className="pt-[20px] flex-1 mt-16">
            <Outlet />
          </div>
          <MessAdmin />
          <div className="py-4 text-center">
            Copyright by ©{new Date().getFullYear()} Created by Seven
          </div>
        </div>
      </div>
    </CheckAuths>
  );
};

export default AdminLayout;
