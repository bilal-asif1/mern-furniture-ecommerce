import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';

const createReview = asyncHandler(async (req, res) => {
  const { product, rating, comment } = req.body;

  if (!product || !rating || !comment) {
    res.status(400);
    throw new Error('Product, rating, and comment are required');
  }

  const existingReview = await Review.findOne({ product, user: req.user._id });
  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
    await existingReview.save();
    res.json(existingReview);
    return;
  }

  const review = await Review.create({ product, rating, comment, user: req.user._id });
  res.status(201).json(review);
});

const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name avatar');
  res.json(reviews);
});

export { createReview, getProductReviews };
