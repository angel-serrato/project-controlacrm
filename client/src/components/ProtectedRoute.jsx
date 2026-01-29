import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useShallow } from 'zustand/react/shallow';

export default function ProtectedRoute() {
  const { isAuthenticated, token, isSessionValid, logout } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      token: state.token,
      isSessionValid: state.isSessionValid,
      logout: state.logout,
    }))
  );

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  if (!isSessionValid()) {
    logout(); // Limpiar estado
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
