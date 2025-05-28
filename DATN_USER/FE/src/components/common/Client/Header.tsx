/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { List_Cart } from "../../../common/hooks/Cart/querry_Cart";
import ScrollTop from "../../../common/hooks/Customers/ScrollTop";
import { IProduct } from "../../../common/interfaces/Product";
import useSearch from "../../../systems/utils/useSearch";
import Nav_Mobile, { Nav_Desktop } from "./Nav";
import { List_Auth } from "../../../common/hooks/Auth/querry_Auth";
import { Heart, Search, ShoppingCart } from "lucide-react";
import { useListFavouriteProducts } from "../../../common/hooks/FavoriteProducts/FavoriteProduct";
import { message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import logo from "../../../assets/Images/Logo/logo white.png";
import { AiOutlineBell } from "react-icons/ai";
import { Query_notification } from "../../../_lib/React_Query/Notification/Query";
import useStoreZustand from "../../../Stores/useStore";
const Header = () => {
  const { isVisible } = useStoreZustand();
  const [messageAPI, contentHolder] = message.useMessage();
  const {
    query,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    handleSearch,
    searchRef,
    isLoading,
    handleInputChange,
    searchError,
  } = useSearch();
  const ref_user = useRef<HTMLAnchorElement>(null);
  const ref_login = useRef<HTMLAnchorElement>(null);
  const [toggle_Menu_Mobile, setToggle_Menu_Mobile] = useState<boolean>(false);
  const toggleFixedHeader = useRef<HTMLDivElement>(null);
  const toggleForm = useRef<HTMLFormElement>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const account = user?.user?._id;
  const { data: Favouritedata } = useListFavouriteProducts(account);
  const { data } = List_Cart(account);
  const role = user?.user?.role;
  const { data: notification } = Query_notification(account, role);
  const count_item_cart =
    data?.products?.filter((item: any) => item?.productId) ?? [];
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

  const { data: getUser } = List_Auth(account);
  const toggleMenuMobile = () => {
    setToggle_Menu_Mobile(!toggle_Menu_Mobile);
  };
  const onlogin = () => {
    if (!account) {
      messageAPI.open({
        type: "warning",
        content: "Hãy đăng nhập tài khoản của bạn !!",
      });
    }
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

          <div className="flex items-center gap-x-5">
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

            {/* menu desktop  ahihi test commit*/}
            {/* map() => render routing*/}
            <Nav_Desktop />
          </div>

          {/* options */}
          <nav className="flex items-center justify-between *:mx-3 *:duration-300">
            {/* search */}

            <div ref={searchRef} className="relative w-full max-w-xl">
              <form
                onSubmit={handleSearch}
                className="relative w-[300px] h-[36px] hidden lg:block  duration-300"
              >
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Tìm kiếm..."
                  className="w-[300px]  h-full pl-5 text-sm font-normal text-gray-800 border border-gray-400 rounded outline-none focus:border-black pr-14"
                />
                <button
                  type="submit"
                  onClick={ScrollTop}
                  className="absolute grid place-items-center text-black top-0 right-0 rounded-[50%] w-[36px] h-[36px] duration-300 cursor-pointer"
                >
                  <Search size={20} />
                </button>
              </form>
              {searchError && (
                <div className="absolute w-[300px] mt-2 bg-white border border-gray-300 rounded-md px-4 py-2 text-black">
                  {searchError}
                </div>
              )}
              {showSuggestions && query.length > 0 && !searchError && (
                <div className="search-results absolute w-[300px] mt-2 bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center px-4 py-2 text-gray-700">
                      <LoadingOutlined />
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul>
                      {suggestions.slice(0, 5).map((suggestion: IProduct) => (
                        <Link
                          onClick={() => setShowSuggestions(false)}
                          to={`/shops/${suggestion._id}`}
                          key={suggestion._id}
                          className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          <img
                            src={suggestion.image_product}
                            alt={suggestion.name_product}
                            className="w-12 h-12 mr-2"
                          />
                          <p className="text-black hover:underline line-clamp-1">
                            {suggestion.name_product}
                          </p>
                        </Link>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-2 text-gray-700 break-words">
                      Tìm kiếm "{query}"
                    </div>
                  )}
                  {suggestions.length > 5 && (
                    <div className="px-4 py-2 text-center">
                      <button
                        onClick={handleSearch}
                        className="text-blue-500 hover:underline"
                      >
                        Xem tất cả
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link
              className="group *:duration-300 relative py-1"
              onClick={ScrollTop}
              to={account ? "/cart" : "/login"}
            >
              {data?.products && data?.products.length > 0 && (
                <span className="absolute bg-red-500 px-1.5 text-white text-xs py-[1px] rounded-xl -top-0.5 -right-2 z-10">
                  {count_item_cart?.length}
                </span>
              )}
              <div className="group-hover:scale-110 opacity-75 hover:opacity-100 *:w-5 *:h-5 relative z-0">
                <ShoppingCart />
                {/* <MiniCart /> */}
              </div>
              {isVisible && (
                <div className="animation_add_cart absolute w-4 h-4 lg:w-8 lg:h-8 rounded-full">
                  <img
                    width={40}
                    height={40}
                    className="rounded-full"
                    src={isVisible}
                    alt="."
                  />
                </div>
              )}
            </Link>

            {/* heart */}
            {account ? (
              <>
                <Link
                  to={"/favourite"}
                  className="group *:duration-300 relative py-1"
                >
                  {Favouritedata?.products?.length > 0 ? (
                    <span className="absolute bg-red-500 w-4 h-4 grid place-items-center text-white text-xs py-[1px] px-[1px] rounded-xl -top-0.5 -right-2 z-10">
                      {Favouritedata?.products?.length}
                    </span>
                  ) : (
                    ""
                  )}

                  <div className="group-hover:scale-110 opacity-75 hover:opacity-100 *:w-5 *:h-5 relative z-0">
                    <Heart />
                  </div>
                </Link>
              </>
            ) : (
              <>
                <div
                  onClick={() => onlogin()}
                  className="opacity-75 hover:opacity-100 hover:scale-[1.1]"
                >
                  <Heart />
                </div>
              </>
            )}
            <Link
              className="group *:duration-300 relative py-1"
              onClick={ScrollTop}
              to="profile/notification"
            >
              {notification?.notifications &&
                notification?.notifications.filter(
                  (noti: any) => !noti.status_notification
                ).length > 0 && (
                  <span className="absolute bg-red-500 px-1.5 text-white text-xs py-[1px] rounded-xl -top-0.5 -right-2 z-10">
                    {
                      notification?.notifications.filter(
                        (noti: any) => !noti.status_notification
                      ).length
                    }
                  </span>
                )}
              <div className="group-hover:scale-110 opacity-75 hover:opacity-100 *:w-5 *:h-5 relative z-0">
                <AiOutlineBell />
              </div>
            </Link>

            {/* option / menu */}
            <div
              onClick={ScrollTop}
              className="duration-300 cursor-pointer hover:scale-105 "
            >
              <Link ref={ref_user} to={"/profile"}>
                <img
                  src={getUser?.avatar ? getUser?.avatar : ""}
                  alt=""
                  className="w-14 h-8 rounded-full"
                />
              </Link>
              <Link
                ref={ref_login}
                to={"/login"}
                className="bg-white px-4 py-1.5 text-black rounded font-medium text-sm border-none"
              >
                Login
              </Link>
            </div>
          </nav>
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
