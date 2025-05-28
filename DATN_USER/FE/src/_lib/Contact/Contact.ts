import instance from "../../configs/axios";

export const getContactByNameOrEmail = async (searchContact: string) => {
  try {
    const { data } = await instance.post("/contacts/search", {
      searchContact
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
