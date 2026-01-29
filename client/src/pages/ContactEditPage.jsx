import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

// Schema de validación con Zod
const contactSchema = z.object({
  firstName: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  lastName: z
    .string({ required_error: 'El apellido es obligatorio' })
    .min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
  email: z.email({ message: 'Por favor ingresa un email válido' }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-()]+$/.test(val), {
      message: 'El teléfono no es válido',
    }),
  notes: z.string().optional(),
  status: z.enum(['NEW', 'IN_PROGRESS', 'CONTACTED', 'COMPLETED'], {
    required_error: 'Debes seleccionar un estado',
  }),
  assignedTo: z
    .string({ required_error: 'Debes seleccionar un usuario' })
    .min(1, { message: 'Debes seleccionar un usuario' }),
});

export default function ContactEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingContact, setLoadingContact] = useState(true);
  const [serverError, setServerError] = useState('');
  const [users, setUsers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  });

  // Cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const { data: response } = await api.get('/users');
        const salesUsers = response.data.filter((u) => u.role === 'sales');
        setUsers(salesUsers);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
        toast.error('Error al cargar usuarios');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Cargar contacto
  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoadingContact(true);
        const { data: response } = await api.get(`/contacts/${id}`);
        const contact = response.data;

        reset({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone || '',
          notes: contact.notes || '',
          status: contact.status,
          assignedTo: contact.assignedTo?._id || '',
        });
      } catch (error) {
        console.error('Error cargando contacto:', error);
        toast.error('Error al cargar el contacto');
      } finally {
        setLoadingContact(false);
      }
    };

    if (id) {
      fetchContact();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');

    try {
      await api.put(`/contacts/${id}`, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || '',
        notes: data.notes || '',
        status: data.status,
        assignedTo: data.assignedTo,
      });

      toast.success('¡Contacto actualizado exitosamente!');

      setTimeout(() => {
        navigate(`/contacts/${id}`);
      }, 1000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        'Error al actualizar contacto. Por favor, intenta de nuevo.';

      setServerError(errorMsg);
      toast.error(errorMsg);
      console.error('Update contact error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingContact) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/contacts/${id}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Editar Contacto
            </h1>
            <p className="text-muted-foreground">
              Modifica los datos del contacto según sea necesario
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Error Alert */}
          {serverError && (
            <div className="flex items-start gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/10">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre y Apellido - Two columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Juan"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Pérez"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="text"
                placeholder="+1 234 567 8900"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <select
                id="status"
                {...register('status')}
                className="w-full px-3 py-2 border border-input rounded-md text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecciona un estado</option>
                <option value="NEW">Nuevo</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="CONTACTED">Contactado</option>
                <option value="COMPLETED">Completado</option>
              </select>
              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Asignar a usuario */}
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Asignar a *</Label>
              {loadingUsers ? (
                <div className="flex items-center gap-2 p-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cargando usuarios...
                </div>
              ) : (
                <select
                  id="assignedTo"
                  {...register('assignedTo')}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecciona un usuario</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.email}
                    </option>
                  ))}
                </select>
              )}
              {errors.assignedTo && (
                <p className="text-sm text-destructive">
                  {errors.assignedTo.message}
                </p>
              )}
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <textarea
                id="notes"
                placeholder="Información adicional sobre el contacto..."
                className="w-full px-3 py-2 border border-input rounded-md text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                rows="4"
                {...register('notes')}
              />
              {errors.notes && (
                <p className="text-sm text-destructive">
                  {errors.notes.message}
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading || loadingUsers}
                className="flex-1"
              >
                {isLoading ? 'Guardando cambios...' : 'Guardar Cambios'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/contacts/${id}`)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
