import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getProducts,
  restoreProduct,
  toggleProductStatus,
  updateProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/slug/:slug', getProductBySlug);
router.route('/:id').put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.patch('/:id/restore', protect, admin, restoreProduct);
router.patch('/:id/status', protect, admin, toggleProductStatus);

export default router;
