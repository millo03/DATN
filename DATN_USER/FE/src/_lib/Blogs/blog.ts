import instance from "../../configs/axios";

export const GetBlogsByName = async (searchName: string) => {
  try {
    const { data } = await instance.post("/blogs/search", { searchName });
    return data;
  } catch (error) {
    console.log(error);
  }
};
