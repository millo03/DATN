import express from "express";
import {
  GetFavoriteProductByUserId,
  addFavoriteProducts,
  removeFavoriteProduct
} from "../controllers/Favorites_Items/favoriteProducts";

const Routes_Favorites = express.Router();
Routes_Favorites.get("/favorite/products/:userId", GetFavoriteProductByUserId);
Routes_Favorites.post("/favorite/add-product", addFavoriteProducts);
Routes_Favorites.post("/favorite/remove-product", removeFavoriteProduct);

export default Routes_Favorites;
