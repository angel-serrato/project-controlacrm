import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Crear instancia de Axios con baseURL desde variable de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de REQUEST: Inyectar token JWT
api.interceptors.request.use(
  (config) => {
    // Obtener el token del store de Zustand (que está persistido en localStorage)
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✓ Token inyectado en request");
    } else {
      console.warn("⚠ No hay token en Zustand");
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
      console.error("❌ Error 401 - Token inválido o expirado");

      // Solo hacer logout si NO estamos en rutas públicas
      const publicRoutes = ["/login", "/register", "/"];
      const isPublicRoute = publicRoutes.includes(window.location.pathname);

      if (!isPublicRoute) {
        console.log("Limpiando sesión e redirigiendo a login...");
        localStorage.removeItem("token");
        localStorage.removeItem("auth-storage");
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
