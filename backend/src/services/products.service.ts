import { supabase } from '../db/supabase';

export const getProductsService = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data;
};

export const getProductByIdService = async (id: string) => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

interface SearchProductsParams {
  nombre?: string;
  min_precio?: number;
  max_precio?: number;
  subcategory_id?: number;
}

export const searchProductsService = async (params: SearchProductsParams) => {
  let products: any[] = [];

  if (params.nombre) {
    // Usar la función RPC para búsqueda insensible a acentos y mayúsculas
    const { data, error } = await supabase.rpc('search_products_unaccented', { search_text: params.nombre });
    if (error) throw error;
    products = data || [];
  } else {
    // Si no hay búsqueda por nombre, usar la consulta normal
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    products = data || [];
  }

  // Filtrar por precio y subcategoría en JS si es necesario
  const minPrecio = params.min_precio;
  const maxPrecio = params.max_precio;
  const subcategoryId = params.subcategory_id;

  if (typeof minPrecio === 'number') {
    products = products.filter((prod) => prod.precio_articulo_por_formato_venta_articulo >= minPrecio);
  }
  if (typeof maxPrecio === 'number') {
    products = products.filter((prod) => prod.precio_articulo_por_formato_venta_articulo <= maxPrecio);
  }
  if (typeof subcategoryId === 'number') {
    products = products.filter((prod) => prod.subcategory_id === subcategoryId);
  }

  return products;
}; 