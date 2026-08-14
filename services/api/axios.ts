import axios from "axios";
import { getToken } from "../../utils/secureStore";

const api = axios.create({
  baseURL: "http://172.20.10.2:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach the JWT to every request
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;