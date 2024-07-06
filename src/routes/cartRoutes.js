import express from 'express';
import {addProductToCart, createCart, deleteProductFromCart, updateCart, updateProductQuantityInCart, deleteAllProductsFromCart, getCartById } from '../controllers/cartController.js';

const router = express.Router();

router.post('/', createCart); 
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.delete('/:cid', deleteAllProductsFromCart);
router.put('/:cid/products/:pid', addProductToCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantityInCart);
router.get('/:cid', getCartById);

export default router;