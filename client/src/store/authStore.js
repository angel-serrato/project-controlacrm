import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Duración de la sesión en milisegundos (15 minutos)
const SESSION_DURATION = 15 * 60 * 1000;

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      token: null,
      isAuthenticated: false,
      loginTime: null, // Timestamp de cuando se hizo login

      // Acciones
      login: (user, token) => {
        // Normalizar el campo id
        const normalizedUser = {
          ...user,
          id: user.id || user._id,
        };
        set({
          user: normalizedUser,
          token,
          isAuthenticated: true,
          loginTime: Date.now(), // Guardar el timestamp actual
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
        let { user, token, isAuthenticated, loginTime } = get();

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
          user = { ...user, id: user._id };
          set({ user });
        }

        // Sesión válida
        set({ isAuthenticated: true });
      },
    }),
    {
      name: "auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Personalizar qué se persiste
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loginTime: state.loginTime, // Importante: persistir el loginTime
      }),
    },
  ),
);
