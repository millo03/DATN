import instance from "../../configs/axios";

export const list_Auth = async () => {
  try {
    const data = await instance.get(`/auths`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const Search_Auth = async (searchQuery: any) => {
  try {
    const { data } = await instance.get(`/auths/search`, {
      params: { _search: searchQuery }
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const list_Auth_By_Id = async (userId: string) => {
  try {
    const { data } = await instance.get(`auth/${userId}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const SignUp = async (user: any) => {
  try {
    const { data } = await instance.post(`auth/signup`, user);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const SignOut = async () => {
  try {
    const { data } = await instance.post(`auth/signout`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const SignIn = async (user: any) => {
  try {
    const data = await instance.post(`auth/signin`, user);
    localStorage.setItem("user", JSON.stringify(data?.data));
    return data;
  } catch (error) {
    return error;
  }
};

export async function set_default_address(item: any) {
  try {
    const data = await instance.post(`/auths/${item.id_user}`, item.id_item);
    return data;
  } catch (error) {
    return error;
  }
}
export const getUserByUsername = async (searchUser: string) => {
  try {
    const { data } = await instance.post("/auth/search", {
      searchUser
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const getNewUserIn7Day = async () => {
  try {
    const { data } = await instance.get("/auths/new_auth_in_7_day");
    return data;
  } catch (error) {
    console.error(error);
  }
};
