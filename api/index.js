// Vercel Serverless Function Handler
// Este archivo actúa como punto de entrada para todas las rutas de la API

const path = require('path');

// Importar la aplicación Express compilada del backend
let app;

try {
  // Intentar importar la aplicación desde el directorio dist del backend
  app = require('../backend/dist/index.js');
  
  // Si la exportación es un objeto con default, usar default
  if (app && typeof app === 'object' && app.default) {
    app = app.default;
  }
} catch (error) {
  console.error('Error importing backend application:', error);
  
  // Función de fallback si no se puede importar la aplicación
  app = (req, res) => {
    res.status(500).json({
      error: 'Backend application not available',
      message: 'The backend application could not be loaded',
      details: error.message
    });
  };
}

// Exportar la aplicación para Vercel
module.exports = app;
