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
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from 'lucide-react';

// Schema de validación con Zod
const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email es requerido' })
    .email({ message: 'Por favor ingresa un email válido' }),
});

function ForgotPasswordPage() {
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
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-xs sm:text-sm">
                CRM
              </span>
            </div>
            <span className="font-semibold text-sm sm:text-base truncate">
              ControlaCRM
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                Inicio
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <Card className="w-full max-w-md border border-border">
          <CardHeader className="space-y-1 text-center p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">
              Recuperar Contraseña
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {isSubmitted
                ? 'Revisa tu email para las instrucciones'
                : 'Ingresa tu email para recibir instrucciones'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Success Message */}
            {isSubmitted ? (
              <div className="space-y-4">
                {/* Success Alert */}
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border border-green-200/50 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-400">
                      Email enviado exitosamente
                    </p>
                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-400/80">
                      Hemos enviado las instrucciones de recuperación a{' '}
                      <span className="font-semibold">{submittedEmail}</span>
                    </p>
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-3 sm:p-4 rounded-lg bg-muted border border-border space-y-2 sm:space-y-3">
                  <h4 className="font-medium text-xs sm:text-sm">
                    ¿Qué hacer ahora?
                  </h4>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
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

                {/* Divider */}
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

                {/* Back to Login */}
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-xs sm:text-sm text-muted-foreground text-center">
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

                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="w-full gap-2 text-xs sm:text-sm h-9 sm:h-10"
                    >
                      <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      Volver a Iniciar Sesión
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Error Alert */}
                {serverError && (
                  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border border-destructive/50 bg-destructive/10">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-destructive">
                      {serverError}
                    </p>
                  </div>
                )}

                {/* Form */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Email Field */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="text-xs sm:text-sm h-9 sm:h-10"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-xs sm:text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-sm h-9 sm:h-10"
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                  </Button>
                </form>

                {/* Info Box */}
                <div className="p-3 sm:p-4 rounded-lg bg-muted border border-border text-xs sm:text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">
                    Notas importantes:
                  </p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                      El enlace será válido por 24 horas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                      Si no ves el email, revisa spam
                    </li>
                  </ul>
                </div>

                {/* Divider */}
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

                {/* Back to Login */}
                <div className="text-center space-y-1.5 sm:space-y-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    ¿Recordaste tu contraseña?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-primary hover:underline"
                    >
                      Inicia sesión
                    </Link>
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
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
      <footer className="border-t border-border py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Brand */}
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-xs sm:text-sm">
                    CRM
                  </span>
                </div>
                <span className="font-semibold text-xs sm:text-sm truncate">
                  ControlaCRM
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                La solución CRM más simple y poderosa para tu equipo de ventas
              </p>
            </div>

            {/* Links */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-xs sm:text-sm">Producto</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
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
            </div>

            {/* Company */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-xs sm:text-sm">Empresa</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
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
            </div>

            {/* Legal */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-xs sm:text-sm">Legal</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
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
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
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

export default ForgotPasswordPage;
