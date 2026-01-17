import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Users, Plus, Eye, BarChart3, ArrowRight } from "lucide-react";

function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // Datos dummy para las estadísticas
  const stats = [
    {
      id: 1,
      title: "Total Contactos",
      value: 24,
      icon: Users,
    },
    {
      id: 2,
      title: "Este Mes",
      value: 8,
      icon: Plus,
    },
    {
      id: 3,
      title: "Gestiones",
      value: 12,
      icon: BarChart3,
    },
  ];

  const recentContacts = [
    { id: 1, name: "Juan García", email: "juan@example.com", date: "Hoy" },
    { id: 2, name: "María López", email: "maria@example.com", date: "Ayer" },
    {
      id: 3,
      name: "Carlos Ruiz",
      email: "carlos@example.com",
      date: "Hace 3 días",
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Bienvenido, {user?.email}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Aquí está tu resumen y gestión de contactos
        </p>
      </div>

      {/* Stats Grid - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.id}
              className="border border-border hover:border-border/80 transition-colors"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid - Mobile First Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Contacts Section */}
        <Card className="lg:col-span-2 border border-border">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              Contactos Recientes
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Tus últimos contactos agregados
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="space-y-2 sm:space-y-3">
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-medium text-sm truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {contact.email}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {contact.date}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => navigate(`/contacts/${contact.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 sm:mt-6 text-sm sm:text-base"
              onClick={() => navigate("/contacts")}
            >
              Ver todos los contactos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions - Sidebar on Desktop, Stack on Mobile */}
        <Card className="border border-border">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-2">
            <Button
              className="w-full justify-start text-sm sm:text-base h-9 sm:h-10"
              onClick={() => navigate("/contacts/new")}
            >
              <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Nuevo Contacto</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-sm sm:text-base h-9 sm:h-10"
              onClick={() => navigate("/contacts")}
            >
              <Users className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Gestionar Contactos</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-sm sm:text-base h-9 sm:h-10"
              onClick={() => navigate("/dashboard")}
            >
              <BarChart3 className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Estadísticas</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
