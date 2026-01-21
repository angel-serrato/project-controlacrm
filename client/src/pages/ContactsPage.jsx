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
import { Eye, Edit2, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const STATUS_OPTIONS = {
  NEW: "Nuevo",
  IN_PROGRESS: "En Progreso",
  CONTACTED: "Contactado",
  CLOSED: "Cerrado",
};

export default function ContactsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deleteId, setDeleteId] = useState(null);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const { data: response } = await api.get("/contacts");
        setContacts(response.data || []);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast.error(
          error.response?.data?.message || "Error al cargar contactos",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filter contacts by status
  useEffect(() => {
    let filtered = contacts;

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Filter by role: Sales users only see assigned contacts
    if (user?.role === "sales") {
      filtered = filtered.filter((c) => c.assignedTo?._id === user?.id);
    }

    setFilteredContacts(filtered);
  }, [contacts, statusFilter, user]);

  const handleDelete = async (id) => {
    if (deleteId === id) {
      // Second click confirms deletion
      try {
        await api.delete(`/contacts/${id}`);
        setContacts(contacts.filter((c) => c._id !== id));
        setDeleteId(null);
        toast.success("Contacto eliminado");
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast.error(
          error.response?.data?.message || "Error al eliminar contacto",
        );
      }
    } else {
      // First click shows confirmation
      setDeleteId(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground">
            Total: {filteredContacts.length} contactos
          </p>
        </div>
        <Button onClick={() => navigate("/contacts/new")} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Contacto
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Filtrar por estado
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
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

      {/* Contacts Grid/Table */}
      {filteredContacts.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground mb-4">
              No hay contactos para mostrar
            </p>
            <Button onClick={() => navigate("/contacts/new")} variant="outline">
              Crear primer contacto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {/* Desktop Table View */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
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
                    <td className="px-6 py-4 text-sm">
                      {contact.firstName} {contact.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 text-sm">{contact.phone}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                        {STATUS_OPTIONS[contact.status] || contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/contacts/${contact._id}`)}
                          title="Ver"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            navigate(`/contacts/${contact._id}/edit`)
                          }
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(contact._id)}
                          title="Eliminar"
                          className={
                            deleteId === contact._id ? "text-destructive" : ""
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredContacts.map((contact) => (
              <Card
                key={contact._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {contact.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contact.phone}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                        {STATUS_OPTIONS[contact.status] || contact.status}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/contacts/${contact._id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            navigate(`/contacts/${contact._id}/edit`)
                          }
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(contact._id)}
                          className={
                            deleteId === contact._id ? "text-destructive" : ""
                          }
                        >
                          <Trash2 className="w-4 h-4" />
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
