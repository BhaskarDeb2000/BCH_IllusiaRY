import express from 'express';
import * as storageItemController from '../controllers/storageItemController';
import { verifyToken } from '../controllers/authController';

const router = express.Router();

// Public routes
router.get('/', storageItemController.getAllItems);
router.get('/search', storageItemController.searchItems);
router.get('/:id', storageItemController.getItemById);

// Protected routes - require authentication
router.post('/', verifyToken, storageItemController.createItem);
router.put('/:id', verifyToken, storageItemController.updateItem);
router.delete('/:id', verifyToken, storageItemController.deleteItem);

export default router; 