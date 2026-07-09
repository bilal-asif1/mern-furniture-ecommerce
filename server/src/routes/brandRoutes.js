import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import { createBrand, deleteBrand, getBrandBySlug, getBrands, updateBrand } from '../controllers/brandController.js';

const router = express.Router();

router.route('/').get(getBrands).post(protect, admin, createBrand);
router.get('/slug/:slug', getBrandBySlug);
router.route('/:id').put(protect, admin, updateBrand).delete(protect, admin, deleteBrand);

export default router;
