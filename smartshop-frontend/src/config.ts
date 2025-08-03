// Configuración dinámica de la API
const getApiBaseUrl = (): string => {
  // En producción, usar las funciones de Netlify
  if (import.meta.env.PROD || import.meta.env.MODE === 'production') {
    // Si VITE_API_URL es una URL relativa, construir la URL absoluta
    const apiUrl = import.meta.env.VITE_API_URL || '/.netlify/functions';
    if (apiUrl.startsWith('/')) {
      // Para producción en Netlify, usar URL absoluta
      return 'https://appcompras.netlify.app/.netlify/functions';
    }
    return apiUrl;
  }
  
  // En desarrollo, usar servidor local
  return import.meta.env.VITE_API_URL || 'http://localhost:3001';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    PRODUCTS: '/products',
    CATEGORIES: '/categories',
    SUBCATEGORIES: '/subcategories',
    SEARCH: '/products/search'
  }
};

// Función para construir URLs completas
export const buildApiUrl = (endpoint: string, params?: Record<string, string>) => {
  let url;
  
  // Si estamos en producción y usando funciones de Netlify
  if (API_CONFIG.BASE_URL.includes('appcompras.netlify.app/.netlify/functions')) {
    // Para funciones de Netlify, necesitamos agregar '/index' antes del endpoint
    // Usar URL absoluta para evitar problemas de CSP
    url = `${API_CONFIG.BASE_URL}/index${endpoint}`;
  } else if (API_CONFIG.BASE_URL.includes('/.netlify/functions')) {
    // Si BASE_URL es relativa, construir URL absoluta
    url = `https://appcompras.netlify.app/.netlify/functions/index${endpoint}`;
  } else {
    // Para desarrollo local
    url = `${API_CONFIG.BASE_URL}${endpoint}`;
  }
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  
  console.log('🔧 Construyendo URL API:', url);
  return url;
};

// Log de configuración detallado
console.log('🔧 CONFIGURACIÓN API DINÁMICA:', {
  BASE_URL: API_CONFIG.BASE_URL,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.NODE_ENV
});
console.log('📅 TIMESTAMP:', new Date().toISOString());
console.log('🚀 CONFIGURACIÓN DINÁMICA APLICADA');