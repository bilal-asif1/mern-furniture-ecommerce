import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

const getDashboardSummary = asyncHandler(async (_req, res) => {
  const [products, orders, customers, categories, revenueAgg, pendingOrders, lowStock] = await Promise.all([
    Product.countDocuments({ isDeleted: { $ne: true } }),
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Category.countDocuments(),
    Order.aggregate([{ $group: { _id: null, revenue: { $sum: '$totalPrice' } } }]),
    Order.countDocuments({ status: { $in: ['Pending', 'Processing'] } }),
    Product.countDocuments({ isDeleted: { $ne: true }, stock: { $lte: 5 } }),
  ]);

  res.json({
    revenue: revenueAgg[0]?.revenue || 0,
    orders,
    customers,
    products,
    categories,
    pendingOrders,
    lowStock,
  });
});

const getRevenueAnalytics = asyncHandler(async (_req, res) => {
  const monthlyRevenue = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json(monthlyRevenue.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    revenue: item.revenue,
    orders: item.orders,
  })));
});

const getInventoryOverview = asyncHandler(async (_req, res) => {
  const products = await Product.find({ isDeleted: { $ne: true } })
    .populate('category', 'name slug')
    .sort({ stock: 1, updatedAt: -1 });
  const lowStock = products.filter((product) => product.stock <= 5);

  res.json({
    totalProducts: products.length,
    lowStockCount: lowStock.length,
    lowStock,
    products,
  });
});

export { getDashboardSummary, getRevenueAnalytics, getInventoryOverview };
