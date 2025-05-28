import { ShoppingCart } from "lucide-react";
import { HeartIcon } from "../../../resources/svg/Icon/Icon";
import { useState } from "react";

const ListProducts = () => {
  const [isDisplayOpen, setIsDisplayOpen] = useState(false);
  // const [isVisible, setIsVisible] = useState(false);
  const [, setIsVisible] = useState(false);
  // const [activeTab, setActiveTab] = useState("description");
  // const navigate = useNavigate();

  // const handleNavigation = () => {
  //   navigate("/products/detailP");
  // };

  // const handleTabClick = (tab: any) => {
  //   setActiveTab(tab);
  // };

  const showOverlay = () => {
    setIsVisible(true);
    document.body.classList.add("overflow-hidden");
  };

  // const hideOverlay = () => {
  //   setIsVisible(false);
  //   document.body.classList.remove("overflow-hidden");
  // };

  const toggleDisplay = () => {
    setIsDisplayOpen(!isDisplayOpen);
  };

  return (
    <div>
      {/* TAGPRODUCTS */}
      <div className="h-[80px] bg-[#F3F3F3] flex  items-center  ">
        <h2 className="text-2xl font-bold pl-5">Products</h2>
      </div>
      {/* END TAGPRODUCTS */}

      {/*FILTER AND List P */}
      <div className="container mx-auto max-w-[1100px]">
        {/* FILTER PRODUCTS */}
        <div className="flex justify-between items-center pt-10">
          {/* FILTER LEFT */}
          <div className="flex flex-row items-center space-x-4">
            <div>
              <h2>Filter:</h2>
            </div>
            <div>
              <div
                className="flex flex-row items-center space-x-2"
                onClick={toggleDisplay}
              >
                <span>Availability</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
              {isDisplayOpen && (
                <div className="parent-display facets__display bg-white shadow-md rounded-b-md">
                  <div className="facets__header flex justify-between items-center px-4 py-3 border-b border-gray-200">
                    <span className="facets__selected no-js-hidden">
                      selected
                    </span>
                    <a
                      href="/collections/all"
                      className="facets__reset link underlined-link text-blue-500"
                      role="button"
                    >
                      Reset
                    </a>
                  </div>
                  <fieldset className="facets-wrap parent-wrap p-4">
                    <ul
                      className="facets__list list-unstyled no-js-hidden"
                      role="list"
                    >
                      <li className="list-menu__item facets__item">
                        <label
                          htmlFor="Filter-filter.v.availability-1"
                          className="facet-checkbox flex items-center"
                        >
                          <input
                            type="checkbox"
                            name="filter.v.availability"
                            value="1"
                            id="Filter-filter.v.availability-1"
                            className="mr-2"
                          />
                        </label>
                      </li>
                      <li className="list-menu__item facets__item">
                        <label
                          htmlFor="Filter-filter.v.availability-2"
                          className="facet-checkbox flex items-center"
                        >
                          <input
                            type="checkbox"
                            name="filter.v.availability"
                            value="0"
                            id="Filter-filter.v.availability-2"
                            className="mr-2"
                          />
                        </label>
                      </li>
                    </ul>
                  </fieldset>
                </div>
              )}
            </div>
            <div className="flex flex-row items-center space-x-2">
              <span>Brand</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-down"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <span>Product type</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-down"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <span>Color</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-down"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <span>Size</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-down"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          {/*END  FILTER LEFT */}

          {/* FILTERIGHT */}
          <div className="flex flex-row items-center space-x-4">
            <div>
              <h2>Sort by:</h2>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <span>Alphabetically, A-Z</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-down"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <div>
              <h2>62 products</h2>
            </div>
          </div>
          {/*END FILTERIGHT */}
        </div>
        {/* END FILTER PRODUCTS */}

        {/* LIST P */}
        <div className="grid grid-cols-4 gap-4 mt-5">
          {/* INFOR P */}
          <div className="product-card w-full h-auto  overflow-hidden">
            <div className="product-image max-h-80 w-full ">
              <div className="product-actions top-2 pl-56">
                <HeartIcon />
              </div>
              <div className="figure">
                <img
                  src="https://cottonusa.co/cdn/shop/files/navyms_f924065a-9e11-4bd3-868d-43cccb88ed33.png?v=1698295592&width=800"
                  alt="Image"
                  className="Sirv image-main"
                />
                <img
                  src="src/resources/images/products/90chinh-mau-nen.webp"
                  alt="Image"
                  className="Sirv image-hover"
                />
              </div>
              <div className="product-actions absolute bottom-[-230px] left-2 flex ml-[70px] justify-center items-center opacity-0 transition-opacity duration-300">
                <div
                  className="like-button bg-white/80 rounded-full w-[50px] h-[50px]   flex justify-center items-center  cursor-pointer hover:bg-[#F3F3F3] "
                  onClick={showOverlay}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-move-diagonal"
                  >
                    <polyline points="13 5 19 5 19 11" />
                    <polyline points="11 19 5 19 5 13" />
                    <line x1="19" x2="5" y1="5" y2="19" />
                  </svg>
                </div>
                <div className="cart-button bg-white/80 ml-[4px] w-[50px] h-[50px] rounded-full pl-[2px] flex justify-center items-center  cursor-pointer hover:bg-[#F3F3F3]">
                  <ShoppingCart />
                </div>
              </div>
            </div>
            <div className="product-info p-4 text-center">
              <h3 className="product-name text-base font-light mb-1">
                Dép Màu Đen
              </h3>
              <p className="product-brand font-sans mb-2">Thượng Đình</p>
              <div className="product-price">
                <span className="price text-sm font-sans">18.800.000 VND</span>
              </div>
              <div className="text-center mt-2">
                <label className="inline-block cursor-pointer mr-2">
                  {/* <input type="checkbox" className="absolute opacity-0 cursor-pointer" /> */}
                  <img
                    src="../../../src/resources/images/products/90chinh-mau-nen.webp"
                    alt=""
                    className="w-7 h-7 border rounded-full overflow-hidden hover:border-orange-500"
                  />
                </label>
                <label className="inline-block cursor-pointer">
                  {/* <input type="checkbox" className="absolute opacity-0 cursor-pointer" /> */}
                  <img
                    src="../../../src/resources/images/products/90chinh-mau-nen.webp"
                    alt=""
                    className="w-7 h-7 border rounded-full overflow-hidden hover:border-orange-500"
                  />
                </label>
              </div>
            </div>
          </div>
          {/* END INFOR P */}
        </div>
        {/* END LIST P */}

        {/* NEXT-PAGE-LIST-P */}
        <div className="flex justify-center items-center pt-[50px]">
          <nav>
            <ul className="grid grid-cols-6 gap-3 ">
              <li className="border border-black p-4 w-[40px] h-[40px] flex flex-col items-center justify-center hover:border-orange-500">
                <a className="block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-left"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </a>
              </li>
              <li className="border border-black p-4 w-[40px] h-[40px] flex flex-col items-center justify-center   hover:border-orange-500">
                <a className="block hover:border-orange-500">1</a>
              </li>
              <li className="border border-black p-4 w-[40px] h-[40px] flex flex-col items-center justify-center hover:border-orange-500">
                <a className="block">2</a>
              </li>
              <li className="border border-black p-4 w-[40px] h-[40px] flex flex-col items-center justify-center hover:border-orange-500">
                <a className="block">3</a>
              </li>
              <li className="border border-black p-4 w-[40px] h-[40px] flex flex-col items-center justify-center hover:border-orange-500">
                <a className="block">4</a>
              </li>
              <li className="border border-black p-4 w-[40px] h-[40px] flex flex-col items-center justify-center hover:border-orange-500">
                <a className="block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        {/*END  NEXT-PAGE-LIST-P */}
      </div>
      {/*END FILTER AND List P */}

      {/* EMAIL */}
      <div className="py-[70px] container mx-auto max-w-[1200px]  text-center ">
        <h2 className="text-[48px] font-normal pb-[15px]">Get in touch</h2>
        <p className="text-[18px] text-[#ABABAB] pb-[30px]">
          Subcrible for latest stories and promotions (35% save)
        </p>
        <div className="pb-[30px]">
          <input
            type="text"
            name=""
            id=""
            placeholder="Email"
            className="w-[640px] h-[46px] border-2 pl-[20px] "
          />
          <button className="btn-submit ml-[20px] w-[122px] h-[46px] bg-[#1C1C1C] text-white">
            Subscribe
          </button>
        </div>
        <div className="">
          <ul className="flex justify-center space-x-5">
            <li className="link_icon px-4 py-4 border-2 border-[#ABABAB] rounded-full flex items-center justify-center">
              <a href="" className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ABABAB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-facebook"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </li>
            <li className="link_icon px-4 py-4 border-2 border-[#ABABAB] rounded-full flex items-center justify-center">
              <a href="" className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ABABAB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-youtube"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
            </li>
            <li className="link_icon px-4 py-4 border-2 border-[#ABABAB] rounded-full flex items-center justify-center">
              <a href="" className="icon flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ABABAB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </li>
            <li className="link_icon px-4 py-4 border-2 border-[#ABABAB] rounded-full flex items-center justify-center">
              <a href="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ABABAB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-twitter"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
        <div className="py-[30px]">
          <p className="text-[#ABABAB]">Don’t worry. We won't spam.</p>
        </div>
      </div>
      {/* END EMAIL */}
    </div>
  );
};
export default ListProducts;
