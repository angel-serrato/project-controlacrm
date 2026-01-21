import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function ContactEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Editar Contacto</h1>
        <Button onClick={() => navigate("/contacts")}>Volver</Button>
      </div>
      <p className="text-muted-foreground">
        Página de edición para el contacto: {id}
      </p>
      <p className="text-muted-foreground">Próximamente...</p>
    </div>
  );
}
