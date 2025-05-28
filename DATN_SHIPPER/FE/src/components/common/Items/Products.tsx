import React, { useState } from "react";
import { Link } from "react-router-dom";
import ScrollTop from "../../../common/hooks/Customers/ScrollTop";
import { HeartIcon, HeartIconRed } from "../../../resources/svg/Icon/Icon";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
// import ProductModal from "../../../pages/Client/Preview/ProductModal";
import { Mutation_FavouriteProduct } from "../../../common/hooks/FavoriteProducts/mutation_FavouriteProducts";
import { message } from "antd";
import { useListFavouriteProducts } from "../../../common/hooks/FavoriteProducts/FavoriteProduct";


const Products = ({ items }: any) => {
  console.log(items);

  const [user] = useLocalStorage("user", {});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const account = user?.user;
  const userId = account?._id;
  const { data: FavoriteData } = useListFavouriteProducts(userId);
  const { mutate: AddFavouriteProduct } = Mutation_FavouriteProduct("ADD");
  const { mutate: RemoveFavouriteProduct } =
    Mutation_FavouriteProduct("REMOVE");

  if (!items || !items._id) {
    console.error("Items is undefined or missing _id:", items);
    return null;
  }

  const handlePreview = async (id: any) => {
    try {
      const response = await fetch(
        `http://localhost:2004/api/v1/products/${id}`
      );
      const product = await response.json();
      setSelectedProduct(product);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching product preview:", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

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
      for (let j of i.size) {
        if (j?.price_attribute < min) {
          min = j.price_attribute;
        }
        if (j?.price_attribute > max) {
          max = j.price_attribute;
        }
      }
    }
  }

  return (
    <div
      className="flex  justify-between w-full gap-y-5"
      key={items?._id}
    >
      <div className="relative w-full border-gray-200 border rounded-xl group">
        <Link
          onClick={ScrollTop}
          to={`/shops/${items?._id}`}
          className="h-full cursor-pointer"
        >
          <div className="relative overflow-hidden border border-gray-300 rounded-t-xl group">
            <div className="w-full h-[250px] lg:h-[400px] relative">
              <img
                className="w-full h-full object-cover rounded-t-xl bg-[#f3f3f3] transition-transform duration-200 ease-in-out transform group-hover:scale-110"
                loading="lazy"
                src={items?.image_product}
                alt={items?.name_product}
              />
            </div>
          </div>
        </Link>
        {/* hover show icon cart */}
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
            {/* <button
              className="p-2 border-none rounded"
              onClick={() => handlePreview(items?._id)}
            >
              <EyeIcon />
            </button> */}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center  px-4 py-5  gap-y-2">
          <Link
            onClick={ScrollTop}
            to={`/shops/${items?._id}`}
            className="text-md text-center font-bold lg:text-[16px] hover:text-black line-clamp-2"
          >
            {items?.name_product.length > 15
              ? items?.name_product.slice(0, 50) + "..."
              : items?.name_product}
          </Link>
          {/* <p className="font-normal text-[16px]">
            {items?.price_product?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p> */}

          {items?.attributes?.values ? (
            <div className="flex items-center gap-x-1 line-clamp-2">
              {min === max ? (
                <span className="text-[#EB2606]">
                  {max?.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              ) : (
                <>
                  <span className="text-[#EB2606]">
                    {min?.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>{" "}
                  -
                  <span className="text-[#EB2606]">
                    {max?.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </>
              )}
            </div>
          ) : (
            <span className="text-[#EB2606]">
              {items?.price_product?.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          )}
        </div>

        {/* {
          modalOpen && selectedProduct && (
            <ProductModal product={selectedProduct} onClose={handleCloseModal} />
          )
        } */}
      </div>
    </div>
  );
};

export default Products;
