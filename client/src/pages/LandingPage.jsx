import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Users, BarChart3, Shield } from "lucide-react";

function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-6xl sm:text-7xl font-bold mb-4 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ControlaCRM
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-2">
              Gestiona tus contactos de forma inteligente
            </p>
            <p className="text-gray-400">
              Una solución CRM moderna y sencilla para optimizar tu flujo de
              trabajo
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/login">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg transition-all duration-200 transform hover:scale-105"
                asChild
              >
                <span>Iniciar Sesión</span>
              </Button>
            </Link>
            <Link to="/register">
              <Button
                className="bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 px-8 py-3 text-lg rounded-lg transition-all duration-200 transform hover:scale-105"
                asChild
              >
                <span>Registrarse</span>
              </Button>
            </Link>
          </div>

          {/* Hero Image/Illustration placeholder */}
          <div className="bg-linear-to-b from-blue-500/20 to-transparent rounded-2xl border border-blue-400/30 p-12 min-h-96 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-24 h-24 text-blue-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400">
                Tu dashboard de gestión de contactos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              ¿Por qué ControlaCRM?
            </h2>
            <p className="text-gray-400 text-lg">
              Características diseñadas para mejorar tu productividad
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Feature 1 */}
            <Card className="bg-slate-700/50 border-slate-600 hover:border-blue-400 transition-all duration-300 p-8">
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Gestión de Contactos
              </h3>
              <p className="text-gray-400">
                Organiza todos tus contactos en un único lugar. Crea, edita y
                clasifica contactos con facilidad.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-slate-700/50 border-slate-600 hover:border-cyan-400 transition-all duration-300 p-8">
              <div className="mb-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Estados del Contacto
              </h3>
              <p className="text-gray-400">
                Sigue el progreso de cada contacto a través de estados
                personalizados: Nuevo, En Progreso, Contactado, Cerrado.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-slate-700/50 border-slate-600 hover:border-purple-400 transition-all duration-300 p-8">
              <div className="mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Seguridad y Control
              </h3>
              <p className="text-gray-400">
                Sistema de roles y permisos para controlar quién puede ver y
                editar cada contacto.
              </p>
            </Card>
          </div>

          {/* Additional info */}
          <div className="bg-slate-700/30 border border-slate-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              ¿Listo para empezar?
            </h3>
            <p className="text-gray-400 mb-6">
              Registra tu cuenta hoy y comienza a gestionar tus contactos de
              forma más eficiente.
            </p>
            <Link to="/register">
              <Button className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2">
                Crear Cuenta Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-2">
            © 2024 ControlaCRM. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-sm">
            Solución educativa para gestión de contactos CRM
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
