import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Users,
  Plus,
  Eye,
  TrendingUp,
  TrendingDown,
  PhoneCall,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';

function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // Estado para datos del dashboard
  const [totalContacts, setTotalContacts] = useState(0);
  const [monthContacts, setMonthContacts] = useState(0);
  const [contactsByStatus, setContactsByStatus] = useState({
    NEW: 0,
    IN_PROGRESS: 0,
    CONTACTED: 0,
    COMPLETED: 0,
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos del dashboard desde API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const { data: contactsResponse } = await api.get('/contacts');
        const contacts = contactsResponse.data || [];

        // Total de contactos
        setTotalContacts(contacts.length);

        // Contactos de este mes
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthCount = contacts.filter((contact) => {
          const contactDate = new Date(contact.createdAt);
          return (
            contactDate.getMonth() === currentMonth &&
            contactDate.getFullYear() === currentYear
          );
        }).length;

        setMonthContacts(monthCount);

        // Contar por estado
        const statusCounts = {
          NEW: 0,
          IN_PROGRESS: 0,
          CONTACTED: 0,
          COMPLETED: 0,
        };

        contacts.forEach((contact) => {
          if (statusCounts.hasOwnProperty(contact.status)) {
            statusCounts[contact.status]++;
          }
        });

        setContactsByStatus(statusCounts);

        // Últimos 5 contactos ordenados por fecha
        const sorted = [...contacts]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((contact) => ({
            id: contact._id,
            name: `${contact.firstName} ${contact.lastName}`,
            email: contact.email,
            status: contact.status,
            date: new Date(contact.createdAt).toLocaleDateString('es-ES', {
              month: 'short',
              day: 'numeric',
            }),
          }));

        setRecentContacts(sorted);
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Estadísticas principales con iconos
  const mainStats = [
    {
      id: 1,
      title: 'Total de Contactos',
      value: totalContacts,
      description: 'Todos los contactos en la base de datos',
      icon: Users,
      trend: null,
    },
    {
      id: 2,
      title: 'Este Mes',
      value: monthContacts,
      description: 'Contactos agregados este mes',
      icon: Plus,
      trend: monthContacts > 0 ? 'up' : null,
    },
    {
      id: 3,
      title: 'En Contacto',
      value: contactsByStatus.IN_PROGRESS,
      description: `${contactsByStatus.CONTACTED} contactados`,
      icon: PhoneCall,
      trend: null,
    },
  ];

  // Status breakdown
  const statusStats = [
    {
      label: 'Nuevos',
      value: contactsByStatus.NEW,
      icon: Clock,
    },
    {
      label: 'En Progreso',
      value: contactsByStatus.IN_PROGRESS,
      icon: TrendingUp,
    },
    {
      label: 'Contactados',
      value: contactsByStatus.CONTACTED,
      icon: PhoneCall,
    },
    {
      label: 'Completados',
      value: contactsByStatus.COMPLETED,
      icon: CheckCircle2,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW':
        return 'text-blue-600';
      case 'IN_PROGRESS':
        return 'text-yellow-600';
      case 'CONTACTED':
        return 'text-purple-600';
      case 'COMPLETED':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      NEW: 'Nuevo',
      IN_PROGRESS: 'En Progreso',
      CONTACTED: 'Contactado',
      COMPLETED: 'Completado',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido, {user?.email}. Aquí está el resumen de tus contactos.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mainStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contactos Recientes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contactos Recientes</CardTitle>
            <CardDescription>
              Últimos {recentContacts.length} contactos agregados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentContacts.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No hay contactos registrados aún
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentContacts.map((contact, index) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contact.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-medium ${getStatusColor(contact.status)}`}
                      >
                        {getStatusLabel(contact.status)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {contact.date}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => navigate(`/contacts/${contact.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              className="w-full mt-6"
              onClick={() => navigate('/contacts')}
            >
              Ver todos los contactos
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Sidebar - Status Breakdown + Quick Actions */}
        <div className="space-y-6">
          {/* Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Por Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {statusStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <span className="font-bold text-lg">{stat.value}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start"
                onClick={() => navigate('/contacts/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Contacto
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/contacts')}
              >
                <Users className="h-4 w-4 mr-2" />
                Ver Contactos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
