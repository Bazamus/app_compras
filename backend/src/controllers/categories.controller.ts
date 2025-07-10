import { Request, Response } from 'express';
import { getCategoriesService, getCategoryByIdService, getProductsByCategoryService, getSubcategoriesByCategoryService } from '../services/categories.service';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getCategoriesService();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await getCategoryByIdService(id);
    if (!category) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const products = await getProductsByCategoryService(id);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos de la categoría' });
  }
};

export const getSubcategoriesByCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subcategories = await getSubcategoriesByCategoryService(id);
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las subcategorías de la categoría' });
  }
}; 