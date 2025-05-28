import { StatusCodes } from "http-status-codes";
import FavoriteProducts from "../../models/Favorite/favoriteProducts";

export const GetFavoriteProductByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const favoriteProducts = await FavoriteProducts.findOne({
      userId
    }).populate({
      path: "products.productId",
      populate: [{ path: "attributes", model: "Attributes" }]
    });

    if (!favoriteProducts) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "List of Favorite Products not found" });
    }
    return res.status(StatusCodes.OK).json(favoriteProducts);
  } catch (error) {
    console.error("Error fetching favorite products by userId:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

export const addFavoriteProducts = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let favoriteProducts = await FavoriteProducts.findOne({ userId });

    if (!favoriteProducts) {
      favoriteProducts = new FavoriteProducts({ userId, products: [] });
    }

    const productExists = favoriteProducts.products.some(
      (product) => product.productId.toString() === productId
    );

    if (productExists) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: "Product already in favorites" });
    }

    favoriteProducts.products.push({ productId });
    await favoriteProducts.save();

    return res.status(StatusCodes.OK).json(favoriteProducts);
  } catch (error) {
    console.error("Error adding favorite product:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

export const removeFavoriteProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let favoriteProducts = await FavoriteProducts.findOne({ userId });

    if (!favoriteProducts) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "List Favorite Products Not Found" });
    }

    favoriteProducts.products = favoriteProducts.products.filter(
      (product) =>
        product.productId && product.productId.toString() !== productId
    );
    await favoriteProducts.save();

    return res.status(StatusCodes.OK).json(favoriteProducts);
  } catch (error) {
    console.error("Error removing favorite product:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
