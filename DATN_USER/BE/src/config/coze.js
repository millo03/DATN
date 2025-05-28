import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const cozeApi = axios.create({
  baseURL: "https://api.coze.com",
  headers: {
    "Content-Type": "application/json"
  }
});

cozeApi.interceptors.request.use(
  (config) => {
    const token = process.env.COZE_API_TOKEN;
    console.log("COZE_API_TOKEN:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default cozeApi;

//chat coze
