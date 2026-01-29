import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Calendar,
  FileText,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

export default function ContactDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: response } = await api.get(`/contacts/${id}`);
        setContact(response.data);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || 'Error al cargar el contacto';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContact();
    }
  }, [id]);

  const handleDelete = async () => {
    if (
      !window.confirm('¿Estás seguro de que deseas eliminar este contacto?')
    ) {
      return;
    }

    try {
      await api.delete(`/contacts/${id}`);
      toast.success('Contacto eliminado exitosamente');
      navigate('/contacts');
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Error al eliminar el contacto';
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/contacts')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Contacto no encontrado
          </h1>
        </div>
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground mb-6">
              {error || 'El contacto que buscas no existe'}
            </p>
            <Button onClick={() => navigate('/contacts')}>
              Volver a Contactos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusLabel = (status) => {
    const labels = {
      NEW: 'Nuevo',
      IN_PROGRESS: 'En Progreso',
      CONTACTED: 'Contactado',
      COMPLETED: 'Completado',
    };
    return labels[status] || status;
  };

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/contacts')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {contact.firstName} {contact.lastName}
            </h1>
            <p className="text-muted-foreground">
              {getStatusLabel(contact.status)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/contacts/${id}/edit`)}
          >
            Editar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
            <CardDescription>Detalles completos del contacto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-base hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            {/* Phone */}
            {contact.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-base hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Notes */}
            {contact.notes && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="w-full">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Notas
                  </p>
                  <p className="text-base whitespace-pre-wrap border rounded-lg p-3 bg-muted/50">
                    {contact.notes}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar - Metadata */}
        <div className="space-y-4">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${getStatusColor(contact.status)}`}
              >
                {getStatusLabel(contact.status)}
              </p>
            </CardContent>
          </Card>

          {/* Dates Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fechas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Creado
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(contact.createdAt)}
                </p>
              </div>
              {contact.updatedAt && contact.updatedAt !== contact.createdAt && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Actualizado
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(contact.updatedAt)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned User Card */}
          {contact.assignedTo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Asignado a</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    {contact.assignedTo.email || 'Sin asignar'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
