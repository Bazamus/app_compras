import { Request, Response } from 'express';
import { getSubcategoriesService, getSubcategoryByIdService, getProductsBySubcategoryService } from '../services/subcategories.service';

export const getAllSubcategories = async (req: Request, res: Response) => {
  try {
    const subcategories = await getSubcategoriesService();
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las subcategorías' });
  }
};

export const getSubcategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subcategory = await getSubcategoryByIdService(id);
    if (!subcategory) {
      res.status(404).json({ error: 'Subcategoría no encontrada' });
      return;
    }
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la subcategoría' });
  }
};

export const getProductsBySubcategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const products = await getProductsBySubcategoryService(id);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos de la subcategoría' });
  }
}; 