# PROMPT PARA CREAR COMPONENTES REACT CON SHADCN/UI PURO

## 📋 INSTRUCCIONES PRINCIPALES

Crea componentes React **sin TypeScript, sin props** que combinen componentes shadcn/ui base **tal cual vienen**, sin modificar sus estilos.

---

## 🎯 REQUISITOS OBLIGATORIOS

### ✅ DEBE CUMPLIR:

1. **React Puro** (.tsx) - Sin TypeScript, sin type hints
2. **Sin Props** - Los datos deben venir hardcodeados o ser interpolados directamente en el JSX
3. **shadcn/ui PURO** - Usa componentes base (Button, Card, Input, Label) SIN modificar sus estilos
4. **Un único archivo** - Todo el componente en un archivo `.tsx`
5. **Tailwind CSS solo para layout** - Responsive design mobile-first, espaciado, flexbox, grid
6. **cn() utility** - Importar de `@/lib/utils` para combinar clases SOLO de layout
7. **Dark Mode Automático** - Los tokens de shadcn/ui ya lo soportan

### ❌ NO DEBE TENER:

- Props o parámetros (excepto en elementos HTML base)
- TypeScript, tipos, interfaces
- Comentarios excesivos (máximo 1 línea por sección)
- Modificar estilos de componentes shadcn/ui
- Colores, fondos, o bordes hardcodeados
- Estilos CSS inline
- forwardRef
- Next.js específicos

---

## 🏗️ PATRÓN ÚNICO

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NombreComponente() {
  const handleAction = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Título</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAction} className="space-y-4">
            <div className="space-y-2">
              <Label>Etiqueta</Label>
              <Input type="text" placeholder="Placeholder" />
            </div>
          </form>
        </CardContent>

        <CardFooter className="gap-2">
          <Button>Acción</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

---

## 📐 RESPONSIVE MOBILE-FIRST

- **Móvil**: `p-4`, `w-full`, `space-y-4`
- **Tablet**: `md:max-w-lg`
- **Desktop**: `lg:max-w-2xl`

Ejemplo:

```tsx
<div className="w-full md:max-w-md lg:max-w-lg p-4 md:p-6">
  {/* contenido */}
</div>
```

---

## 🎨 DESIGN TOKENS DISPONIBLES

### Colores (Usa SOLO en contenedores, nunca en componentes shadcn/ui)

- `bg-background` / `text-background` - Fondo general
- `bg-foreground` / `text-foreground` - Texto principal
- `bg-card` / `text-card` - Fondo de tarjetas
- `text-card-foreground` - Texto en tarjetas
- `text-muted-foreground` - Texto muted
- `border-border` - Bordes
- `bg-input` - Inputs deshabilitados

### Tamaños

- `rounded-sm` - Bordes muy suave
- `rounded-md` - Bordes suave
- `rounded-lg` - Bordes estándar
- `rounded-xl` - Bordes redondeados

### Sombras

- `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`

### Espaciado (Tailwind estándar)

- `p-2`, `p-4`, `p-6` - Padding
- `m-2`, `m-4`, `m-6` - Margin
- `gap-2`, `gap-4`, `gap-6` - Gap entre elementos
- `space-y-2`, `space-y-4` - Espacio vertical

---

## 📁 ESTRUCTURA DE CARPETAS

```
components/
├── ui/                    # Componentes base (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   └── [más componentes]
├── composed/              # Componentes compuestos sin props
│   ├── LoginForm.tsx
│   ├── UserCard.tsx
│   ├── ContactCard.tsx
│   └── [más componentes]
└── pages/                 # Páginas que usan componentes compuestos
    ├── LoginPage.tsx
    ├── DashboardPage.tsx
    └── [más páginas]
```

---

## 🔧 EJEMPLO COMPLETO: LoginForm

```tsx
// components/composed/LoginForm.tsx
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Bienvenido a Control ACRM
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="usuario@ejemplo.com"
                defaultValue=""
              />
            </div>

            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input type="password" placeholder="••••••••" defaultValue="" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-background"
                />
                Recuérdame
              </label>
              <a
                href="#"
                className="text-sm text-primary hover:text-primary/90"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full">Entrar</Button>
          <p className="text-sm text-muted-foreground text-center">
            ¿No tienes cuenta?{" "}
            <a
              href="#"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Regístrate aquí
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
```

---

## 🎯 EJEMPLO COMPLETO: UserCard

```tsx
// components/composed/UserCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UserCard() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Juan Pérez</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">Email: juan@ejemplo.com</p>
        <p className="text-sm text-muted-foreground">Rol: Administrador</p>
        <p className="text-sm text-muted-foreground">Estado: Activo</p>
      </CardContent>

      <CardFooter className="gap-2">
        <Button className="flex-1">Editar</Button>
        <Button className="flex-1">Eliminar</Button>
      </CardFooter>
    </Card>
  );
}
```

---

## ✅ CHECKLIST ANTES DE FINALIZAR

- [ ] Sin props (datos hardcodeados)
- [ ] Componentes shadcn/ui sin modificar
- [ ] Solo layout/spacing en className
- [ ] Mobile-first responsive
- [ ] Sin TypeScript
- [ ] Sin comentarios excesivos
- [ ] Dark mode automático
- [ ] Un archivo único
- [ ] cn() importado de @/lib/utils
- [ ] Accesibilidad básica (labels, aria-labels)

---

## 🌗 Dark Mode

Los tokens de shadcn/ui ya soportan dark mode automáticamente:

1. Usa las clases de color recomendadas
2. Los cambios en `.dark` class se aplican automáticamente
3. No necesitas condicionales basadas en tema

---

## 📝 ACCESIBILIDAD

```tsx
// Buttons
<button aria-label="Cerrar modal">×</button>

// Form inputs
<input aria-label="Nombre completo" aria-required="true" />

// Roles
<div role="group" aria-label="Opciones">
  {/* contenido */}
</div>

// Live regions
<div role="alert" aria-live="polite">Mensaje importante</div>
```
