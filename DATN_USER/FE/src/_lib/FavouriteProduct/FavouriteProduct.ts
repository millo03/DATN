// import { IProduct } from "../../common/interfaces/Product";
// import instance from "../../configs/axios";

// export const GetAllFavouriteProducts = async (userId: string) => {
//   try {
//     const { data } = await instance.get(`/favorite/products/${userId}`);
//     console.log("Favorite Data:", data);

//     return data;
//   } catch (error) {
//     console.log(error || "Loi server !");
//   }
// };
// export const addFavoriteProduct = async (
//   userId: string,
//   productId: string,
//   attributeId: string
// ) => {
//   try {
//     const { data } = await instance.post("/favorite/add-product", {
//       userId,
//       productId,
//       attributeId
//     });
//     return data;
//   } catch (error) {
//     console.error(error || "Server error!");
//     throw error;
//   }
// };

// export const removeFavoriteProduct = async (
//   userId: string,
//   productId: string,
//   attributeId: string
// ) => {
//   try {
//     const { data } = await instance.post("/favorite/remove-product", {
//       userId,
//       productId,
//       attributeId
//     });
//     return data;
//   } catch (error) {
//     console.error(error || "Server error!");
//     throw error;
//   }
// };
import instance from "../../configs/axios";

export const GetAllFavouriteProducts = async (userId: string) => {
  try {
    const { data } = await instance.get(`/favorite/products/${userId}`);
    return data;
  } catch (error) {
    console.log(error || "Loi server !");
  }
};
export const AddFavouriteProducts = async (
  userId: string,
  productId: string
) => {
  try {
    const { data } = await instance.post(`/favorite/add-product`, {
      userId,
      productId
    });
    return data;
  } catch (error) {
    console.log(error || "Loi server !");
  }
};
export const RemoveFavouriteProducts = async (
  userId: string,
  productId: string
) => {
  try {
    const { data } = await instance.post(`/favorite/remove-product`, {
      userId,
      productId
    });
    return data;
  } catch (error) {
    console.log(error || "Loi server !");
  }
};
