import { Router } from 'express';
import { getAllCategories, getCategoryById, getProductsByCategory, getSubcategoriesByCategory } from '../controllers/categories.controller';

const router = Router();

// GET /categories
router.get('/', getAllCategories);

// GET /categories/:id
router.get('/:id', getCategoryById);

// GET /categories/:id/products
router.get('/:id/products', getProductsByCategory);

// GET /categories/:id/subcategories
router.get('/:id/subcategories', getSubcategoriesByCategory);

export default router; 