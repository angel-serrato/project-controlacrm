import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";

// Schema de validación con Zod
const loginSchema = z.object({
  email: z
    .string()
    .email("Por favor ingresa un email válido")
    .min(1, "Email es requerido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .min(1, "Contraseña es requerida"),
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // POST a /api/v1/auth/login
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { token, user } = response.data.data;

      // Guardar en Zustand + localStorage
      login(user, token);

      // Toast de éxito
      toast.success(`¡Bienvenido ${user.email}!`);

      // Redirigir a dashboard después de 1 segundo
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error al iniciar sesión";

      toast.error(errorMsg);
      console.error("Login error:", error);
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
          <p className="text-gray-400">Inicia sesión en tu cuenta</p>
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

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-slate-600"></div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-400 mb-2">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Demo Credentials (para testing) */}
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
          <p className="text-xs text-gray-400 mb-2">
            <strong>Para testing:</strong>
          </p>
          <p className="text-xs text-gray-400">Email: demo@example.com</p>
          <p className="text-xs text-gray-400">Password: password123</p>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
