import axios from "axios";

// Buat instance axios
const api = axios.create({
  baseURL: "https://api.kkpus.id",
  withCredentials: true,
});

// Tambahkan interceptor untuk menyisipkan token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // console.log(token);

    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
