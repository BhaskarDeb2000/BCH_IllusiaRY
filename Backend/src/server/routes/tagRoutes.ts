import express from 'express';
import { Tag } from '../models/types';
import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag
} from '../controllers/tagController';

const router = express.Router();

// GET all tags
router.get('/', getAllTags);

// GET tag by ID
router.get('/:id', getTagById);

// POST create new tag
router.post('/', createTag);

// PUT update tag
router.put('/:id', updateTag);

// DELETE tag
router.delete('/:id', deleteTag);

export default router; 