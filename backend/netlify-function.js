// Netlify Function Handler
// Este archivo sirve como punto de entrada para las funciones serverless de Netlify

const { handler } = require('./dist/index.js');

// Exportar el handler para Netlify Functions
module.exports = handler; 