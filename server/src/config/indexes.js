import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

const createIndexes = async () => {
  try {
    console.log('Ensuring database indexes...');

    // Product indexes
    await Product.createIndexes([
      { key: { category: 1 }, name: 'category_1' },
      { key: { isDeleted: 1 }, name: 'isDeleted_1' },
      { key: { productStatus: 1 }, name: 'productStatus_1' },
      { key: { featured: 1 }, name: 'featured_1' },
      { key: { bestSeller: 1 }, name: 'bestSeller_1' },
      { key: { newArrival: 1 }, name: 'newArrival_1' },
      { key: { price: 1 }, name: 'price_1' },
      { key: { stock: 1 }, name: 'stock_1' },
      { key: { createdAt: -1 }, name: 'createdAt_-1' },
      { key: { updatedAt: -1 }, name: 'updatedAt_-1' },
      { key: { rating: -1 }, name: 'rating_-1' },
      { key: { isDeleted: 1, productStatus: 1 }, name: 'isDeleted_productStatus' },
    ]);

    // Category indexes
    await Category.createIndexes([
      { key: { slug: 1 }, name: 'slug_1', unique: true },
      { key: { status: 1 }, name: 'status_1' },
    ]);

    // Review indexes
    await Review.createIndexes([
      { key: { product: 1 }, name: 'product_1' },
      { key: { user: 1 }, name: 'user_1' },
      { key: { product: 1, user: 1 }, name: 'product_user' },
    ]);

    // User indexes
    await User.createIndexes([
      { key: { email: 1 }, name: 'email_1', unique: true },
    ]);

    console.log('Database indexes ensured');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

export default createIndexes;
