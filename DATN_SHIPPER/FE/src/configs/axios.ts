import axios from "axios";
import { getToken } from "../common/hooks/Auth/useAuthorization";
const token = getToken();
const instance = axios.create({
  // baseURL: import.meta.env.API_BASE_URL
  baseURL: "http://localhost:2024/api/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
export default instance;
