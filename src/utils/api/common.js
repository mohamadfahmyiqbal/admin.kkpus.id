import axios from "axios";
import { jwtEncode } from "../helpers";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://api.kkpus.id/api" : "https://localhost:3445/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        window.dispatchEvent(new Event("storage"));

        // Redirect to login if user is not already on login page
        if (typeof window !== "undefined") {
          try {
            const loginUrl = `/${jwtEncode({ page: "authLogin" })}`;
            if (window.location.pathname !== loginUrl) {
              window.location.href = loginUrl;
            }
          } catch {
            window.location.href = "/";
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { api as t };
