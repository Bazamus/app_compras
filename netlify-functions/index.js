// Netlify Function Handler
// Este archivo sirve como punto de entrada para las funciones serverless de Netlify

const backend = require('../backend/dist/index.js');

// Agregar logging para debug
console.log('Netlify Function iniciada');
console.log('Variables de entorno:', {
  SUPABASE_URL: process.env.SUPABASE_URL,
  NODE_ENV: process.env.NODE_ENV
});

// Crear un handler personalizado para debugging
const handler = async (event, context) => {
  console.log('Evento recibido:', event);
  console.log('Contexto:', context);
  
  // Si es una petición a /ping, responder directamente
  if (event.path === '/ping' || event.path === '/.netlify/functions/index/ping') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: JSON.stringify({ 
        message: 'API funcionando correctamente 🚀',
        path: event.path,
        method: event.httpMethod
      })
    };
  }
  
  // Si es una petición a /products, probar el backend directamente
  if (event.path === '/products' || event.path === '/.netlify/functions/index/products') {
    console.log('Probando endpoint de productos...');
    try {
      // Crear un evento simulado para el backend
      const testEvent = {
        ...event,
        path: '/products',
        httpMethod: 'GET'
      };
      
      const result = await backend.handler(testEvent, context);
      console.log('Resultado del backend:', result);
      return result;
    } catch (error) {
      console.error('Error en endpoint de productos:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Error interno del servidor',
          details: error.message
        })
      };
    }
  }
  
  // Para otras rutas, usar el handler del backend
  return backend.handler(event, context);
};

// Exportar el handler para Netlify Functions
exports.handler = handler; 