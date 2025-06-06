import { Router } from "express";
import {
  create,
  get,
  getById,
  getCategoryByName,
  getCatogoryById,
  remove,
  statistical,
  update,
} from "../controllers/Categories/category";

const Routes_categories = Router();
// Routes_Products.get("/category", get_items_client);
Routes_categories.get("/category", get);
Routes_categories.get("/category/:id", getById);
Routes_categories.get("/category/products/:id", getCatogoryById);
Routes_categories.post("/category", create);
Routes_categories.post("/category/search", getCategoryByName);
Routes_categories.delete("/category/:id", remove);
Routes_categories.put("/category/:id", update);
Routes_categories.get("/category/statistical", statistical);

export default Routes_categories;
