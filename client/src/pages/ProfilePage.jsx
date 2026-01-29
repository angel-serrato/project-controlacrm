import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertCircle,
  Lock,
  Bell,
  History,
  LogOut,
  MapPin,
  Phone,
  Mail,
  User,
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setUser({
        id: 'user-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, USA',
        avatar: null,
        contactCount: 24,
        status: 'Active',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2025-01-26'),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while loading your profile'
      );
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUser((prev) => ({ ...prev, ...formData, updatedAt: new Date() }));
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save profile changes'
      );
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Mi Perfil</h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Administra tu información de cuenta y configuración
          </p>
        </div>

        {/* Error Alert */}
        {error && user && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/50 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 w-48 bg-muted rounded" />
            <Card>
              <div className="p-6 h-40 bg-muted rounded" />
            </Card>
          </div>
        )}

        {/* Error State */}
        {error && !user && (
          <Card className="border-destructive/50 bg-destructive/10">
            <div className="p-6 flex gap-4">
              <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-destructive">
                  Error Loading Profile
                </h3>
                <p className="mt-2 text-sm text-destructive/80">{error}</p>
                <Button onClick={fetchUserProfile} className="mt-4">
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Profile Content */}
        {user && !isLoading && (
          <div className="space-y-6">
            {/* Profile Header Card */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>
                {!isEditing && (
                  <Button onClick={handleEditClick}>Editar Perfil</Button>
                )}
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-6">
                <p className="text-sm text-muted-foreground">Contactos</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  {user.contactCount}
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground">Miembro desde</p>
                <p className="text-sm font-medium mt-2">
                  {new Date(user.createdAt).toLocaleDateString('es-ES')}
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground">
                  Última actualización
                </p>
                <p className="text-sm font-medium mt-2">
                  {new Date(user.updatedAt).toLocaleDateString('es-ES')}
                </p>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column - Profile Info or Edit Form */}
              <div className="lg:col-span-2">
                {isEditing ? (
                  /* Edit Form */
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-6">
                      Editar Información
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                          Nombre Completo
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange('name', e.target.value)
                          }
                          className="mt-2"
                          placeholder="Tu nombre"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange('email', e.target.value)
                          }
                          className="mt-2"
                          placeholder="tu@email.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Teléfono
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange('phone', e.target.value)
                          }
                          className="mt-2"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="location"
                          className="text-sm font-medium"
                        >
                          Ubicación
                        </Label>
                        <Input
                          id="location"
                          type="text"
                          value={formData.location}
                          onChange={(e) =>
                            handleInputChange('location', e.target.value)
                          }
                          className="mt-2"
                          placeholder="Ciudad, País"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex-1"
                        >
                          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  /* Profile Info Display */
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-6">
                      Información de Contacto
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <Mail className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Phone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Teléfono
                          </p>
                          <p className="font-medium">{user.phone}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Ubicación
                          </p>
                          <p className="font-medium">{user.location}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Right Column - Actions */}
              <div>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Acciones</h3>
                  <div className="space-y-3 flex flex-col">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => console.log('Change password clicked')}
                    >
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">Cambiar Contraseña</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => console.log('Notifications clicked')}
                    >
                      <Bell className="w-4 h-4" />
                      <span className="text-sm">Notificaciones</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => console.log('Activity log clicked')}
                    >
                      <History className="w-4 h-4" />
                      <span className="text-sm">Registro de Actividad</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                      onClick={() => console.log('Logout clicked')}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Cerrar Sesión</span>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
