import express from 'express';
import { celebrate } from 'celebrate';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { optionalAuth } from '../middleware/optionalAuth.js';
import {
  addToCartSchema,
  updateCartItemSchema,
  removeFromCartSchema,
} from '../validations/cartValidation.js';

const router = express.Router();

router.post('/api/cart/items', celebrate(addToCartSchema), optionalAuth, addToCart);
router.get('/api/cart', optionalAuth, getCart);
router.patch('/api/cart/items', celebrate(updateCartItemSchema), optionalAuth, updateCartItem);
router.delete('/api/cart/items', celebrate(removeFromCartSchema), optionalAuth, removeFromCart);
router.delete('/api/cart', optionalAuth, clearCart);

export default router;
