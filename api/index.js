// Vercel Serverless Function Handler
// Este archivo actúa como punto de entrada para todas las rutas de la API

const path = require('path');

// Importar la aplicación Express compilada del backend
let backendApp;

try {
  // Intentar importar la aplicación desde el directorio dist del backend
  backendApp = require('../backend/dist/index.js');
  
  // Si la exportación es un objeto con default, usar default
  if (backendApp && typeof backendApp === 'object' && backendApp.default) {
    backendApp = backendApp.default;
  }
} catch (error) {
  console.error('Error importing backend application:', error);
  
  // Función de fallback si no se puede importar la aplicación
  backendApp = (req, res) => {
    res.status(500).json({
      error: 'Backend application not available',
      message: 'The backend application could not be loaded',
      details: error.message
    });
  };
}

// Wrapper para manejar las rutas con prefijo /api
const apiHandler = (req, res) => {
  // Eliminar el prefijo /api de la URL para que coincida con las rutas del backend
  const originalUrl = req.url;
  if (req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '');
  }
  
  // Si la URL queda vacía después de eliminar /api, redirigir a /
  if (req.url === '') {
    req.url = '/';
  }
  
  console.log(`API Request: ${originalUrl} -> ${req.url}`);
  
  // Pasar la petición al backend
  return backendApp(req, res);
};

// Exportar el handler para Vercel
module.exports = apiHandler;
