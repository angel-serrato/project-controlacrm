import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email es requerido' })
    .email({ message: 'Por favor ingresa un email válido' }),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');

    try {
      await api.post('/auth/forgot-password', {
        email: data.email,
      });

      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success('Email enviado. Revisa tu bandeja de entrada.');
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        'Error al enviar email. Por favor, intenta de nuevo.';
      setServerError(errorMsg);
      toast.error(errorMsg);
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between"
          aria-label="Navegación principal"
        >
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-xs sm:text-sm">
                CRM
              </span>
            </div>
            <span className="font-semibold text-sm sm:text-base truncate">
              ControlaCRM
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Registrarse</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center p-6">
            <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isSubmitted
                ? 'Revisa tu email para las instrucciones'
                : 'Ingresa tu email para recibir instrucciones'}
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {isSubmitted ? (
              <div className="space-y-4">
                <div
                  className="flex items-start gap-3 p-4 rounded-lg border border-green-200/50 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20"
                  role="alert"
                >
                  <CheckCircle2
                    className="w-5 h-5 text-green-600 dark:text-green-500 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-800 dark:text-green-400">
                      Email enviado exitosamente
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400/80">
                      Hemos enviado las instrucciones a{' '}
                      <span className="font-semibold">{submittedEmail}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted border border-border text-sm space-y-3">
                  <h4 className="font-medium">¿Qué hacer ahora?</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">1.</span>
                      <span>
                        Abre tu email y busca el mensaje de recuperación
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">2.</span>
                      <span>
                        Haz clic en el enlace para crear una nueva contraseña
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">3.</span>
                      <span>
                        Vuelve a iniciar sesión con tu nueva contraseña
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      O
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center">
                    ¿No recibiste el email?{' '}
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setServerError('');
                      }}
                      className="font-semibold text-primary hover:underline"
                    >
                      Intenta nuevamente
                    </button>
                  </p>

                  <Link to="/login" className="block">
                    <Button variant="outline" className="w-full gap-2">
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      Volver a Iniciar Sesión
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {serverError && (
                  <div
                    className="flex items-start gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/10"
                    role="alert"
                  >
                    <AlertCircle
                      className="w-5 h-5 text-destructive shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-destructive">{serverError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      aria-required="true"
                      aria-describedby={
                        errors.email ? 'email-error' : undefined
                      }
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive" id="email-error">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                    aria-busy={isLoading}
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                  </Button>
                </form>

                <div className="p-4 rounded-lg bg-muted border border-border text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">
                    Notas importantes:
                  </p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        className="w-3 h-3 text-primary shrink-0"
                        aria-hidden="true"
                      />
                      El enlace será válido por 24 horas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        className="w-3 h-3 text-primary shrink-0"
                        aria-hidden="true"
                      />
                      Si no ves el email, revisa spam
                    </li>
                  </ul>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      O
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-2 text-sm text-muted-foreground">
                  <p>
                    ¿Recordaste tu contraseña?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-primary hover:underline"
                    >
                      Inicia sesión
                    </Link>
                  </p>
                  <p>
                    ¿No tienes cuenta?{' '}
                    <Link
                      to="/register"
                      className="font-semibold text-primary hover:underline"
                    >
                      Regístrate
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground font-bold text-sm">
                    CRM
                  </span>
                </div>
                <span className="font-semibold text-sm">ControlaCRM</span>
              </div>
              <p className="text-sm text-muted-foreground">
                La solución CRM más simple y poderosa para tu equipo de ventas
              </p>
            </div>

            {/* Producto */}
            <nav className="space-y-3">
              <h3 className="font-semibold text-sm">Producto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Características
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Precios
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Seguridad
                  </a>
                </li>
              </ul>
            </nav>

            {/* Empresa */}
            <nav className="space-y-3">
              <h3 className="font-semibold text-sm">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Acerca de
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contáctanos
                  </a>
                </li>
              </ul>
            </nav>

            {/* Legal */}
            <nav className="space-y-3">
              <h3 className="font-semibold text-sm">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Términos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Cookies
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>&copy; 2026 ControlaCRM. Todos los derechos reservados.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-foreground transition-colors">
                  Twitter
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  GitHub
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
