import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Duración de la sesión en milisegundos (15 minutos)
const SESSION_DURATION = 15 * 60 * 1000;

// Tipos
export interface User {
  id?: string;
  _id?: string;
  email: string;
  name?: string;
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginTime: number | null;
}

export interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  isSessionValid: () => boolean;
  initAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      token: null,
      isAuthenticated: false,
      loginTime: null,

      // Acciones
      login: (user: User, token: string) => {
        // Normalizar el campo id
        const normalizedUser = {
          ...user,
          id: user.id || user._id,
        };
        set({
          user: normalizedUser,
          token,
          isAuthenticated: true,
          loginTime: Date.now(),
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loginTime: null,
        });
      },

      // Verificar si la sesión sigue siendo válida (no ha expirado)
      isSessionValid: () => {
        const { token, loginTime } = get();
        if (!token || !loginTime) return false;

        const elapsed = Date.now() - loginTime;
        return elapsed < SESSION_DURATION;
      },

      // Restaurar estado desde localStorage al iniciar la app
      initAuth: () => {
        try {
          const { user, token, isAuthenticated, loginTime } = get();

          // Si no hay token o loginTime, no hay sesión
          if (!token || !loginTime) {
            set({ isAuthenticated: false });
            return;
          }

          // Verificar si la sesión ha expirado
          const elapsed = Date.now() - loginTime;
          if (elapsed >= SESSION_DURATION) {
            // Sesión expirada, hacer logout
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loginTime: null,
            });
            return;
          }

          // Normalizar id si existe user
          if (user && user._id && !user.id) {
            const normalizedUser = { ...user, id: user._id };
            set({ user: normalizedUser });
          }

          // Sesión válida
          set({ isAuthenticated: true });
        } catch (error) {
          console.error("Error initializing auth:", error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loginTime: null,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loginTime: state.loginTime,
      }),
    },
  ),
);
