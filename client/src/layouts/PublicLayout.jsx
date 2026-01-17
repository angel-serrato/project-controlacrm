import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenido de la página pública */}
      <main className="flex items-center justify-center min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
