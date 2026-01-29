# API CRM - MERN Server

RESTful API backend para aplicación de gestión de contactos (CRM). Construida con Node.js, Express y MongoDB, implementando MVC pattern con Service Layer.

## 🚀 Quick Start

### Requisitos

- Node.js 18+
- MongoDB 4.4+ (local o MongoDB Atlas)
- npm 8+

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

### Desarrollo

```bash
npm run dev
```

Servidor estará disponible en `http://localhost:3000` (o el puerto configurado en `.env`)

**API Documentation:** `http://localhost:3000/api/v1/docs`

---

## 📋 Configuración (.env)

### Variables Requeridas

```env
MONGO_URI=mongodb://localhost:27017/crm_db
JWT_SECRET=your_secret_key_here_min_32_chars
```

### Variables Opcionales

```env
PORT=3000                                           # Default: 3000
ALLOWED_ORIGINS=http://localhost:5173              # CORS whitelist
NODE_ENV=development                               # development|production
API_PROD_URL=https://api.example.com               # Production API URL (Swagger)
```

---

## 📚 Estructura del Proyecto

```
server/
├── src/
│   ├── server.js                 # Entry point
│   ├── config/
│   │   ├── db.config.js         # MongoDB connection
│   │   └── swagger.config.js    # OpenAPI documentation
│   ├── controllers/              # Request handlers
│   │   ├── auth.controller.js
│   │   ├── contact.controller.js
│   │   └── user.controller.js
│   ├── services/                 # Business logic
│   │   ├── auth.service.js
│   │   ├── contact.service.js
│   │   └── user.service.js
│   ├── models/                   # MongoDB schemas
│   │   ├── contact.model.js
│   │   └── user.model.js
│   ├── middlewares/              # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.middleware.js
│   │   ├── role.middleware.js
│   │   └── validate.middleware.js
│   ├── routes/                   # API endpoints
│   │   ├── auth.routes.js
│   │   ├── contact.routes.js
│   │   └── user.routes.js
│   └── validators/               # Joi schemas
│       ├── auth.validator.js
│       ├── contact.validator.js
│       └── user.validator.js
├── .env.example                  # Environment template
├── package.json
└── README.md                      # This file
```

---

## 🏗️ Arquitectura

**MVC Pattern + Service Layer**

```
Request
  ↓
Routes (Express router)
  ↓
Middleware (Auth, Validation)
  ↓
Controller (Request/Response handling)
  ↓
Service (Business logic)
  ↓
Model (Database operations)
  ↓
Response
```

### Capas

- **Routes**: Definen endpoints y aplican middlewares
- **Controllers**: Orquestan requests, llaman a services
- **Services**: Lógica de negocio, validaciones de dominio
- **Models**: Esquemas MongoDB y acceso a datos
- **Middleware**: Cross-cutting concerns (auth, validation, errors)

---

## 🔐 Seguridad

### Implementado

✅ **JWT Authentication (HS256)**

- Token de 1 hora con auto-refresh
- Validación en endpoints protegidos

✅ **Password Security**

- Hashing con argon2id (RFC 9106)
- Validación: 8+ chars, 1 uppercase, 1 number
- Auto-rehashing si parámetros cambian

✅ **Input Validation**

- Joi schemas en todos los endpoints
- ObjectId validation
- Email normalization (lowercase, trim)
- Field sanitization (.stripUnknown)

✅ **HTTP Security Headers**

- HSTS (1 año)
- X-Frame-Options: DENY (clickjacking)
- X-Content-Type-Options: nosniff (MIME sniffing)
- Referrer-Policy: no-referrer

✅ **CORS**

- Whitelist dinámico (ALLOWED_ORIGINS)
- Preflight caching (24h)
- Credentials disabled (JWT en headers)

✅ **Error Handling**

- Mensajes genéricos (no user enumeration)
- Status codes apropiados (401, 403, 404, 409)
- Centralizado en middleware

---

## 📦 Dependencias

| Librería               | Versión | Propósito                   |
| ---------------------- | ------- | --------------------------- |
| **express**            | 5.2.1   | Framework web               |
| **mongoose**           | 9.1.2   | MongoDB ODM                 |
| **jsonwebtoken**       | 9.0.3   | JWT authentication          |
| **argon2**             | 0.44.0  | Password hashing (RFC 9106) |
| **cors**               | 2.8.5   | Cross-Origin requests       |
| **helmet**             | 8.1.0   | Security headers            |
| **joi**                | 18.0.2  | Input validation            |
| **dotenv**             | 17.2.3  | Environment variables       |
| **swagger-jsdoc**      | 6.2.8   | OpenAPI spec generation     |
| **swagger-ui-express** | 5.0.1   | API documentation UI        |

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/v1/auth/register         # Register new user
POST   /api/v1/auth/login            # Login (returns JWT)
POST   /api/v1/auth/refresh          # Refresh token
```

### Users (Admin only)

```
GET    /api/v1/users                 # List all users
GET    /api/v1/users/:id             # Get user by ID
POST   /api/v1/users                 # Create user
PUT    /api/v1/users/:id             # Update user
DELETE /api/v1/users/:id             # Delete user (soft)
```

### Contacts

```
GET    /api/v1/contacts              # List contacts (with optional status filter)
GET    /api/v1/contacts/:id          # Get contact by ID
POST   /api/v1/contacts              # Create contact
PUT    /api/v1/contacts/:id          # Update contact
PATCH  /api/v1/contacts/:id/status   # Update contact status only
DELETE /api/v1/contacts/:id          # Delete contact (soft)
```

**Full documentation:** Visit `/api/v1/docs` when server is running.

---

## 🗄️ Database

### Models

**User**

```javascript
{
  email: String (unique),
  password: String (hashed with argon2),
  role: 'admin' | 'sales',
  active: Boolean,
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

**Contact**

```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  status: 'NEW' | 'IN_PROGRESS' | 'CONTACTED' | 'CLOSED',
  notes: String,
  assignedTo: ObjectId (User, required sales role),
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

Optimizados para queries MVP:

```javascript
// User indexes
{ email: 1 } (unique)
{ active: 1 }
{ role: 1 }

// Contact indexes
{ active: 1 }
{ assignedTo: 1, active: 1 }
{ status: 1, active: 1 }
{ email: 1 }
```

---

## 🔑 Autenticación & Autorización

### JWT Flow

1. **Register**: `POST /api/v1/auth/register` → User creado, sin token
2. **Login**: `POST /api/v1/auth/login` → Token JWT retornado
3. **Protected Requests**: Header `Authorization: Bearer <token>`
4. **Token Refresh**: `POST /api/v1/auth/refresh` → Nuevo token

### Roles

- **Admin**: Acceso completo a usuarios y contactos
- **Sales**: Acceso solo a contactos asignados a ellos

### Soft Delete

Todos los recursos use `active: Boolean`:

- Delete no borra, solo marca `active: false`
- Queries filtran por `active: true` automáticamente
- Permite recuperación de datos

---

## 🧪 Testing

### Unit Testing (Futuro)

```bash
npm run test
npm run test:coverage
```

### Manual Testing

```bash
# Con cURL
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123"}'

# Con Insomnia/Postman
# Importar desde Swagger UI: /api/v1/docs
```

---

## 📊 Performance

### Optimizaciones

- **Lean Queries**: `.lean()` en todas las reads (retorna objetos planos)
- **Indexes**: En campos frecuentemente consultados
- **CORS Preflight Caching**: 24 horas
- **JWT Validation**: Sin DB lookups
- **Soft Delete**: Sin reconstrucción de índices

### Monitoreo (Futuro)

```bash
npm run monitor      # Health checks
npm run logs        # Centralized logging
```

---

## 🚨 Troubleshooting

### Error: JWT_SECRET not configured

```bash
# Verificar .env existe
ls .env

# Verificar variable está seteada
echo $JWT_SECRET
```

### Error: MongoDB connection refused

```bash
# Verificar MongoDB está corriendo
mongosh --eval "db.adminCommand('ping')"

# O iniciar MongoDB
mongod
```

### Error: Port already in use

```bash
# Cambiar puerto en .env
PORT=3001

# O matar proceso
lsof -ti:3000 | xargs kill -9
```

---

## 🚀 Deployment

### Production Checklist

- [ ] `NODE_ENV=production` en .env
- [ ] `JWT_SECRET` con clave aleatoria fuerte (32+ chars)
- [ ] MongoDB Atlas o instancia remota configurada
- [ ] `API_PROD_URL` seteado para Swagger UI
- [ ] HTTPS habilitado (nginx/reverse proxy)
- [ ] Logs centralizados
- [ ] Monitoring activo
- [ ] Backup strategy

### Heroku

```bash
heroku create crm-api
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MONGO_URI=your_mongodb_uri
git push heroku main
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
CMD ["node", "src/server.js"]
```

---

## 📈 Métricas de Calidad

| Atributo            | Nivel      | Detalles                                |
| ------------------- | ---------- | --------------------------------------- |
| **Security**        | ⭐⭐⭐⭐⭐ | JWT, argon2, Helmet, CORS, validation   |
| **Maintainability** | ⭐⭐⭐⭐   | MVC, Service Layer, Clear structure     |
| **Scalability**     | ⭐⭐⭐⭐   | Indexes, lean(), versioning             |
| **Reliability**     | ⭐⭐⭐⭐   | Error handling, validation, try/catch   |
| **Testability**     | ⭐⭐⭐⭐   | Service isolation, dependency injection |

---

## 📝 Contribuciones

### Code Style

```bash
npm run format    # Prettier formatting
```

### Commit Messages

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add password reset endpoint
fix(contact): handle soft delete properly
refactor(service): extract validation logic
docs(api): update endpoint documentation
```

---

## 📞 Soporte

- **Documentación API**: `/api/v1/docs` (Swagger UI)
- **Issues**: Reportar en GitHub
- **Contacto**: [Email del equipo]

---

## 📄 Licencia

ISC

---

**Última actualización:** Enero 2026  
**Versión:** 1.0.0  
**Status:** MVP Production-Ready
