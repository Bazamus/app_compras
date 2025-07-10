import { Router } from 'express';
import { getAllSubcategories, getSubcategoryById, getProductsBySubcategory } from '../controllers/subcategories.controller';

const router = Router();

// GET /subcategories
router.get('/', getAllSubcategories);

// GET /subcategories/:id
router.get('/:id', getSubcategoryById);

// GET /subcategories/:id/products
router.get('/:id/products', getProductsBySubcategory);

export default router; 