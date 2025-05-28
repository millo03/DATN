// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   Box,
//   ChevronDown,
//   Contact,
//   LayoutDashboard,
//   Shirt,
//   TicketPercent,
//   Truck,
//   User2,
// } from "lucide-react";
// import { useState } from "react";
// import logo from "../../../../assets/Images/Logo/logo white.png";
// import { Link, NavLink } from "react-router-dom";

// export default function Sidebar_Dashboard() {
//   const [expandedSection, setExpandedSection] = useState(null);
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const role = user?.user?.role;
//   const toggleExpand = (section: any) => {
//     setExpandedSection(expandedSection === section ? null : section);
//   };

//   return (
//     <aside className="mx-auto h-screen w-[230px] text-gray-100 *:text-sm *:font-medium flex flex-col gap-y-3 hidden_scroll_x overflow-y-auto" >
//       <div className="items-center px-2 py-1">
//         <Link to={"/"}>
//           <img src={logo} alt="" className="w-[242px] h-[45px]" />
//         </Link>
//       </div>
//       {role === "admin" && (
//         <>
//           {" "}
//           <div className="whitespace-nowrap *:text-sm *:px-2">
//             <button
//               onClick={() => toggleExpand("dashboard")}
//               className="flex bg-[#333A48] items-center gap-x-4 py-3  w-full text-left"
//             >
//               <LayoutDashboard />
//               <span className="text-[#c4cee3]">Bảng điều khiển</span>
//               <ChevronDown
//                 className={`ml-auto transform ${
//                   expandedSection === "dashboard" ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {expandedSection === "dashboard" && (
//               <div className="mt-2 ml-8">
//                 <NavLink
//                   to="/admin"
//                   className="flex items-center px-2 py-3 text-gray-300 hover:text-white"
//                 >
//                   Tổng quan
//                 </NavLink>
//                 <NavLink
//                   to="/admin/notification"
//                   className="flex items-center px-2 py-3 text-gray-300 hover:text-white"
//                 >
//                   Thông báo
//                 </NavLink>
//               </div>
//             )}
//           </div>
//           <div className="*:px-2">
//             <button
//               onClick={() => toggleExpand("products")}
//               className="flex items-center w-full py-3 text-left gap-x-4"
//             >
//               <Shirt />
//               <span className="text-[#c4cee3]">Sản phẩm</span>
//               <ChevronDown
//                 className={`ml-auto transform ${
//                   expandedSection === "products" ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {expandedSection === "products" && (
//               <div className="mt-2 ml-8">
//                 <NavLink
//                   to="/admin/products"
//                   className="flex items-center px-2 py-3 text-gray-300 hover:text-white"
//                 >
//                   Danh sách sản phẩm
//                 </NavLink>
//                 <NavLink
//                   to="/admin/products/add"
//                   className="flex items-center px-2 py-3 text-gray-300 hover:text-white"
//                 >
//                   Thêm mới sản phẩm
//                 </NavLink>
//                 <NavLink
//                   to="/admin/products/the_loai_thuoc_tinh"
//                   className="flex items-center px-2 py-3 text-gray-300 hover:text-white"
//                 >
//                   Thuộc tính sản phẩm
//                 </NavLink>
//                 <NavLink
//                   to="/admin/category"
//                   className="flex items-center px-2 py-3 text-gray-300 hover:text-white"
//                 >
//                   Quản lý danh mục
//                 </NavLink>
//                 <NavLink
//                   to="/admin/trash"
//                   className="flex items-center px-2 py-3 text-gray-300 hover:text-white"
//                 >
//                   Thùng rác
//                 </NavLink>
//               </div>
//             )}
//           </div>
//           {/* <div>
//         <div className="*:px-2">
//           <button
//             onClick={() => toggleExpand("attribute")}
//             className="flex items-center w-full py-3 text-left gap-x-4"
//           >
//             <Palette />
//             <span className=" text-[#c4cee3]">Thuộc Tính</span>
//             <ChevronDown
//               className={`ml-auto transform ${
//                 expandedSection === "attribute" ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {expandedSection === "attribute" && (
//             <div className="mt-2 ml-8">
//               <NavLink
//                 to="/admin/products"
//                 className="flex items-center px-2 py-3 text-gray-300 hover:text-white"
//               >
//                 Màu sắc
//               </NavLink>
//               <NavLink
//                 to="/admin/products/add"
//                 className="flex items-center px-2 py-3 text-gray-300 hover:text-white"
//               >
//                 Kích Cỡ
//               </NavLink>
//             </div>
//           )}
//         </div>
//       </div> */}
//           <div className="*:px-2">
//             <Link
//               to={`/admin/orders`}
//               className="flex items-center w-full py-3 text-left gap-x-4"
//             >
//               <Box />
//               <span className=" text-[#c4cee3]">Đơn Hàng</span>
//             </Link>
//           </div>
//           <div className="*:px-2">
//             <Link
//               to={`/admin/auth`}
//               className="flex items-center w-full py-3 text-left gap-x-4"
//             >
//               <User2 />
//               <span className=" text-[#c4cee3]">Tài khoản</span>
//             </Link>
//           </div>
//           <div className="*:px-2">
//             <Link
//               to={`/admin/voucher`}
//               className="flex items-center w-full py-3 text-left gap-x-4"
//             >
//               <TicketPercent />
//               <span className=" text-[#c4cee3]">Mã giảm giá</span>
//             </Link>
//           </div>
//           <div className="*:px-2">
//             <Link
//               to={`/admin/deliveries`}
//               className="flex items-center w-full py-3 text-left gap-x-4"
//             >
//               <Truck />
//               <span className=" text-[#c4cee3]">Người giao hàng</span>
//             </Link>
//           </div>
//           <div className="*:px-2">
//             <Link
//               to={`/admin/contact`}
//               className="flex items-center w-full py-3 text-left gap-x-4"
//             >
//               <Contact />
//               <span className=" text-[#c4cee3]">Liên hệ</span>
//             </Link>
//           </div>
//           <div className="*:px-2">
//             <Link
//               to={`/admin/blogs`}
//               className="flex items-center w-full py-3 text-left gap-x-4"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 stroke-width="2"
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 className="lucide lucide-letter-text"
//               >
//                 <path d="M15 12h6" />
//                 <path d="M15 6h6" />
//                 <path d="m3 13 3.553-7.724a.5.5 0 0 1 .894 0L11 13" />
//                 <path d="M3 18h18" />
//                 <path d="M4 11h6" />
//               </svg>
//               <span className="text-[#c4cee3]">Bài viết</span>
//             </Link>
//           </div>
//           {/* <div className="*:px-2">
//             <Link
//               to={`/admin/TotalOrders`}
//               className="flex items-center w-full py-3 text-left gap-x-4"
//             >
//               <span className=" text-[#c4cee3]">Tổng số đơn shipper</span>
//             </Link>
//           </div> */}
//         </>
//       )}
//       {role === "courier" && (
//         <div>
//           <div className="*:px-2">
//             <Link
//               to={`/admin/orders`}
//               className="flex items-center w-full py-3 text-left gap-x-4"
//             >
//               <Box />
//               <span className=" text-[#c4cee3]">Đơn Hàng</span>
//             </Link>
//           </div>
//           <div className="*:px-2">
//             <Link
//               to={`/admin/TotalOrders`}
//               className="flex items-center w-full py-3 text-left gap-x-4"
//             >
//               <span className=" text-[#c4cee3]">Tổng số đơn shipper</span>
//             </Link>
//           </div>
//         </div>
//       )}
//     </aside>
//   );
// }
// import {
//   Box,
//   ChevronDown,
//   Contact,
//   LayoutDashboard,
//   Shirt,
//   TicketPercent,
//   Truck,
//   User2,
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import logo from "../../../../assets/Images/Logo/logo white.png";
// import { Link, NavLink, useLocation } from "react-router-dom";

// export default function Sidebar_Dashboard() {
//   const [expandedSection, setExpandedSection] = useState<string | null>("dashboard"); // Mặc định mở dashboard
//   const [activeItem, setActiveItem] = useState<string>("/admin"); // Mặc định Tổng quan
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const role = user?.user?.role;
//   const location = useLocation();

//   // Cập nhật activeItem và expandedSection dựa trên route hiện tại
//   useEffect(() => {
//     const path = location.pathname;
//     setActiveItem(path);
//     if (path === "/admin" || path.includes("notification")) {
//       setExpandedSection("dashboard");
//     } else if (
//       path.includes("products") ||
//       path.includes("category") ||
//       path.includes("trash")
//     ) {
//       setExpandedSection("products");
//     } else {
//       setExpandedSection(null); // Đóng tất cả section nếu không phải dashboard hoặc products
//     }
//   }, [location.pathname]);

//   const toggleExpand = (section: string, defaultPath: string) => {
//     if (expandedSection === section) {
//       setExpandedSection(null); // Đóng section
//       setActiveItem(""); // Xóa activeItem khi đóng
//     } else {
//       setExpandedSection(section); // Mở section
//       setActiveItem(defaultPath); // Highlight item con đầu tiên
//     }
//   };

//   const handleItemClick = (path: string) => {
//     setActiveItem(path); // Cập nhật activeItem khi click
//   };

//   return (
//     <aside className="mx-auto h-screen w-[230px] text-gray-100 *:text-sm *:font-medium flex flex-col gap-y-3 hidden_scroll_x overflow-y-auto">
//       <div className="items-center px-2 py-1">
//         <Link to={"/"}>
//           <img src={logo} alt="Logo" className="w-[242px] h-[45px]" />
//         </Link>
//       </div>
//       {role === "admin" && (
//         <>
//           <div className="whitespace-nowrap *:text-sm *:px-2">
//             <button
//               onClick={() => toggleExpand("dashboard", "/admin")}
//               className={`flex items-center gap-x-4 py-3 w-full text-left ${
//                 activeItem === "/admin" || activeItem.includes("notification")
//                   ? "bg-[#4A5568] text-white"
//                   : "bg-[#333A48] text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
//               }`}
//             >
//               <LayoutDashboard />
//               <span>Bảng điều khiển</span>
//               <ChevronDown
//                 className={`ml-auto transform ${
//                   expandedSection === "dashboard" ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {expandedSection === "dashboard" && (
//               <div className="mt-2 ml-8">
//                 <NavLink
//                   to="/admin"
//                   onClick={() => handleItemClick("/admin")}
//                   className={`flex items-center px-2 py-3 ${
//                     activeItem === "/admin"
//                       ? "text-white bg-[#4A5568]"
//                       : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
//                   }`}
//                 >
//                   Tổng quan
//                 </NavLink>
//                 <NavLink
//                   to="/admin/notification"
//                   onClick={() => handleItemClick("/admin/notification")}
//                   className={`flex items-center px-2 py-3 ${
//                     activeItem === "/admin/notification"
//                       ? "text-white bg-[#4A5568]"
//                       : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
//                   }`}
//                 >
//                   Thông báo
//                 </NavLink>
//               </div>
//             )}
//           </div>
//           <div className="*:px-2">
//             <button
//               onClick={() => toggleExpand("products", "/admin/products")}
//               className={`flex items-center w-full py-3 text-left gap-x-4 ${
//                 activeItem.includes("products") ||
//                 activeItem.includes("category") ||
//                 activeItem.includes("trash")
//                   ? "bg-[#4A5568] text-white"
//                   : "text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
//               }`}
//             >
//               <Shirt />
//               <span>Sản phẩm</span>
//               <ChevronDown
//                 className={`ml-auto transform ${
//                   expandedSection === "products" ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {expandedSection === "products" && (
//               <div className="mt-2 ml-8">
//                 <NavLink
//                   to="/admin/products"
//                   onClick={() => handleItemClick("/admin/products")}
//                   className={`flex items-center px-2 py-3 ${
//                     activeItem === "/admin/products"
//                       ? "text-white bg-[#4A5568]"
//                       : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
//                   }`}
//                 >
//                   Danh sách sản phẩm
//                 </NavLink>
//                 <NavLink
//                   to="/admin/products/add"
//                   onClick={() => handleItemClick("/admin/products/add")}
//                   className={`flex items-center px-2 py-3 ${
//                     activeItem === "/admin/products/add"
//                       ? "text-white bg-[#4A5568]"
//                       : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
//                   }`}
//                 >
//                   Thêm mới sản phẩm
//                 </NavLink>
//                 <NavLink
//                   to="/admin/products/the_loai_thuoc_tinh"
//                   onClick={() =>
//                     handleItemClick("/admin/products/the_loai_thuoc_tinh")
//                   }
//                   className={`flex items-center px-2 py-3 ${
//                     activeItem === "/admin/products/the_loai_thuoc_tinh"
//                       ? "text-white bg-[#4A5568]"
//                       : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
//                   }`}
//                 >
//                   Thuộc tính sản phẩm
//                 </NavLink>
//                 <NavLink
//                   to="/admin/category"
//                   onClick={() => handleItemClick("/admin/category")}
//                   className={`flex items-center px-2 py-3 ${
//                     activeItem === "/admin/category"
//                       ? "text-white bg-[#4A5568]"
//                       : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
//                   }`}
//                 >
//                   Quản lý danh mục
//                 </NavLink>
//                 <NavLink
//                   to="/admin/trash"
//                   onClick={() => handleItemClick("/admin/trash")}
//                   className={`flex items-center px-2 py-3 ${
//                     activeItem === "/admin/trash"
//                       ? "text-white bg-[#4A5568]"
//                       : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
//                   }`}
//                 >
//                   Thùng rác
//                 </NavLink>
//               </div>
//             )}
//           </div>
//           <div className="*:px-2">
//             <Link
//               to="/admin/orders"
//               onClick={() => handleItemClick("/admin/orders")}
//               className={`flex items-center w-full py-3 text-left gap-x-4 ${
//                 activeItem === "/admin/orders"
//                   ? "bg-[#4A5568] text-white"
//                   : "text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
//               }`}
//             >
//               <Box />
//               <span>Đơn Hàng</span>
//             </Link>
//           </div>
//           <div className="*:px-2">
//             <Link
//               to="/admin/auth"
//               onClick={() => handleItemClick("/admin/auth")}
//               className={`flex items-center w-full py-3 text-left gap-x-4 ${
//                 activeItem === "/admin/auth"
//                   ? "bg-[#4A5568] text-white"
//                   : "text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
//               }`}
//             >
//               <User2 />
//               <span>Tài khoản</span>
//             </Link>
//           </div>
//           <div className="*:px-2">
//             <Link
//               to="/admin/voucher"
//               onClick={() => handleItemClick("/admin/voucher")}
//               className={`flex items-center w-full py-3 text-left gap-x-4 ${
//                 activeItem === "/admin/voucher"
//                   ? "bg-[#4A5568] text-white"
//                   : "text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
//               }`}
//             >
//               <TicketPercent />
//               <span>Mã giảm giá</span>
//             </Link>
//           </div>
//           <div className="*:px-2">
//             <Link
//               to="/admin/deliveries"
//               onClick={() => handleItemClick("/admin/deliveries")}
//               className={`flex items-center w-full py-3 text-left gap-x-4 ${
//                 activeItem === "/admin/deliveries"
//                   ? "bg-[#4A5568] text-white"
//                   : "text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
//               }`}
//             >
//               <Truck />
//               <span>Người giao hàng</span>
//             </Link>
//           </div>
//           <div className="*:px-2">
//             <Link
//               to="/admin/contact"
//               onClick={() => handleItemClick("/admin/contact")}
//               className={`flex items-center w-full py-3 text-left gap-x-4 ${
//                 activeItem === "/admin/contact"
//                   ? "bg-[#4A5568] text-white"
//                   : "text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
//               }`}
//             >
//               <Contact />
//               <span>Liên hệ</span>
//             </Link>
//           </div>
//           <div className="*:px-2">
//             <Link
//               to="/admin/blogs"
//               onClick={() => handleItemClick("/admin/blogs")}
//               className={`flex items-center w-full py-3 text-left gap-x-4 ${
//                 activeItem === "/admin/blogs"
//                   ? "bg-[#4A5568] text-white"
//                   : "text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
//               }`}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="lucide lucide-letter-text"
//               >
//                 <path d="M15 12h6" />
//                 <path d="M15 6h6" />
//                 <path d="m3 13 3.553-7.724a.5.5 0 0 1 .894 0L11 13" />
//                 <path d="M3 18h18" />
//                 <path d="M4 11h6" />
//               </svg>
//               <span>Bài viết</span>
//             </Link>
//           </div>
//         </>
//       )}
//       {role === "courier" && (
//         <div>
//           <div className="*:px-2">
//             <Link
//               to="/admin/orders"
//               onClick={() => handleItemClick("/admin/orders")}
//               className={`flex items-center w-full py-3 text-left gap-x-4 ${
//                 activeItem === "/admin/orders"
//                   ? "bg-[#4A5568] text-white"
//                   : "text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
//               }`}
//             >
//               <Box />
//               <span>Đơn Hàng</span>
//             </Link>
//           </div>
//           <div className="*:px-2">
//             <Link
//               to="/admin/TotalOrders"
//               onClick={() => handleItemClick("/admin/TotalOrders")}
//               className={`flex items-center w-full py-3 text-left gap-x-4 ${
//                 activeItem === "/admin/TotalOrders"
//                   ? "bg-[#4A5568] text-white"
//                   : "text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
//               }`}
//             >
//               <span>Tổng số đơn shipper</span>
//             </Link>
//           </div>
//         </div>
//       )}
//     </aside>
//   );
// }
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  ChevronDown,
  Contact,
  LayoutDashboard,
  Shirt,
  TicketPercent,
  Truck,
  User2
} from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../../../../assets/Images/Logo/logo white.png";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Sidebar_Dashboard() {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "dashboard"
  ); // Mặc định mở dashboard
  const [activeItem, setActiveItem] = useState<string>("/admin"); // Mặc định Tổng quan
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.user?.role;
  const location = useLocation();

  // Cập nhật activeItem và expandedSection dựa trên route hiện tại
  useEffect(() => {
    const path = location.pathname;
    setActiveItem(path);
    if (path === "/admin" || path.includes("notification")) {
      setExpandedSection("dashboard");
    } else if (
      path.includes("products") ||
      path.includes("category") ||
      path.includes("trash")
    ) {
      setExpandedSection("products");
    } else {
      setExpandedSection(null);
    }
  }, [location.pathname]);

  const toggleExpand = (section: string, defaultPath: string) => {
    if (expandedSection === section) {
      setExpandedSection(null); // Đóng section
      setActiveItem(""); // Xóa activeItem khi đóng
    } else {
      setExpandedSection(section); // Mở section
      setActiveItem(defaultPath); // Highlight item con đầu tiên
    }
  };

  const handleItemClick = (path: string) => {
    setActiveItem(path); // Cập nhật activeItem khi click
  };

  return (
    <aside className="mx-auto h-screen w-[230px] bg-[#333A48] text-gray-100 *:text-sm *:font-medium flex flex-col gap-y-3 hidden_scroll_x overflow-y-auto">
      <div className="items-center px-2 py-1">
        <Link to={"/"}>
          <img src={logo} alt="Logo" className="w-[242px] h-[45px]" />
        </Link>
      </div>
      {role === "admin" && (
        <>
          <div className="whitespace-nowrap *:text-sm *:px-2">
            <button
              onClick={() => toggleExpand("dashboard", "/admin")}
              className={`flex items-center gap-x-4 py-3 w-full text-left ${
                activeItem === "/admin" || activeItem.includes("notification")
                  ? "bg-[#4A5568] text-white"
                  : "bg-[#2D3748] text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
              }`}
            >
              <LayoutDashboard />
              <span>Bảng điều khiển</span>
              <ChevronDown
                className={`ml-auto transform ${
                  expandedSection === "dashboard" ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSection === "dashboard" && (
              <div className="mt-2 ml-8">
                <NavLink
                  to="/admin"
                  onClick={() => handleItemClick("/admin")}
                  className={`flex items-center px-2 py-3 ${
                    activeItem === "/admin"
                      ? "text-white bg-[#4A5568]"
                      : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
                  }`}
                >
                  Tổng quan
                </NavLink>
                <NavLink
                  to="/admin/notification"
                  onClick={() => handleItemClick("/admin/notification")}
                  className={`flex items-center px-2 py-3 ${
                    activeItem === "/admin/notification"
                      ? "text-white bg-[#4A5568]"
                      : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
                  }`}
                >
                  Thông báo
                </NavLink>
              </div>
            )}
          </div>
          <div className="*:px-2">
            <button
              onClick={() => toggleExpand("products", "/admin/products")}
              className={`flex items-center w-full py-3 text-left gap-x-4 ${
                activeItem.includes("products") ||
                activeItem.includes("category") ||
                activeItem.includes("trash")
                  ? "bg-[#4A5568] text-white"
                  : "bg-transparent text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
              }`}
            >
              <Shirt />
              <span>Sản phẩm</span>
              <ChevronDown
                className={`ml-auto transform ${
                  expandedSection === "products" ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSection === "products" && (
              <div className="mt-2 ml-8">
                <NavLink
                  to="/admin/products"
                  onClick={() => handleItemClick("/admin/products")}
                  className={`flex items-center px-2 py-3 ${
                    activeItem === "/admin/products"
                      ? "text-white bg-[#4A5568]"
                      : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
                  }`}
                >
                  Danh sách sản phẩm
                </NavLink>
                <NavLink
                  to="/admin/products/add"
                  onClick={() => handleItemClick("/admin/products/add")}
                  className={`flex items-center px-2 py-3 ${
                    activeItem === "/admin/products/add"
                      ? "text-white bg-[#4A5568]"
                      : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
                  }`}
                >
                  Thêm mới sản phẩm
                </NavLink>
                <NavLink
                  to="/admin/products/the_loai_thuoc_tinh"
                  onClick={() =>
                    handleItemClick("/admin/products/the_loai_thuoc_tinh")
                  }
                  className={`flex items-center px-2 py-3 ${
                    activeItem === "/admin/products/the_loai_thuoc_tinh"
                      ? "text-white bg-[#4A5568]"
                      : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
                  }`}
                >
                  Thuộc tính sản phẩm
                </NavLink>
                <NavLink
                  to="/admin/category"
                  onClick={() => handleItemClick("/admin/category")}
                  className={`flex items-center px-2 py-3 ${
                    activeItem === "/admin/category"
                      ? "text-white bg-[#4A5568]"
                      : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
                  }`}
                >
                  Quản lý danh mục
                </NavLink>
                <NavLink
                  to="/admin/trash"
                  onClick={() => handleItemClick("/admin/trash")}
                  className={`flex items-center px-2 py-3 ${
                    activeItem === "/admin/trash"
                      ? "text-white bg-[#4A5568]"
                      : "text-gray-300 hover:text-white hover:bg-[#4A5568]"
                  }`}
                >
                  Thùng rác
                </NavLink>
              </div>
            )}
          </div>
          <div className="*:px-2">
            <Link
              to="/admin/orders"
              onClick={() => handleItemClick("/admin/orders")}
              className={`flex items-center w-full py-3 text-left gap-x-4 ${
                activeItem === "/admin/orders"
                  ? "bg-[#4A5568] text-white"
                  : "bg-transparent text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
              }`}
            >
              <Box />
              <span>Đơn Hàng</span>
            </Link>
          </div>
          <div className="*:px-2">
            <Link
              to="/admin/auth"
              onClick={() => handleItemClick("/admin/auth")}
              className={`flex items-center w-full py-3 text-left gap-x-4 ${
                activeItem === "/admin/auth"
                  ? "bg-[#4A5568] text-white"
                  : "bg-transparent text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
              }`}
            >
              <User2 />
              <span>Tài khoản</span>
            </Link>
          </div>
          <div className="*:px-2">
            <Link
              to="/admin/voucher"
              onClick={() => handleItemClick("/admin/voucher")}
              className={`flex items-center w-full py-3 text-left gap-x-4 ${
                activeItem === "/admin/voucher"
                  ? "bg-[#4A5568] text-white"
                  : "bg-transparent text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
              }`}
            >
              <TicketPercent />
              <span>Mã giảm giá</span>
            </Link>
          </div>
          <div className="*:px-2">
            <Link
              to="/admin/deliveries"
              onClick={() => handleItemClick("/admin/deliveries")}
              className={`flex items-center w-full py-3 text-left gap-x-4 ${
                activeItem === "/admin/deliveries"
                  ? "bg-[#4A5568] text-white"
                  : "bg-transparent text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
              }`}
            >
              <Truck />
              <span>Người giao hàng</span>
            </Link>
          </div>
          <div className="*:px-2">
            <Link
              to="/admin/contact"
              onClick={() => handleItemClick("/admin/contact")}
              className={`flex items-center w-full py-3 text-left gap-x-4 ${
                activeItem === "/admin/contact"
                  ? "bg-[#4A5568] text-white"
                  : "bg-transparent text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
              }`}
            >
              <Contact />
              <span>Liên hệ</span>
            </Link>
          </div>
          <div className="*:px-2">
            <Link
              to="/admin/blogs"
              onClick={() => handleItemClick("/admin/blogs")}
              className={`flex items-center w-full py-3 text-left gap-x-4 ${
                activeItem === "/admin/blogs"
                  ? "bg-[#4A5568] text-white"
                  : "bg-transparent text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-letter-text"
              >
                <path d="M15 12h6" />
                <path d="M15 6h6" />
                <path d="m3 13 3.553-7.724a.5.5 0 0 1 .894 0L11 13" />
                <path d="M3 18h18" />
                <path d="M4 11h6" />
              </svg>
              <span>Bài viết</span>
            </Link>
          </div>
        </>
      )}
      {role === "courier" && (
        <div>
          <div className="*:px-2">
            <Link
              to="/admin/orders"
              onClick={() => handleItemClick("/admin/orders")}
              className={`flex items-center w-full py-3 text-left gap-x-4 ${
                activeItem === "/admin/orders"
                  ? "bg-[#4A5568] text-white"
                  : "bg-transparent text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
              }`}
            >
              <Box />
              <span>Đơn Hàng</span>
            </Link>
          </div>
          <div className="*:px-2">
            <Link
              to="/admin/TotalOrders"
              onClick={() => handleItemClick("/admin/TotalOrders")}
              className={`flex items-center w-full py-3 text-left gap-x-4 ${
                activeItem === "/admin/TotalOrders"
                  ? "bg-[#4A5568] text-white"
                  : "bg-transparent text-[#c4cee3] hover:bg-[#4A5568] hover:text-white"
              }`}
            >
              <span>Tổng số đơn shipper</span>
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
