import { supabase } from '../db/supabase';

export const getSubcategoriesService = async () => {
  // Ajusta el nombre de la tabla si es necesario
  const { data, error } = await supabase.from('subcategories').select('*');
  if (error) throw error;
  return data;
};

export const getSubcategoryByIdService = async (id: string) => {
  const { data, error } = await supabase.from('subcategories').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const getProductsBySubcategoryService = async (subcategoryId: string) => {
  const { data, error } = await supabase.from('products').select('*').eq('subcategory_id', subcategoryId);
  if (error) throw error;
  return data;
}; 