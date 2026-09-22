import axios from "axios";

const API_BASE_URL = "https://abhishek-kabra-backend.2nison6.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Conditionally attach or strip Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle expired/invalid token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if server rejects authentication
      localStorage.removeItem("adminToken");
    }
    return Promise.reject(error);
  },
);

export default api;
