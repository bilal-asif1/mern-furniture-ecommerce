import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createReview, getProductReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);

export default router;
