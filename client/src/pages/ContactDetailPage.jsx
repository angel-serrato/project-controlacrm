import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
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
    const colors = {
      NEW: 'text-blue-600 dark:text-blue-400',
      IN_PROGRESS: 'text-yellow-600 dark:text-yellow-400',
      CONTACTED: 'text-purple-600 dark:text-purple-400',
      COMPLETED: 'text-green-600 dark:text-green-400',
    };
    return colors[status] || 'text-gray-600';
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/contacts')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Contacto no encontrado
            </h1>
          </div>
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-6">
              {error || 'El contacto que buscas no existe'}
            </p>
            <Button onClick={() => navigate('/contacts')}>
              Volver a Contactos
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/contacts')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {contact.firstName} {contact.lastName}
              </h1>
              <p
                className={`text-sm sm:text-base font-medium mt-1 ${getStatusColor(contact.status)}`}
              >
                {getStatusLabel(contact.status)}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Contact Info Card */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-2">
              Información de Contacto
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Detalles completos del contacto
            </p>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm sm:text-base hover:underline font-medium"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              {contact.phone && (
                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Teléfono
                    </p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-sm sm:text-base hover:underline font-medium"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Notes */}
              {contact.notes && (
                <div className="flex gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                      Notas
                    </p>
                    <p className="text-sm sm:text-base whitespace-pre-wrap border rounded-lg p-3 bg-muted/50">
                      {contact.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Sidebar - Metadata */}
          <div className="space-y-4">
            {/* Status Card */}
            <Card className="p-6">
              <h4 className="text-base font-semibold mb-3">Estado</h4>
              <p
                className={`text-2xl sm:text-3xl font-bold ${getStatusColor(contact.status)}`}
              >
                {getStatusLabel(contact.status)}
              </p>
            </Card>

            {/* Dates Card */}
            <Card className="p-6">
              <h4 className="text-base font-semibold mb-4">Fechas</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Creado
                  </p>
                  <p className="text-xs sm:text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="min-w-0">
                      {formatDate(contact.createdAt)}
                    </span>
                  </p>
                </div>
                {contact.updatedAt &&
                  contact.updatedAt !== contact.createdAt && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Actualizado
                      </p>
                      <p className="text-xs sm:text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="min-w-0">
                          {formatDate(contact.updatedAt)}
                        </span>
                      </p>
                    </div>
                  )}
              </div>
            </Card>

            {/* Assigned User Card */}
            {contact.assignedTo && (
              <Card className="p-6">
                <h4 className="text-base font-semibold mb-3">Asignado a</h4>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">
                    {contact.assignedTo.email || 'Sin asignar'}
                  </span>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
