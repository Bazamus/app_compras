import { Request, Response } from 'express';
import { getProductsService, getProductByIdService, searchProductsService } from '../services/products.service';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await getProductsService();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { nombre, min_precio, max_precio, subcategory_id } = req.query;
    const products = await searchProductsService({
      nombre: nombre as string,
      min_precio: min_precio ? Number(min_precio) : undefined,
      max_precio: max_precio ? Number(max_precio) : undefined,
      subcategory_id: subcategory_id ? Number(subcategory_id) : undefined,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error en la búsqueda de productos' });
  }
}; 