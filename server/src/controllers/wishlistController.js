import asyncHandler from 'express-async-handler';
import Wishlist from '../models/Wishlist.js';

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
  res.json(wishlist || { user: req.user._id, products: [] });
});

const toggleWishlistItem = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    res.status(400);
    throw new Error('productId is required');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
  else {
    const hasProduct = wishlist.products.some((id) => id.toString() === productId);
    wishlist.products = hasProduct ? wishlist.products.filter((id) => id.toString() !== productId) : [...wishlist.products, productId];
    await wishlist.save();
  }
  await wishlist.populate('products');
  res.json(wishlist);
});

const clearWishlist = asyncHandler(async (req, res) => {
  await Wishlist.findOneAndUpdate({ user: req.user._id }, { products: [] }, { upsert: true, new: true });
  res.json({ message: 'Wishlist cleared' });
});

export { getWishlist, toggleWishlistItem, clearWishlist };
