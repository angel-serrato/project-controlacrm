# MERN CRM & Inventory Manager - MVP

## Descripción

MVP de un **CRM y Gestor de Inventarios** construido con el stack **MERN (MongoDB, Express, React, Node.js)**. Permite gestionar clientes, productos y stock de manera básica para validar la idea del producto.

---

## Funcionalidades principales

- Gestión de clientes (CRUD)
- Gestión de productos/inventario (CRUD)
- Dashboard simple con métricas básicas
- Autenticación de usuario con JWT

---

## Tecnologías

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, Tailwind CSS, DaisyUI
- **Autenticación:** JWT en cookies
- **Testing:** Jest (backend)

---

## Estructura del proyecto

```
/project-root
│
├─ backend/
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ middlewares/
│  └─ app.js
│
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  └─ App.jsx
│
├─ .env
├─ package.json
└─ README.md
```

---

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/mern-crm-inventory.git
cd mern-crm-inventory
```

2. Configurar variables de entorno:

```env
# backend/.env
MONGO_URI=tu_mongodb_atlas
JWT_SECRET=tu_jwt_secret
PORT=5000
```

3. Instalar dependencias:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

4. Ejecutar el proyecto en desarrollo:

```bash
# Backend
cd backend
node --watch app.js

# Frontend
cd frontend
npm start
```

---

## Uso

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

---

## Testing

Ejecutar tests backend:

```bash
cd backend
npm test
```

---

## Contribución

Revisa `CONTRIBUTING.md` para normas de commits, ramas y pruebas.

---

## Licencia

MIT License
