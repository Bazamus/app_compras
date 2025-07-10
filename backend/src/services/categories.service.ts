import { supabase } from '../db/supabase';

export const getCategoriesService = async () => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data;
};

export const getCategoryByIdService = async (id: string) => {
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const getProductsByCategoryService = async (categoryId: string) => {
  // 1. Obtener subcategorías de la categoría
  const { data: subcategories, error: subcatError } = await supabase
    .from('subcategories')
    .select('id')
    .eq('category_id', categoryId);
  if (subcatError) throw subcatError;
  if (!subcategories || subcategories.length === 0) return [];

  const subcategoryIds = subcategories.map((subcat: { id: number }) => subcat.id);

  // 2. Obtener productos con subcategory_id en el listado
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .in('subcategory_id', subcategoryIds);
  if (prodError) throw prodError;
  return products;
};

export const getSubcategoriesByCategoryService = async (categoryId: string) => {
  const { data, error } = await supabase.from('subcategories').select('*').eq('category_id', categoryId);
  if (error) throw error;
  return data;
}; 