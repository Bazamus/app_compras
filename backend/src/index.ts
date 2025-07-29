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
app.use(cors());

// Conexión a Supabase
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string,
);

app.get('/ping', (req, res) => {
  res.json({ message: 'API funcionando correctamente 🚀' });
});

app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/subcategories', subcategoriesRouter);

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${port}`);
  });
}

// Exportar la aplicación para Vercel
export default app;

// También exportar el handler para Netlify (compatibilidad)
export const handler = serverless(app);