// src/config/api.js
import axios from "axios";

const API_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

// Автоматически добавляем токен из localStorage (если есть)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Автоматический логаут при 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // или используй navigate()
    }
    return Promise.reject(error);
  }
);

// Экспортируем и инстанс, и URL (на всякий случай)
export { API_URL };
export default api;