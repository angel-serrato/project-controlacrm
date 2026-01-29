import axios from 'axios';
import type {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '../store/authStore';

// Configuración de reintentos
const MAX_RETRIES = 3;
const RETRY_DELAYS = [500, 1000, 2000]; // Backoff exponencial en ms

// Configuración de refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: AxiosResponse) => void;
  reject: (reason?: AxiosError) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve({} as AxiosResponse);
    }
  });
  failedQueue = [];
};

// Función para refrescar token
const refreshToken = async (): Promise<string> => {
  try {
    // Usar la instancia api con skipRefresh para evitar loop infinito
    const response = await api.post(
      '/auth/refresh',
      {},
      { skipRefresh: true, timeout: 5000 }
    );

    // Validar que la respuesta es exitosa y tiene los datos esperados
    if (
      response.status >= 400 ||
      !response.data?.data?.token ||
      !response.data?.data?.user
    ) {
      const errorMsg = response.data?.message || 'Error al refrescar el token';
      throw new Error(errorMsg);
    }

    // Extraer token y user de la estructura correcta
    const newToken = response.data.data.token;
    const user = response.data.data.user;
    useAuthStore.getState().login(user, newToken);
    return newToken;
  } catch (error) {
    // Si falla el refresh, hacer logout
    useAuthStore.getState().logout();
    throw error;
  }
};

// Crear instancia de Axios con baseURL desde variable de entorno
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    // Resolver promesa para status 2xx y 4xx, rechazar solo para 5xx
    return status >= 200 && status < 500;
  },
});

// Interceptor de REQUEST: Inyectar token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener el token del store de Zustand (que está persistido en localStorage)
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE: Manejar errores (401, red, timeout, etc) con reintentos
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig;

    // No reintentar si no hay config
    if (!config) {
      return Promise.reject(error);
    }

    // Inicializar contador de reintentos
    config.retryCount = config.retryCount || 0;

    // Caso 1: El request fue hecho y el servidor respondió (2xx, 4xx, 5xx)
    if (error.response) {
      const status = error.response.status;

      // Manejar 401 (token inválido o expirado) - Intentar refrescar
      if (status === 401 && !config.skipRefresh) {
        // Solo intentar refresh en rutas privadas
        const publicRoutes = ['/login', '/register', '/'];
        const isPublicRoute =
          typeof window !== 'undefined'
            ? publicRoutes.includes(window.location.pathname)
            : false;

        if (!isPublicRoute) {
          // Si no estamos refrescando, iniciar el proceso
          if (!isRefreshing) {
            isRefreshing = true;

            try {
              await refreshToken();
              processQueue(null);

              // Reintentar el request original con el nuevo token
              return api(config);
            } catch (err) {
              // Si falla el refresh, hacer logout
              processQueue(err as AxiosError);
              window.location.href = '/login';
              return Promise.reject(err);
            } finally {
              isRefreshing = false;
            }
          } else {
            // Si ya estamos refrescando, agregar a la cola
            return new Promise((resolve, reject) => {
              failedQueue.push({
                resolve: (value: AxiosResponse) => {
                  // Marcar para evitar loop infinito de refresh
                  config.skipRefresh = true;
                  // Una vez refrescado, reintentar
                  return api(config).then(resolve).catch(reject);
                },
                reject,
              });
            });
          }
        } else {
          // En rutas públicas, solo rechazar
          return Promise.reject(error);
        }
      }

      // Reintentar solo en errores 5xx para métodos idempotentes
      const idempotentMethods = ['GET', 'HEAD', 'OPTIONS', 'PUT'];
      const method = (config.method || 'GET').toUpperCase();

      if (
        status >= 500 &&
        idempotentMethods.includes(method) &&
        config.retryCount < MAX_RETRIES
      ) {
        config.retryCount++;
        const delay =
          RETRY_DELAYS[config.retryCount - 1] ||
          RETRY_DELAYS[RETRY_DELAYS.length - 1];
        // Esperar antes de reintentar con backoff exponencial
        await new Promise((resolve) => setTimeout(resolve, delay));
        return api(config);
      }
    }
    // Caso 2: El request fue hecho pero no hubo respuesta (problema de red)
    else if (error.request) {
      // Reintentar en errores de red si no hemos excedido el límite
      if (config.retryCount < MAX_RETRIES) {
        config.retryCount++;
        const delay =
          RETRY_DELAYS[config.retryCount - 1] ||
          RETRY_DELAYS[RETRY_DELAYS.length - 1];
        // Esperar antes de reintentar con backoff exponencial
        await new Promise((resolve) => setTimeout(resolve, delay));
        return api(config);
      }
    }
    // Caso 3: Error al configurar el request
    else {
      // No hay nada que hacer aquí
    }

    return Promise.reject(error);
  }
);

export default api;
