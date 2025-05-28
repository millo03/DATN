import instance from "../../configs/axios";

export const getCategoryByName = async (searchName: string) => {
  try {
    const { data } = await instance.post("/category/search", { searchName });
    return data;
  } catch (error) {
    console.log(error);
  }
};
