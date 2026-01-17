import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mínimo para rutas públicas */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">ControlaCRM</h1>
        </div>
      </header>

      {/* Contenido de la página pública */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
