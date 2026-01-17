import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const isSessionValid = useAuthStore((state) => state.isSessionValid);
  const logout = useAuthStore((state) => state.logout);

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
