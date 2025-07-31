import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import productsRouter from './routes/products.routes';
import categoriesRouter from './routes/categories.routes';
import subcategoriesRouter from './routes/subcategories.routes';
import serverless from 'serverless-http';

dotenv.config();

// Depuración de variables de entorno
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);

const app = express();
const port = process.env.PORT || 3001;

// Habilitar CORS para permitir peticiones desde el frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://appcompras.netlify.app',
  'https://deploy-preview-*--appcompras.netlify.app' // Para preview deployments
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (ej: aplicaciones móviles)
    if (!origin) return callback(null, true);
    
    // Verificar si el origin está en la lista permitida o es un preview deployment
    if (allowedOrigins.some(allowed => 
      origin === allowed || 
      (allowed.includes('*') && origin.includes('appcompras.netlify.app'))
    )) {
      return callback(null, true);
    }
    
    return callback(new Error('No permitido por CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Conexión a Supabase
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string,
);

// Endpoints de verificación y health check
app.get('/ping', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      supabase_url: process.env.SUPABASE_URL ? 'configured' : 'missing',
      supabase_key: process.env.SUPABASE_ANON_KEY ? 'configured' : 'missing'
    }
  });
});

app.get('/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint - Configuración del servidor',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    headers: req.headers,
    origin: req.get('origin'),
    host: req.get('host'),
    userAgent: req.get('user-agent')
  });
});

app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/subcategories', subcategoriesRouter);

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${port}`);
  });
}

// Exportar el handler para Netlify
export const handler = serverless(app);