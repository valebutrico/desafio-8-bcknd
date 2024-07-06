import express from 'express';
import { renderProductsPage, renderCartPage } from '../controllers/viewController.js';

const router = express.Router();

router.get('/products', renderProductsPage);
router.get('/carts/:cid', renderCartPage);

export default router;