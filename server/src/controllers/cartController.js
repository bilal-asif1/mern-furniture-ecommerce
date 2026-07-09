import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { user: req.user._id, items: [] });
});

const syncCart = asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error('items must be an array');
  }

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items },
    { upsert: true, new: true },
  ).populate('items.product');
  res.json(cart);
});

export { getCart, syncCart };
