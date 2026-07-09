import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { clearWishlist, getWishlist, toggleWishlistItem } from '../controllers/wishlistController.js';

const router = express.Router();

router.get('/', protect, getWishlist);
router.post('/toggle', protect, toggleWishlistItem);
router.delete('/clear', protect, clearWishlist);

export default router;
