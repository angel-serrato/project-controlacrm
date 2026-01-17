import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Users, Zap, Clock, CheckCircle } from "lucide-react";

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
      color: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      id: 2,
      title: "Nuevos",
      value: 8,
      icon: Zap,
      color: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
    },
    {
      id: 3,
      title: "En Progreso",
      value: 12,
      icon: Clock,
      color: "bg-orange-500/20",
      iconColor: "text-orange-400",
    },
    {
      id: 4,
      title: "Cerrados",
      value: 4,
      icon: CheckCircle,
      color: "bg-green-500/20",
      iconColor: "text-green-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Bienvenido, {user?.email}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Aquí está tu resumen de contactos y actividad
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.id}
              className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Actions Section */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Gestión de Contactos
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Accede a tu lista completa de contactos y realiza cambios en sus
          estados
        </p>
        <Button
          onClick={() => navigate("/contacts")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          Ver Contactos
        </Button>
      </div>

      {/* Recent Activity (placeholder) */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Actividad Reciente
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No hay actividad reciente para mostrar
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;
