import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getCart, syncCart } from '../controllers/cartController.js';

const router = express.Router();

router.get('/', protect, getCart);
router.put('/', protect, syncCart);

export default router;
