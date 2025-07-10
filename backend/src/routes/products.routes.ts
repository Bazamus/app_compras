import { Router } from 'express';
import { getAllProducts, getProductById, searchProducts } from '../controllers/products.controller';

const router = Router();

// GET /products
router.get('/', getAllProducts);

// GET /products/search
router.get('/search', searchProducts);

// GET /products/:id
router.get('/:id', getProductById);

export default router; 