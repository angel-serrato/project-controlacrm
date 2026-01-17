import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

function LandingPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  // Si el usuario ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

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
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                Registrarse
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Gestiona tus contactos
                <br />
                <span className="text-muted-foreground">
                  de forma inteligente
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                Una solución CRM moderna y minimalista que te ayuda a organizar
                y optimizar tu flujo de trabajo de ventas
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="sm" className="gap-2 w-full sm:w-auto text-sm">
                  Comenzar Ahora
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto text-sm"
                >
                  Tengo una cuenta
                </Button>
              </Link>
            </div>

            {/* Decorative element */}
            <div className="mt-10 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-border">
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                Usado por equipos de ventas en todo el mundo
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 lg:gap-8 opacity-70">
                <div className="w-28 sm:w-32 h-9 sm:h-10 bg-muted rounded flex items-center justify-center text-xs sm:text-sm font-medium text-muted-foreground">
                  Empresa 1
                </div>
                <div className="hidden sm:flex w-32 h-10 bg-muted rounded items-center justify-center text-sm font-medium text-muted-foreground">
                  Empresa 2
                </div>
                <div className="hidden lg:flex w-32 h-10 bg-muted rounded items-center justify-center text-sm font-medium text-muted-foreground">
                  Empresa 3
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16 space-y-2 sm:space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Características Principales
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Todo lo que necesitas para gestionar tus contactos efectivamente
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Feature 1 */}
              <Card className="border border-border hover:border-primary/50 transition-colors">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg lg:text-xl">
                    Gestión de Contactos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Organiza y administra todos tus contactos en un solo lugar.
                    Información centralizada y fácil de acceder.
                  </p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground pt-2">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span>Búsqueda avanzada</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span>Campos personalizables</span>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="border border-border hover:border-primary/50 transition-colors">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg lg:text-xl">
                    Seguimiento de Ventas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Monitorea el progreso de tus contactos a través del
                    pipeline. Visualiza el estado de cada oportunidad.
                  </p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground pt-2">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span>Estados personalizados</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span>Notas y historial</span>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="border border-border hover:border-primary/50 transition-colors">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg lg:text-xl">
                    Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Protege la información de tu empresa con autenticación
                    segura y control de roles.
                  </p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground pt-2">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span>Autenticación JWT</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span>Control de roles</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="space-y-2 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Listo para Comenzar?
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Crea tu cuenta hoy y comienza a gestionar tus contactos de
                manera más inteligente
              </p>
            </div>

            <Link to="/register" className="inline-block w-full sm:w-auto">
              <Button size="sm" className="gap-2 w-full sm:w-auto text-sm">
                Crear Cuenta Gratuita
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-xs sm:text-sm">
                    CRM
                  </span>
                </div>
                <span className="font-semibold text-xs sm:text-sm">
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
              <p>&copy; 2026 ControlaCRM. Todos los derechos reservados.</p>
              <div className="flex gap-4 sm:gap-6">
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

export default LandingPage;
