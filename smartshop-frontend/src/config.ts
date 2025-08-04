// Configuración simplificada para Supabase Edge Functions
const SUPABASE_URL = 'https://kgoefkwzesmimrwhgxxo.supabase.co'

const getApiBaseUrl = (): string => {
  // Usar Supabase Edge Functions en producción
  if (import.meta.env.PROD || import.meta.env.MODE === 'production') {
    return `${SUPABASE_URL}/functions/v1`;
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

// Para Edge Functions, cada endpoint apunta a su función específica
export const EDGE_FUNCTION_ENDPOINTS = {
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  SUBCATEGORIES: '/subcategories'
};

// Función simplificada para construir URLs de Edge Functions
export const buildApiUrl = (endpoint: string, params?: Record<string, string>) => {
  let url;
  
  // Si estamos en producción, usar Supabase Edge Functions
  if (API_CONFIG.BASE_URL.includes('supabase.co/functions/v1')) {
    // Para Edge Functions, el endpoint ya incluye la función específica
    url = `${API_CONFIG.BASE_URL}${endpoint}`;
  } else {
    // Para desarrollo local
    url = `${API_CONFIG.BASE_URL}${endpoint}`;
  }
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  
  console.log('🔧 Edge Function URL:', url);
  return url;
};

// Log de configuración detallado
console.log('🚀 SUPABASE EDGE FUNCTIONS CONFIG:', {
  BASE_URL: API_CONFIG.BASE_URL,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  SUPABASE_URL: SUPABASE_URL,
  NODE_ENV: import.meta.env.NODE_ENV
});
console.log('📅 TIMESTAMP:', new Date().toISOString());
console.log('🚀 CONFIGURACIÓN DINÁMICA APLICADA');