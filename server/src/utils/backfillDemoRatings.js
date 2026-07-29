import Product from '../models/Product.js';
import Review from '../models/Review.js';
import mongoose from 'mongoose';

const backfillDemoRatings = async () => {
  try {
    console.log('Starting demo ratings backfill...');

    // Find all products that have rating=0 or reviewCount=0
    const productsNeedingBackfill = await Product.find({
      $or: [
        { rating: 0 },
        { rating: { $exists: false } },
        { reviewCount: 0 },
        { reviewCount: { $exists: false } },
      ],
      isDeleted: { $ne: true },
    });

    console.log(`Found ${productsNeedingBackfill.length} products needing demo ratings`);

    let updatedCount = 0;

    for (const product of productsNeedingBackfill) {
      // Check if product has real reviews
      const realReviews = await Review.find({ product: product._id });
      
      // Only backfill if no real reviews exist
      if (realReviews.length === 0) {
        const demoRating = Number((Math.random() * (4.9 - 4.2) + 4.2).toFixed(1));
        const demoReviewCount = Math.floor(Math.random() * (250 - 25 + 1)) + 25;

        await Product.findByIdAndUpdate(product._id, {
          rating: demoRating,
          reviewCount: demoReviewCount,
        });

        updatedCount++;
        console.log(`Updated product "${product.name}": rating=${demoRating}, reviewCount=${demoReviewCount}`);
      } else {
        console.log(`Skipped product "${product.name}" - has ${realReviews.length} real reviews`);
      }
    }

    console.log(`Backfill complete. Updated ${updatedCount} products.`);
    return updatedCount;
  } catch (error) {
    console.error('Error during demo ratings backfill:', error);
    throw error;
  }
};

export default backfillDemoRatings;
