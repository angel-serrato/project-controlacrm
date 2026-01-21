import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";
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
  const [totalContacts, setTotalContacts] = useState(0);
  const [monthContacts, setMonthContacts] = useState(0);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos reales del dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Obtener todos los contactos
        const { data: contactsResponse } = await api.get("/contacts");
        const contacts = contactsResponse.data || [];

        // Contar total de contactos
        setTotalContacts(contacts.length);

        // Contar contactos de este mes
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthContactsCount = contacts.filter((contact) => {
          const contactDate = new Date(contact.createdAt);
          return (
            contactDate.getMonth() === currentMonth &&
            contactDate.getFullYear() === currentYear
          );
        }).length;

        setMonthContacts(monthContactsCount);

        // Obtener últimos 3 contactos ordenados por fecha
        const sortedContacts = [...contacts]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map((contact) => ({
            id: contact._id,
            name: `${contact.firstName} ${contact.lastName}`,
            email: contact.email,
            date: new Date(contact.createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          }));

        setRecentContacts(sortedContacts);
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Estadísticas calculadas dinámicamente
  const stats = [
    {
      id: 1,
      title: "Total Contactos",
      value: totalContacts,
      icon: Users,
    },
    {
      id: 2,
      title: "Este Mes",
      value: monthContacts,
      icon: Plus,
    },
    {
      id: 3,
      title: "Gestiones",
      value: 0,
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenido, {user?.email}
        </h1>
        <p className="text-muted-foreground">
          Aquí está tu resumen y gestión de contactos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contacts Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Contactos Recientes</CardTitle>
            <CardDescription>Tus últimos contactos agregados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between border-b pb-3 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {contact.date}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
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
              className="w-full mt-6"
              onClick={() => navigate("/contacts")}
            >
              Ver todos los contactos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-start"
              onClick={() => navigate("/contacts/new")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Contacto
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/contacts")}
            >
              <Users className="w-4 h-4 mr-2" />
              Gestionar Contactos
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/dashboard")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Estadísticas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
