import { NavLink } from "react-router-dom";
import ScrollTop from "../../../common/hooks/Customers/ScrollTop";

// mobile
const Nav_Mobile = () => {
  const arr = [
    {
      path: "",
      name: "Trang chủ",
    },
    {
      path: "/shops",
      name: "Sản phẩm",
    },
    {
      path: "/blogs",
      name: "Bài viết",
    },
    {
      path: "/contact",
      name: "Liên hệ",
    },
    {
      path: "/about-us",
      name: "Về chúng tôi",
    },
    {
      path: "/track-order",
      name: "Tra cứu đơn hàng",
    },
  ];

  return (
    <nav className="flex flex-col justify-between text-gray-900 *:my-1 *:px-8 *:py-2 *:font-medium *:capitalize *:relative *:duration-300">
      {arr?.map((item: { path: string; name: string }) => (
        <NavLink
          key={item.path}
          onClick={ScrollTop}
          className={({ isActive }) =>
            isActive
              ? "opacity-100 bg-gray-200"
              : "opacity-[0.70] hover:bg-gray-200"
          }
          to={item.path}
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default Nav_Mobile;

// desktop
export function Nav_Desktop() {
  const arr = [
    {
      path: "",
      name: "Trang chủ",
    },
    {
      path: "/shops",
      name: "Sản phẩm",
    },
    {
      path: "/blogs",
      name: "Bài viết",
    },
    {
      path: "/contact",
      name: "Liên hệ",
    },
    {
      path: "/about-us",
      name: "Về chúng tôi",
    },
    {
      path: "/track-order",
      name: "Tra cứu đơn hàng",
    },
  ];

  return (
    <nav
      className="mb:hidden lg:block lg:flex justify-between items-center *:xl:mx-5 *:lg:mx-4 *:font-medium whitespace-nowrap
         *:capitalize *:relative *:duration-300 *:after:content-[''] *:after:duration-300 *:after:absolute *:after:w-0 *:after:right-1/2 *:after:bottom-[-30%] *:after:h-[2px] *:after:bg-gray-100
          *:after:rounded-lg *:before:content-[''] *:before:absolute *:before:h-[2px] *:before:right-0 *:before:bg-gray-100  *:before:bottom-[-30%]  *:before:rounded-lg"
    >
      {arr?.map((item: { path: string; name: string }) => (
        <NavLink
          key={item.path}
          onClick={ScrollTop}
          className={({ isActive }) =>
            isActive
              ? "opacity-100 before:w-full"
              : "opacity-[0.70] hover:opacity-100 hover:after:w-full hover:after:right-0"
          }
          to={item.path}
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}
