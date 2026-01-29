import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

function Header() {
  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0"
            aria-label="Logo ControlaCRM"
          >
            <span className="text-primary-foreground font-bold text-xs sm:text-sm">
              CRM
            </span>
          </div>
          <span className="font-semibold text-sm sm:text-base truncate">
            ControlaCRM
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link to="/login" aria-label="Ir a página de inicio de sesión">
            <Button variant="outline" size="sm">
              Iniciar Sesión
            </Button>
          </Link>
          <Link to="/register" aria-label="Ir a página de registro">
            <Button size="sm">Registrarse</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
      <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Heading */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Gestiona tus contactos
            <br />
            <span className="text-muted-foreground">de forma inteligente</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg">
            Una solución CRM moderna y minimalista que te ayuda a organizar y
            optimizar tu flujo de trabajo de ventas
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto"
            aria-label="Comenzar ahora - crear nueva cuenta"
          >
            <Button size="sm" className="gap-2 w-full">
              Comenzar Ahora
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto"
            aria-label="Acceder con cuenta existente"
          >
            <Button size="sm" variant="outline" className="w-full">
              Tengo una cuenta
            </Button>
          </Link>
        </div>

        {/* Trust Section */}
        <div className="mt-10 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-border">
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
            Usado por equipos de ventas en todo el mundo
          </p>
          <div
            className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 lg:gap-8 opacity-70"
            role="list"
            aria-label="Empresas clientes"
          >
            <div
              className="w-28 sm:w-32 h-9 sm:h-10 bg-muted rounded flex items-center justify-center text-xs sm:text-sm font-medium text-muted-foreground"
              role="listitem"
            >
              Empresa 1
            </div>
            <div
              className="hidden sm:flex w-32 h-10 bg-muted rounded items-center justify-center text-sm font-medium text-muted-foreground"
              role="listitem"
            >
              Empresa 2
            </div>
            <div
              className="hidden lg:flex w-32 h-10 bg-muted rounded items-center justify-center text-sm font-medium text-muted-foreground"
              role="listitem"
            >
              Empresa 3
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description, features }) {
  return (
    <Card className="border border-border">
      <CardHeader className="p-4 sm:p-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
          <Icon
            className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
            aria-hidden="true"
          />
        </div>
        <CardTitle className="text-lg lg:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
        <p className="text-muted-foreground">{description}</p>
        <div className="space-y-2 pt-2">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <CheckCircle2
                className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0"
                aria-hidden="true"
              />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: 'Gestión de Contactos',
      description:
        'Organiza y administra todos tus contactos en un solo lugar. Información centralizada y fácil de acceder.',
      features: ['Búsqueda avanzada', 'Campos personalizables'],
    },
    {
      icon: BarChart3,
      title: 'Seguimiento de Ventas',
      description:
        'Monitorea el progreso de tus contactos a través del pipeline. Visualiza el estado de cada oportunidad.',
      features: ['Estados personalizados', 'Notas y historial'],
    },
    {
      icon: Shield,
      title: 'Seguridad',
      description:
        'Protege la información de tu empresa con autenticación segura y control de roles.',
      features: ['Autenticación JWT', 'Control de roles'],
    },
  ];

  return (
    <section
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-border"
      aria-labelledby="features-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16 space-y-2 sm:space-y-3">
          <h2
            id="features-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold"
          >
            Características Principales
          </h2>
          <p className="text-muted-foreground">
            Todo lo que necesitas para gestionar tus contactos efectivamente
          </p>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          role="list"
        >
          {features.map((feature, idx) => (
            <div key={idx} role="listitem">
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-border"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
        <div className="space-y-2 sm:space-y-4">
          <h2
            id="cta-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold"
          >
            Listo para Comenzar?
          </h2>
          <p className="text-muted-foreground lg:text-lg">
            Crea tu cuenta hoy y comienza a gestionar tus contactos de manera
            más inteligente
          </p>
        </div>

        <Link
          to="/register"
          className="inline-block w-full sm:w-auto"
          aria-label="Crear cuenta gratuita"
        >
          <Button size="sm" className="gap-2 w-full">
            Crear Cuenta Gratuita
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  const footerSections = {
    product: {
      title: 'Producto',
      links: ['Características', 'Precios', 'Seguridad'],
    },
    company: { title: 'Empresa', links: ['Acerca de', 'Blog', 'Contáctanos'] },
    legal: { title: 'Legal', links: ['Privacidad', 'Términos', 'Cookies'] },
  };

  const socialLinks = [
    { label: 'Twitter', name: 'Twitter' },
    { label: 'GitHub', name: 'GitHub' },
    { label: 'LinkedIn', name: 'LinkedIn' },
  ];

  return (
    <footer className="border-t border-border py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Brand Section */}
          <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0"
                aria-label="Logo ControlaCRM en pie de página"
              >
                <span
                  className="text-primary-foreground font-bold text-xs sm:text-sm"
                  aria-hidden="true"
                >
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

          {/* Footer Links Sections */}
          {Object.entries(footerSections).map(([key, section]) => (
            <nav
              key={key}
              className="space-y-2 sm:space-y-3"
              aria-label={`Enlaces de ${section.title}`}
            >
              <h3 className="font-semibold text-xs sm:text-sm">
                {section.title}
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-border pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
            <p>&copy; 2026 ControlaCRM. Todos los derechos reservados.</p>
            <div className="flex gap-4 sm:gap-6">
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="hover:text-foreground transition-colors"
                  aria-label={`Síguenos en ${link.label}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
