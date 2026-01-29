import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  Users,
  Plus,
  Eye,
  TrendingUp,
  Clock,
  PhoneCall,
  CheckCircle2,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

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

        setTotalContacts(contacts.length);

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

  const getStatusColor = (status) => {
    const colors = {
      NEW: 'text-blue-600 dark:text-blue-400',
      IN_PROGRESS: 'text-yellow-600 dark:text-yellow-400',
      CONTACTED: 'text-purple-600 dark:text-purple-400',
      COMPLETED: 'text-green-600 dark:text-green-400',
    };
    return colors[status] || 'text-gray-600';
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Bienvenido, {user?.email}. Aquí está el resumen de tus contactos.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Total Contactos */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Contactos
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  {totalContacts}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Todos en la base de datos
                </p>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>

          {/* Este Mes */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Este Mes
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  {monthContacts}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Agregados este mes
                </p>
              </div>
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>

          {/* En Contacto */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  En Contacto
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  {contactsByStatus.IN_PROGRESS}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {contactsByStatus.CONTACTED} contactados
                </p>
              </div>
              <PhoneCall className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Contactos Recientes */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Contactos Recientes</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Últimos {recentContacts.length} contactos agregados
            </p>

            {recentContacts.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  No hay contactos registrados aún
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {contact.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span
                        className={`text-xs font-medium ${getStatusColor(contact.status)}`}
                      >
                        {getStatusLabel(contact.status)}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {contact.date}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
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
          </Card>

          {/* Sidebar - Status Breakdown + Quick Actions */}
          <div className="space-y-6">
            {/* Status Breakdown */}
            <Card className="p-6">
              <h3 className="text-base font-semibold mb-4">Por Estado</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Nuevos</span>
                  </div>
                  <span className="font-bold text-lg">
                    {contactsByStatus.NEW}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">En Progreso</span>
                  </div>
                  <span className="font-bold text-lg">
                    {contactsByStatus.IN_PROGRESS}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Contactados</span>
                  </div>
                  <span className="font-bold text-lg">
                    {contactsByStatus.CONTACTED}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Completados</span>
                  </div>
                  <span className="font-bold text-lg">
                    {contactsByStatus.COMPLETED}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-base font-semibold mb-4">Acciones Rápidas</h3>
              <div className="space-y-3 flex flex-col">
                <Button
                  className="w-full justify-start gap-2"
                  onClick={() => navigate('/contacts/new')}
                >
                  <Plus className="h-4 w-4" />
                  <span>Nuevo Contacto</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate('/contacts')}
                >
                  <Users className="h-4 w-4" />
                  <span>Ver Contactos</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
