import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/react/shallow";

function ProtectedRoute() {
  const { isAuthenticated, token, isSessionValid, logout } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      token: state.token,
      isSessionValid: state.isSessionValid,
      logout: state.logout,
    })),
  );

  // Si no hay token ni isAuthenticated, redirigir a login
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si la sesión sigue siendo válida (no ha expirado)
  if (!isSessionValid()) {
    logout(); // Limpiar estado
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado y sesión válida, renderizar las rutas privadas
  return <Outlet />;
}

export default ProtectedRoute;
