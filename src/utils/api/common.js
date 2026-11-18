import axios from "axios";

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

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (!response) {
      // Network error or server unreachable
      console.error("[API] Network error:", error.message);
      return Promise.reject(error);
    }

    switch (response.status) {
      case 401:
        // Unauthorized — clear session and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        if (window.location.pathname !== "/login" && !window.location.pathname.includes("/auth/")) {
          window.location.href = "/login";
        }
        break;

      case 403:
        // Forbidden — role/permission denied
        console.warn("[API] Access denied (403):", response.data?.message || "Insufficient permissions");
        break;

      case 429:
        // Rate limited — show user-friendly message
        console.warn("[API] Rate limited (429):", response.data?.message || "Too many requests, please try again later");
        break;

      default:
        // Other errors — log but don't redirect
        if (response.status >= 500) {
          console.error("[API] Server error:", response.status, response.data?.message);
        }
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
export { api as t };
