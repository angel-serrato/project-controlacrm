import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Eye, Edit2, Trash2, Plus, Loader2, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { toast } from "react-hot-toast";

const STATUS_OPTIONS = {
  NEW: "Nuevo",
  IN_PROGRESS: "En Progreso",
  CONTACTED: "Contactado",
  COMPLETED: "Completado",
};

const STATUS_COLORS = {
  NEW: "text-blue-600",
  IN_PROGRESS: "text-yellow-600",
  CONTACTED: "text-purple-600",
  COMPLETED: "text-green-600",
};

export default function ContactsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Cargar contactos
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const { data: response } = await api.get("/contacts");
        setContacts(response.data || []);
      } catch (error) {
        console.error("Error cargando contactos:", error);
        toast.error(
          error.response?.data?.message || "Error al cargar contactos",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filtrar contactos por estado, búsqueda y rol
  useEffect(() => {
    let filtered = contacts;

    // Filtrar por estado
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Filtrar por búsqueda (nombre o email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query),
      );
    }

    // Filtrar por rol: usuarios sales solo ven sus contactos
    if (user?.role === "sales") {
      filtered = filtered.filter((c) => c.assignedTo?._id === user?.id);
    }

    setFilteredContacts(filtered);
  }, [contacts, statusFilter, searchQuery, user]);

  const handleDelete = async (id) => {
    if (deleteId === id) {
      // Segunda confirmación para eliminar
      try {
        await api.delete(`/contacts/${id}`);
        setContacts(contacts.filter((c) => c._id !== id));
        setDeleteId(null);
        toast.success("Contacto eliminado exitosamente");
      } catch (error) {
        console.error("Error eliminando contacto:", error);
        toast.error(
          error.response?.data?.message || "Error al eliminar contacto",
        );
      }
    } else {
      // Primera confirmación
      setDeleteId(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground">
            {filteredContacts.length} de {contacts.length} contactos
          </p>
        </div>
        <Button
          onClick={() => navigate("/contacts/new")}
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nuevo Contacto
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Búsqueda */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre o email..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filtro de estado */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los estados</SelectItem>
                  {Object.entries(STATUS_OPTIONS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listado de contactos */}
      {filteredContacts.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground mb-6">
              {contacts.length === 0
                ? "No hay contactos registrados aún"
                : "No se encontraron contactos con los filtros aplicados"}
            </p>
            {contacts.length === 0 && (
              <Button
                onClick={() => navigate("/contacts/new")}
                variant="outline"
              >
                Crear primer contacto
              </Button>
            )}
            {contacts.length > 0 && searchQuery && (
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Limpiar búsqueda
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Vista Desktop - Tabla */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      {contact.firstName} {contact.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {contact.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`font-medium ${STATUS_COLORS[contact.status] || "text-gray-600"}`}
                      >
                        {STATUS_OPTIONS[contact.status] || contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/contacts/${contact._id}`)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            navigate(`/contacts/${contact._id}/edit`)
                          }
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(contact._id)}
                          title={
                            deleteId === contact._id
                              ? "Clic de nuevo para confirmar"
                              : "Eliminar"
                          }
                          className={
                            deleteId === contact._id ? "text-destructive" : ""
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista Mobile - Cards */}
          <div className="md:hidden space-y-3">
            {filteredContacts.map((contact) => (
              <Card
                key={contact._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {contact.email}
                      </p>
                      {contact.phone && (
                        <p className="text-sm text-muted-foreground">
                          {contact.phone}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span
                        className={`text-sm font-medium ${STATUS_COLORS[contact.status] || "text-gray-600"}`}
                      >
                        {STATUS_OPTIONS[contact.status] || contact.status}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/contacts/${contact._id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            navigate(`/contacts/${contact._id}/edit`)
                          }
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(contact._id)}
                          className={
                            deleteId === contact._id ? "text-destructive" : ""
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
