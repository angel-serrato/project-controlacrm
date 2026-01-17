import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function ContactNewPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Crear Nuevo Contacto
        </h1>
        <Button onClick={() => navigate("/contacts")}>Volver</Button>
      </div>
      <p className="text-slate-500 dark:text-slate-400">
        Formulario para crear un nuevo contacto
      </p>
      <p className="text-slate-400">Próximamente...</p>
    </div>
  );
}
