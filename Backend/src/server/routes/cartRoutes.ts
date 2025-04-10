import express from 'express';
import { Cart, CartItem } from '../models/types';
import {
  getCartByUserId,
  createOrUpdateCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart
} from '../controllers/cartController';

const router = express.Router();

// GET cart by user ID
router.get('/:userId', getCartByUserId);

// POST create/update cart
router.post('/:userId', createOrUpdateCart);

// PUT add item to cart
router.put('/:userId/items', addItemToCart);

// PUT update cart item quantity
router.put('/:userId/items/:itemId', updateCartItemQuantity);

// DELETE remove item from cart
router.delete('/:userId/items/:itemId', removeItemFromCart);

// DELETE clear cart
router.delete('/:userId', clearCart);

export default router; 