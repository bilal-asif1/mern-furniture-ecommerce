import express from 'express';
import { admin, optionalProtect, protect } from '../middleware/authMiddleware.js';
import { createOrder, getAllOrders, getMyOrders, getOrderById, getPublicOrderTracking, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', optionalProtect, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/track/:id', getPublicOrderTracking);
router.get('/', protect, admin, getAllOrders);
router.route('/:id').get(protect, getOrderById).put(protect, admin, updateOrderStatus);

export default router;
