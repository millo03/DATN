import {
  Box,
  ChevronDown,
  Contact,
  LayoutDashboard,
  Shirt,
  TicketPercent,
  Trash2,
  Truck,
  User2,
} from "lucide-react";
import { useState } from "react";
import logo from "../../../../assets/Images/Logo/logo white.png";
import { Link, NavLink } from "react-router-dom";
import { MdAccessAlarm } from "react-icons/md";
import { AiFillDollarCircle } from "react-icons/ai";
import { IoIosStats } from "react-icons/io";

export default function Sidebar_Dashboard() {
  const [expandedSection, setExpandedSection] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.user?.role;
  const toggleExpand = (section: any) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <aside className="mx-auto h-screen w-[230px] text-gray-100 *:text-sm *:font-medium flex flex-col gap-y-3">
      <div className="items-center px-2 py-1">
        <img src={logo} alt="" className="w-[242px] h-[45px]" />
      </div>

      {role === "courier" && (
        <div>
          <div className="*:px-2">
            <Link
              to={`/courier/orders`}
              className="flex items-center w-full py-3 text-left gap-x-4"
            >
              <Box />
              <span className=" text-[#c4cee3]">Đơn Hàng Chờ</span>
            </Link>
          </div>
          <div className="*:px-2">
            <Link
              to={`/courier/orders_history`}
              className="flex items-center w-full py-3 text-left gap-x-4"
            >
              <MdAccessAlarm className="text-2xl" />
              <span className=" text-[#c4cee3]">Lịch sử giao hàng</span>
            </Link>
          </div>
          {/* <div className="*:px-2">
            <Link
              to={`/courier/salary_shipper`}
              className="flex items-center w-full py-3 text-left gap-x-4"
            >
              <AiFillDollarCircle className="text-2xl" />
              <span className=" text-[#c4cee3]">Lương</span>
            </Link>
          </div>
          <div className="*:px-2">
            <Link
              to={`/courier/dashboard_Shipper`}
              className="flex items-center w-full py-3 text-left gap-x-4"
            >
              <IoIosStats className="text-2xl" />
              <span className=" text-[#c4cee3]">Thống kê đơn hàng</span>
            </Link>
          </div> */}
        </div>
      )}
    </aside>
  );
}
