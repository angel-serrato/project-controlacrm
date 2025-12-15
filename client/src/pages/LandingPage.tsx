import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            ControlaCRM
          </Link>
          <div className="flex gap-4 items-center">
            <Link to="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link to="/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="grow">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">ControlaCRM</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Administra clientes, productos y órdenes desde una sola plataforma
            pensada para pequeñas y medianas empresas.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">Comenzar Gratis</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Características principales
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card p-6 rounded-lg border">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-2">
                  Gestión de Clientes
                </h3>
                <p className="text-muted-foreground">
                  Registra y administra tus contactos de manera eficiente.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">
                  Inventario de Productos
                </h3>
                <p className="text-muted-foreground">
                  Controla stock, categorías y precios en tiempo real.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">
                  Gestión de Ventas
                </h3>
                <p className="text-muted-foreground">
                  Crea, edita y controla pedidos fácilmente.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">
                  Dashboard Completo
                </h3>
                <p className="text-muted-foreground">
                  Visualiza datos importantes de tu negocio.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Empieza hoy mismo</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Regístrate y comienza a gestionar tu negocio en minutos.
            </p>
            <Link to="/register">
              <Button size="lg">Crear Cuenta Gratis</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-muted/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ControlaCRM. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
