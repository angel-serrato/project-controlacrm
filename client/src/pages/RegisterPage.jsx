import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";

// Schema de validación con Zod
const registerSchema = z
  .object({
    email: z
      .string()
      .email("Por favor ingresa un email válido")
      .min(1, "Email es requerido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .min(1, "Contraseña es requerida"),
    confirmPassword: z.string().min(1, "Debes confirmar la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // POST a /api/v1/auth/register
      const response = await api.post("/auth/register", {
        email: data.email,
        password: data.password,
      });

      // Toast de éxito
      toast.success("¡Cuenta creada exitosamente!");

      // Redirigir a login después de 1 segundo
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error al registrarse";

      toast.error(errorMsg);
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 to-slate-800 px-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">ControlaCRM</h1>
          <p className="text-gray-400">Crea tu cuenta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 focus:border-blue-500"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 focus:border-blue-500"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirmar Contraseña
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 focus:border-blue-500"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-slate-600"></div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-400 mb-2">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
          <p className="text-xs text-gray-400">
            <strong>Requisitos de contraseña:</strong>
          </p>
          <ul className="text-xs text-gray-400 mt-2 space-y-1">
            <li>• Mínimo 6 caracteres</li>
            <li>• Las contraseñas deben coincidir</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;
