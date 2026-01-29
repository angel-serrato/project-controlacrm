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

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Contactos',
      path: '/contacts',
      icon: Users,
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: SquareUser,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } border-r border-border bg-background transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          {sidebarOpen && (
            <h2 className="text-xl font-bold tracking-tight">ControlaCRM</h2>
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

        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4 space-y-4">
          {sidebarOpen && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Cuenta
              </p>
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2"
            size={sidebarOpen ? 'default' : 'icon'}
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span>Salir</span>}
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b border-border bg-background">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Bienvenido de vuelta
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
