// IMPORTANT: Load environment variables FIRST before importing other modules
// that might depend on env variables (like auth.middleware.js)
import dotenv from 'dotenv';
const envResult = dotenv.config({ path: ['.env.local', '.env'] });

if (envResult.error && envResult.error.code !== 'ENOENT') {
  console.error('Error loading .env file:', envResult.error);
  process.exit(1);
}

// Now import remaining modules after env is loaded
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.config.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import contactRoutes from './routes/contact.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.config.js';

if (envResult.error && envResult.error.code !== 'ENOENT') {
  console.error('Error loading .env file:', envResult.error);
  process.exit(1);
}

// Validar variables requeridas (críticas para funcionamiento)
const REQUIRED_ENV_VARS = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  );
  process.exit(1);
}

// Variables opcionales con defaults
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS según best practices
// Lee ALLOWED_ORIGINS desde .env (ej: ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000)
// Si no está configurado, usa defaults para development
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origen (ej: aplicaciones Electron, mobile apps)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`), false);
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-Total-Count'],
  credentials: false, // Set to true si usas cookies/auth a través de CORS
  maxAge: 86400, // Caché preflight responses por 24 horas
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(
  helmet({
    // HSTS: Fuerza HTTPS en navegadores (1 año)
    strictTransportSecurity: {
      maxAge: 31536000, // 1 año
      includeSubDomains: true, // Aplica a subdominios
    },
    // CSP: Deshabilitado (APIs REST no necesitan CSP)
    contentSecurityPolicy: false,
    // X-Frame-Options: Previene clickjacking (DENY = no iframe)
    xFrameOptions: 'DENY',
    // X-Content-Type-Options: Previene MIME sniffing
    xContentTypeOptions: true,
    // Referrer-Policy: No envía referer a otros sitios (privacidad)
    referrerPolicy: { policy: 'no-referrer' },
    // X-DNS-Prefetch-Control: Desabilita prefetch DNS
    xDNSPrefetchControl: true,
    // X-Download-Options: IE8 previene descargas en iframe
    xDownloadOptions: true,
  })
);
app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json({
    message: 'API CRM - MERN',
    version: '1.0.0',
    status: 'running',
    documentation: '/api/v1/docs',
    endpoints: {
      auth: '/api/v1/auth (register, login)',
      users: '/api/v1/users (CRUD)',
      contacts: '/api/v1/contacts (CRUD)',
    },
  });
});

// Configuración de Swagger UI
const swaggerUiOptions = {
  docExpansion: 'list', // Expandir solo tags por defecto (no operaciones)
  defaultModelRendering: 'example', // Mostrar ejemplos primero
  displayRequestDuration: true, // Mostrar tiempo de respuesta
  validatorUrl: null, // Deshabilitado (privacidad)
  swaggerOptions: {
    deepLinking: true, // Permitir links directos a endpoints
  },
};

app.use(
  '/api/v1/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/contacts', contactRoutes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
