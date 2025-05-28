import axios from "axios";
import { getToken } from "../common/hooks/Auth/useAuthorization";
const token = getToken();
const instance = axios.create({
  // baseURL: import.meta.env.API_BASE_URL
  baseURL: "http://localhost:2004/api/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
instance.interceptors.request.use(
  (config) => {
    const token = getToken(); // Lấy token mới nhất
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Thêm token vào headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default instance;
