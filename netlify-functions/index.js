// Netlify Function Handler
// Este archivo sirve como punto de entrada para las funciones serverless de Netlify

const backend = require('../backend/dist/index.js');

// Agregar logging para debug
console.log('Netlify Function iniciada');
console.log('Variables de entorno:', {
  SUPABASE_URL: process.env.SUPABASE_URL,
  NODE_ENV: process.env.NODE_ENV
});

// Exportar el handler para Netlify Functions
exports.handler = backend.handler; 