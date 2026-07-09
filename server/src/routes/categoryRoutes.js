import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import { createCategory, deleteCategory, getCategories, getCategoryBySlug, updateCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.route('/').get(getCategories).post(protect, admin, createCategory);
router.route('/:id').put(protect, admin, updateCategory).delete(protect, admin, deleteCategory);
router.get('/slug/:slug', getCategoryBySlug);

export default router;
