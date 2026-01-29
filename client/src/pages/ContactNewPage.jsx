import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';

// Schema de validación con Zod
const contactSchema = z.object({
  firstName: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  lastName: z
    .string({ required_error: 'El apellido es obligatorio' })
    .min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
  email: z
    .string({ required_error: 'El email es obligatorio' })
    .email({ message: 'Por favor ingresa un email válido' }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-()]+$/.test(val), {
      message: 'El teléfono no es válido',
    }),
  notes: z.string().optional(),
  assignedTo: z
    .string({ required_error: 'Debes seleccionar un usuario' })
    .min(1, { message: 'Debes seleccionar un usuario' }),
});

export default function ContactNewPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [serverError, setServerError] = useState('');
  const [users, setUsers] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
      assignedTo: '',
    },
  });

  // Cargar usuarios sales
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const { data: response } = await api.get('/users');
        // Filtrar solo usuarios con rol "sales"
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

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');

    try {
      // POST a /api/v1/contacts
      await api.post('/contacts', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || '',
        notes: data.notes || '',
        assignedTo: data.assignedTo,
        status: 'NEW', // El backend lo fuerza igual, pero incluimos por claridad
      });

      toast.success('¡Contacto creado exitosamente!');

      // Redirigir a lista de contactos después de 1 segundo
      setTimeout(() => {
        navigate('/contacts');
      }, 1000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        'Error al crear contacto. Por favor, intenta de nuevo.';

      setServerError(errorMsg);
      toast.error(errorMsg);
      console.error('Create contact error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Crear Nuevo Contacto
          </h1>
          <p className="text-muted-foreground">
            Completa los datos para agregar un nuevo contacto
          </p>
        </div>
        <Button onClick={() => navigate('/contacts')} variant="outline">
          Volver
        </Button>
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Error Alert */}
          {serverError && (
            <div className="flex items-start gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/10">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
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
                {isLoading ? 'Creando contacto...' : 'Crear Contacto'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/contacts')}
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
