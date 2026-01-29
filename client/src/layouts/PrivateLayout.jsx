import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { LayoutDashboard, Users, LogOut, Menu, SquareUser } from 'lucide-react';
import { useState } from 'react';

export default function PrivateLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } border-r border-border bg-background transition-all duration-300 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          {sidebarOpen && (
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              ControlaCRM
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 sm:px-3 py-4 sm:py-6 space-y-2">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/dashboard')
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="text-sm">Dashboard</span>}
          </Link>

          {/* Contactos */}
          <Link
            to="/contacts"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/contacts')
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Users className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="text-sm">Contactos</span>}
          </Link>

          {/* Profile */}
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/profile')
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <SquareUser className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="text-sm">Perfil</span>}
          </Link>
        </nav>

        {/* Logout Section */}
        <div className="border-t border-border p-3 sm:p-4 space-y-3 sm:space-y-4">
          {sidebarOpen && (
            <div className="space-y-1 px-1">
              <p className="text-xs font-medium text-muted-foreground">
                Cuenta
              </p>
              <p className="text-xs sm:text-sm font-medium truncate">
                {user?.email}
              </p>
            </div>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2"
            size={sidebarOpen ? 'default' : 'icon'}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span className="text-sm">Salir</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-background shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Bienvenido de vuelta
            </p>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
