import { Router } from 'express';
import ProductController from '../controllers/ProductController.js';

const router = Router();

router.get('/', ProductController.getProducts);
router.post('/', ProductController.createProduct);

export default router;