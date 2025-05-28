import { useTop10ProductBestSale } from "../../../../common/hooks/Order/querry_Order";

const TableTopProducts = () => {
  const {
    data: top10ProductBestSale,
    isLoading,
    error
  } = useTop10ProductBestSale();

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="rounded-sm border border-stroke w-[560px] bg-white px-8 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Sản Phẩm Thịnh Hành
      </h4>

      <div className="flex flex-col w-full space-y-5 my-6">
        {top10ProductBestSale.map((product: any, index: number) => (
          <div className="flex space-x-8 items-center relative ">
            <div className="relative">
              <img
                src={product?.productId?.image_product}
                alt={product?.productId?.name_product}
                className="w-[120px] h-[120px] rounded-3xl"
              />
              <div className="absolute top-1 -right-6 p-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="46"
                  height="46"
                  viewBox="0 0 46 46"
                  fill="none"
                >
                  <path
                    fill="url(#rank-1-a)"
                    stroke="#fff"
                    strokeWidth="3"
                    d="M26.652 2.362a8.166 8.166 0 0 0-7.304 0L6.014 9.03A8.167 8.167 0 0 0 1.5 16.333v13.334a8.167 8.167 0 0 0 4.514 7.304l13.334 6.667a8.166 8.166 0 0 0 7.304 0l13.334-6.667a8.167 8.167 0 0 0 4.514-7.304V16.333a8.167 8.167 0 0 0-4.514-7.304L26.652 2.362Z"
                  ></path>
                  <path
                    fill="url(#rank-1-b)"
                    stroke="url(#rank-1-c)"
                    d="M23.969 7.729a2.167 2.167 0 0 0-1.938 0L8.698 14.395A2.167 2.167 0 0 0 7.5 16.333v13.334c0 .82.464 1.57 1.198 1.938L22.03 38.27c.61.305 1.328.305 1.938 0l13.333-6.666a2.167 2.167 0 0 0 1.198-1.938V16.333c0-.82-.464-1.57-1.198-1.938L23.97 7.73ZM20.242 4.15a6.167 6.167 0 0 1 5.516 0l13.333 6.667a6.167 6.167 0 0 1 3.409 5.515v13.334a6.167 6.167 0 0 1-3.409 5.515L25.758 41.85a6.167 6.167 0 0 1-5.516 0L6.91 35.182A6.167 6.167 0 0 1 3.5 29.667V16.333a6.167 6.167 0 0 1 3.409-5.515L20.242 4.15Z"
                  ></path>
                  <g filter="url(#rank-1-d)">
                    <text
                      x="50%"
                      y="50%"
                      font-family="Arial"
                      font-size="16"
                      font-weight="bold"
                      fill="#000"
                      text-anchor="middle"
                      dominant-baseline="central"
                    >
                      {index + 1}
                    </text>
                  </g>
                  <defs>
                    <radialGradient
                      id="rank-1-a"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientTransform="matrix(0 40 -40 0 23 3)"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FFF1B8"></stop>
                      <stop offset="1" stopColor="#FFC53D"></stop>
                    </radialGradient>
                    <radialGradient
                      id="rank-1-b"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientTransform="matrix(0 40 -40 0 23 3)"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FFC53D"></stop>
                      <stop offset="1" stopColor="#FAAD14"></stop>
                    </radialGradient>
                    <linearGradient
                      id="rank-1-c"
                      x1="23"
                      x2="23"
                      y1="3"
                      y2="43"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FFD666"></stop>
                      <stop offset="1" stopColor="#D48806"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="">
              <h3 className="text-[22px] font-bold">
                {" "}
                {product?.productId?.name_product.length > 25
                  ? `${product?.productId?.name_product.slice(0, 25)}...`
                  : product?.productId?.name_product}
              </h3>
              <h5 className="text-lg text-gray-600">
                {" "}
                {formatCurrency(product.price_item)}
              </h5>
              <span className="text-sm text-gray-500">
                Đã bán {product.quantity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableTopProducts;
