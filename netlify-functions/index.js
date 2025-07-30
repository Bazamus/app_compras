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
  
  // Para todas las demás rutas, usar el handler del backend
  // Modificar el path para que funcione con Express
  const modifiedEvent = {
    ...event,
    path: event.path.replace('/.netlify/functions/index', '')
  };
  
  console.log('Evento modificado:', modifiedEvent);
  
  try {
    const result = await backend.handler(modifiedEvent, context);
    console.log('Resultado del backend:', result);
    return result;
  } catch (error) {
    console.error('Error en el backend:', error);
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
};

// Exportar el handler para Netlify Functions
exports.handler = handler; 