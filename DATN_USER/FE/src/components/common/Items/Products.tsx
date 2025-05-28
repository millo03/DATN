/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link } from "react-router-dom";
import ScrollTop from "../../../common/hooks/Customers/ScrollTop";
import { HeartIcon, HeartIconRed } from "../../../resources/svg/Icon/Icon";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
// import ProductModal from "../../../pages/Client/Preview/ProductModal";
import { Mutation_FavouriteProduct } from "../../../common/hooks/FavoriteProducts/mutation_FavouriteProducts";
import { message } from "antd";
import { useListFavouriteProducts } from "../../../common/hooks/FavoriteProducts/FavoriteProduct";

const Products = ({ items }: any) => {
  const [user] = useLocalStorage("user", {});
  const account = user?.user;
  const userId = account?._id;
  const { data: FavoriteData } = useListFavouriteProducts(userId);
  const { mutate: AddFavouriteProduct } = Mutation_FavouriteProduct("ADD");
  const { mutate: RemoveFavouriteProduct } =
    Mutation_FavouriteProduct("REMOVE");

  if (!items || !items._id) {
    return null;
  }
  const checkFavourite = (productId: string) => {
    if (FavoriteData?.products?.length > 0) {
      return FavoriteData?.products?.some(
        (product: any) => product?.productId?._id === productId
      );
    }
  };

  const handleAddToFavorites = (productId: any) => {
    if (!userId) {
      message.open({
        type: "warning",
        content:
          "Hãy đăng nhập tài khoản của bạn để có thể thêm được sản phẩm yêu thích !!!",
      });
    } else {
      message.open({
        type: "success",
        content: "Đã thêm sản phẩm vào danh mục yêu thích của bạn",
      });
      AddFavouriteProduct({ userId, productId });
    }
  };

  const handleRemoveFromFavorites = (productId: any) => {
    message.open({
      type: "success",
      content: "Đã Xóa sản phẩm khỏi danh mục yêu thích của bạn",
    });
    RemoveFavouriteProduct({ userId, productId });
  };

  let min;
  let max;
  if (items?.attributes?.values) {
    min = items?.attributes?.values[0]?.size[0].price_attribute;
    max = items?.attributes?.values[0]?.size[0].price_attribute;
    for (let i of items?.attributes?.values) {
      for (let j of i?.size) {
        if (j?.price_attribute < min) {
          min = j.price_attribute;
        }
        if (j?.price_attribute > max) {
          max = j.price_attribute;
        }
      }
    }
  }
  let min_price_sale = 0;
  let max_price_sale = 0;
  if (items?.sale || items?.sale > 0) {
    min_price_sale = min * (1 - items?.sale / 100);
    max_price_sale = min * (1 - items?.sale / 100);
  }

  return (
    <div
      className="flex justify-between w-full gap-y-5"
      key={items?._id}
    >
      <div className="relative w-full border-gray-200 border rounded-xl">
        <Link
          onClick={ScrollTop}
          to={`/shops/${items?._id}`}
          className="h-full cursor-pointer"
        >
          <div className="relative overflow-hidden border-b border-gray-300 rounded-t-xl">
            <div className="w-full h-[200px] lg:h-[350px] relative">
              <img
                className="w-full h-full object-cover rounded-t-xl bg-[#f3f3f3] transition-transform duration-200 ease-in-out transform hover:scale-110"
                loading="lazy"
                src={items?.image_product}
                alt={items?.name_product}
              />
            </div>
          </div>
        </Link>
        <div className="absolute flex flex-col bg-white rounded top-0 pt-1 translate-y-[-100%] right-0 group-hover:translate-y-0 duration-200">
          <div className="absolute top-0 right-0 flex flex-col p-1 rounded">
            {account ? (
              checkFavourite(items?._id) ? (
                <button
                  className="p-2 border-none rounded"
                  onClick={() => handleRemoveFromFavorites(items?._id)}
                >
                  <HeartIconRed />
                </button>
              ) : (
                <button
                  className="p-2 border-none rounded"
                  onClick={() => handleAddToFavorites(items?._id)}
                >
                  <HeartIcon />
                </button>
              )
            ) : (
              <button
                className="p-2 border-none rounded"
                onClick={() => handleAddToFavorites(items?._id)}
              >
                <HeartIcon />
              </button>
            )}{" "}
          </div>
        </div>
        <div className="flex flex-col h-[165px] items-center px-4 py-5 gap-y-3">
          <Link
            onClick={ScrollTop}
            to={`/shops/${items?._id}`}
            className="text-md text-center text-black font-normal lg:text-[16px] leading-7 hover:text-gray-700 line-clamp-2 overflow-ellipsis"
          >
            {items?.name_product}
          </Link>
          {items?.attributes?.values ? (
            <div className="flex items-center gap-x-2 line-clamp-2 text-lg text-[#EB2606]">
              {min === max ? (
                <span>
                  {max?.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              ) : (
                <div className="flex flex-col gap-2 *:flex items-center">
                  {
                    items?.sale > 0 &&
                    <div>
                      <span>
                        {min_price_sale?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>{" "}
                      -
                      <span>
                        {max_price_sale?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                  }
                  <div className={`${(items?.sale > 0) ? 'text-gray-500 line-through font-normal' : 'text-[#EB2606]'}`}>
                    <span>
                      {min?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>{" "}
                    -
                    <span>
                      {max?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <span className="text-[#EB2606] text-lg">
              {items?.price_product?.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
