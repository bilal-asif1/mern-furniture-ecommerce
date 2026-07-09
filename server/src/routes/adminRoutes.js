import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import { deleteUser, getUsers, updateUser } from '../controllers/userController.js';
import { getDashboardSummary, getInventoryOverview, getRevenueAnalytics } from '../controllers/adminController.js';
import { createProduct, deleteProduct, getAdminProducts, restoreProduct, toggleProductStatus, updateProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/summary', protect, admin, getDashboardSummary);
router.get('/analytics/revenue', protect, admin, getRevenueAnalytics);
router.get('/inventory', protect, admin, getInventoryOverview);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/products', protect, admin, getAdminProducts);
router.post('/products', protect, admin, createProduct);
router.put('/products/:id', protect, admin, updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);
router.patch('/products/:id/restore', protect, admin, restoreProduct);
router.patch('/products/:id/status', protect, admin, toggleProductStatus);

export default router;
