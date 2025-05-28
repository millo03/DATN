import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import ScrollTop from "../../../common/hooks/Customers/ScrollTop";
import Nav_Mobile, { Nav_Desktop } from "./Nav";

import { List_Auth } from "../../../common/hooks/Auth/querry_Auth";
import { message } from "antd";
import logo from "../../../assets/Images/Logo/logo white.png";

const Header = () => {
  const [messageAPI, contentHolder] = message.useMessage();
  const ref_user = useRef<HTMLAnchorElement>(null);
  const ref_login = useRef<HTMLAnchorElement>(null);
  const [toggle_Menu_Mobile, setToggle_Menu_Mobile] = useState<boolean>(false);
  const toggleFixedHeader = useRef<HTMLDivElement>(null);
  const toggleForm = useRef<HTMLFormElement>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const account = user?.user?._id;

  useEffect(() => {
    typeof window !== "undefined" &&
      window.addEventListener("scroll", () => {
        if (toggleFixedHeader.current && toggleForm.current) {
          window.scrollY > 100
            ? (toggleFixedHeader.current.classList.add(
                "animate-[animationScrollYHeader_1s]",
                "lg:-translate-y-3"
              ),
              toggleForm.current.classList.add("scale-0"))
            : (toggleFixedHeader.current.classList.remove(
                "animate-[animationScrollYHeader_1s]",
                "lg:-translate-y-3"
              ),
              toggleForm.current.classList.remove("scale-0"));
        }
      });
  }, []);
  useEffect(() => {
    function change_local() {
      if (account) {
        ref_login.current?.classList.add("hidden");
        ref_login.current?.classList.remove("block");
        ref_user.current?.classList.add("block");
        ref_user.current?.classList.remove("hidden");
      } else {
        ref_login.current?.classList.add("block");
        ref_login.current?.classList.remove("hidden");
        ref_user.current?.classList.add("hidden");
        ref_user.current?.classList.remove("block");
      }
    }
    change_local();
    window.addEventListener("storage", change_local);
    return () => {
      window.removeEventListener("storage", change_local);
    };
  }, [account]);

  const toggleMenuMobile = () => {
    setToggle_Menu_Mobile(!toggle_Menu_Mobile);
  };

  return (
    <>
      <div
        ref={toggleFixedHeader}
        className="w-full fixed top-0 z-[100] !bg-[#001529] text-white"
      >
        {contentHolder}
        <header className="mx-auto relative max-w-[1440px] flex justify-between items-center mb:w-[95vw] lg:h-20 lg:py-0 py-3">
          {/* menu mobile */}
          <button
            onClick={toggleMenuMobile}
            className="*:w-[30px] *:h-[30px] cursor-pointer mb:block lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>

          {/* toggle menu mobile */}
          <div
            style={{
              transform: toggle_Menu_Mobile
                ? "translateX(0%)"
                : "translateX(-200%)",
            }}
            className="lg:hidden fixed w-[40vw] duration-300 z-[-1] py-2 bg-white top-[50px] left-0 rounded"
          >
            <Nav_Mobile />
          </div>

          <div className="flex items-center">
            {/* logo */}
            <Link
              onClick={ScrollTop}
              to="/"
              className="lg:relative absolute lg:left-0 lg:translate-x-0 left-[35%] -translate-x-full h-auto mr-2 flex items-start"
            >
              <img
                className="lg:w-[100px] md:h-[40px] lg:h-[30px]"
                src={logo}
                alt="Logo"
              />
            </Link>

            {/* menu desktop */}
            <div className="flex-grow flex justify-center ml-[100px] ">
              <Nav_Desktop />
            </div>
          </div>
        </header>
      </div>
      {/* form search mobile */}
      <form
        ref={toggleForm}
        className={`relative w-[298px] *:h-[36px] lg:invisible gap-x-2 shadow-2xl mt-6 duration-300 mx-auto top-[50px]`}
      >
        <input
          type="text"
          className="w-full pl-5 text-sm font-normal text-gray-700 border rounded-full outline-none pr-14"
          placeholder="Search"
        />
        <button className="absolute top-0 right-[2%] rounded-[50%] w-[36px] duration-300 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="mx-auto size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </form>

      {/* lớp phủ */}
      <div
        onClick={toggleMenuMobile}
        style={{ display: toggle_Menu_Mobile ? "block" : "none" }}
        className="fixed w-screen border-none z-[1] top-0 left-0 h-screen bg-[#33333388]"
      ></div>
    </>
  );
};

export default Header;
