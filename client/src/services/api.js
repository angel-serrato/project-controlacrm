import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Crear instancia de Axios con baseURL
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de REQUEST: Inyectar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de RESPONSE: Manejar errores 401 (logout automático)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el status es 401 (Unauthorized), limpiar token y redirigir a login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("auth-storage");
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
