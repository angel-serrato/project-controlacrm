import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Loader2 } from "lucide-react";

// Schema de validación con Zod
const contactSchema = z.object({
  firstName: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z
    .string()
    .min(1, "El apellido es obligatorio")
    .min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z
    .string()
    .email("Por favor ingresa un email válido")
    .min(1, "El email es obligatorio"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[\d\s\-()]+$/.test(val),
      "El teléfono no es válido",
    ),
  notes: z.string().optional(),
  assignedTo: z.string().min(1, "Debes seleccionar un usuario"),
});

export default function ContactNewPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [serverError, setServerError] = useState("");
  const [users, setUsers] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
      assignedTo: "",
    },
  });

  // Cargar usuarios sales
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const { data: response } = await api.get("/users");
        // Filtrar solo usuarios con rol "sales"
        const salesUsers = response.data.filter((u) => u.role === "sales");
        setUsers(salesUsers);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        toast.error("Error al cargar usuarios");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");

    try {
      // POST a /api/v1/contacts
      await api.post("/contacts", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || "",
        notes: data.notes || "",
        assignedTo: data.assignedTo,
        status: "NEW", // El backend lo fuerza igual, pero incluimos por claridad
      });

      toast.success("¡Contacto creado exitosamente!");

      // Redirigir a lista de contactos después de 1 segundo
      setTimeout(() => {
        navigate("/contacts");
      }, 1000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al crear contacto. Por favor, intenta de nuevo.";

      setServerError(errorMsg);
      toast.error(errorMsg);
      console.error("Create contact error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Crear Nuevo Contacto
        </h1>
        <Button onClick={() => navigate("/contacts")} variant="outline">
          Volver
        </Button>
      </div>

      <Card className="w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 p-8">
        {/* Error Banner */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm font-medium">{serverError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre y Apellido - Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-gray-900 dark:text-white"
              >
                Nombre *
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Juan"
                className="bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-gray-900 dark:text-white"
              >
                Apellido *
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Pérez"
                className="bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 dark:text-white">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="juan@example.com"
              className="bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-900 dark:text-white">
              Teléfono
            </Label>
            <Input
              id="phone"
              type="text"
              placeholder="+1 234 567 8900"
              className="bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-red-400 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {/* Asignar a usuario */}
          <div className="space-y-2">
            <Label
              htmlFor="assignedTo"
              className="text-gray-900 dark:text-white"
            >
              Asignar a *
            </Label>
            {loadingUsers ? (
              <div className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cargando usuarios...
              </div>
            ) : (
              <Select
                value={watch("assignedTo")}
                onValueChange={(value) =>
                  setValue("assignedTo", value, { shouldValidate: true })
                }
              >
                <SelectTrigger className="bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Selecciona un usuario" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white">
                  {users.length === 0 ? (
                    <div className="p-2 text-sm text-gray-600 dark:text-gray-400">
                      No hay usuarios disponibles
                    </div>
                  ) : (
                    users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.email}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
            {errors.assignedTo && (
              <p className="text-red-400 text-sm">
                {errors.assignedTo.message}
              </p>
            )}
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-900 dark:text-white">
              Notas
            </Label>
            <textarea
              id="notes"
              placeholder="Información adicional sobre el contacto..."
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
              rows="4"
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-red-400 text-sm">{errors.notes.message}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isLoading || loadingUsers}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2"
            >
              {isLoading ? "Creando contacto..." : "Crear Contacto"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/contacts")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
          <p className="text-xs text-blue-400 mb-2">
            <strong>Campos requeridos:</strong>
          </p>
          <ul className="text-xs text-blue-400 space-y-1">
            <li>• Nombre y Apellido</li>
            <li>• Email válido</li>
            <li>• Usuario a asignar (solo usuarios con rol "sales")</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
