import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);

  // Si no hay token ni isAuthenticated, redirigir a login
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar las rutas privadas
  return <Outlet />;
}

export default ProtectedRoute;
