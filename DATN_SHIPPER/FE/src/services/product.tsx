import instance from "../configs/axios";
import { IProduct } from "../common/interfaces/Product";

export const getAllProduct = async () => {
  try {
    const { data } = await instance.get("/products");
    return data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error; // Re-throw the error for higher level handling
  }
};

export const getProductById = async (id: string) => {
  try {
    const { data } = await instance.get(`/products/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error; // Re-throw the error for higher level handling
  }
};

export const createProduct = async (product: IProduct) => {
  try {
    console.log("Sending product:", product);
    const { data } = await instance.post("/products", product);
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error; // Re-throw the error for higher level handling
  }
};

export const removeProduct = async (id: string) => {
  try {
    const { data } = await instance.delete(`/products/${id}`);
    return data;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error; // Re-throw the error for higher level handling
  }
};

export const updateProduct = async (id: string, product: IProduct) => {
  try {
    const { data } = await instance.put(`/products/${id}`, product);
    return data;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error; // Re-throw the error for higher level handling
  }
};
