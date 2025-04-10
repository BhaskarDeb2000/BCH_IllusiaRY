import express from 'express';
import { Category } from '../models/types';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';

const router = express.Router();

// GET all categories
router.get('/', getAllCategories);

// GET category by ID
router.get('/:id', getCategoryById);

// POST create new category
router.post('/', createCategory);

// PUT update category
router.put('/:id', updateCategory);

// DELETE category
router.delete('/:id', deleteCategory);

export default router; 