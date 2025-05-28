import { NavLink } from "react-router-dom";
import ScrollTop from "../../../common/hooks/Customers/ScrollTop";

// mobile
const Nav_Mobile = () => {
  const arr = [
    {
      path: "",
      name: "Đăng nhập",
    },
    {
      path: "/shops",
      name: "Tiêu chí lựa chọn",
    },
    {
      path: "/blogs",
      name: "Quỳ trình đăng ký",
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
// desktop
export function Nav_Desktop() {
  const handleScroll = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const arr = [
    {
      path: "/",
      name: "Đăng nhập",
      onClick: () => handleScroll("login-section"),
    },
    {
      path: "/",
      name: "Tiêu chí lựa chọn",
      onClick: () => handleScroll("criteria-section"),
    },
    {
      path: "/",
      name: "Quy trình đăng ký",
      onClick: () => handleScroll("procedure-section"),
    },
  ];

  return (
    <nav className="mb:hidden lg:block lg:flex justify-center items-center *:xl:mx-5 *:lg:mx-4 *:font-medium whitespace-nowrap *:capitalize *:relative *:duration-300">
      {arr?.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className="opacity-[0.70] hover:opacity-100 hover:after:w-full hover:after:right-0"
        >
          {item.name}
        </button>
      ))}
    </nav>
  );
}
