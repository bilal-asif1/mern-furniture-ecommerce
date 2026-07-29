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

const getDetailedAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const dateFilter = {};
  
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  const [orders, products, categories, customers] = await Promise.all([
    Order.find(dateFilter).populate('user', 'name email').populate('orderItems.product', 'name images price category').sort({ createdAt: -1 }),
    Product.find({ isDeleted: { $ne: true } }).populate('category', 'name'),
    Category.find(),
    User.find({ role: 'customer' }),
  ]);

  // Calculate top selling products
  const productSales = {};
  orders.forEach(order => {
    order.orderItems.forEach(item => {
      const productId = item.product?._id?.toString() || item.product;
      if (!productSales[productId]) {
        productSales[productId] = {
          productId,
          name: item.name,
          image: item.image || item.product?.images?.[0] || '',
          unitsSold: 0,
          revenue: 0,
        };
      }
      productSales[productId].unitsSold += item.qty;
      productSales[productId].revenue += item.price * item.qty;
    });
  });

  const topSellingProducts = Object.values(productSales)
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 10)
    .map(product => ({
      ...product,
      stock: products.find(p => p._id.toString() === product.productId)?.stock || 0,
    }));

  // Calculate category revenue
  const categoryRevenue = {};
  orders.forEach(order => {
    order.orderItems.forEach(item => {
      const categoryName = item.product?.category?.name || 'Uncategorized';
      if (!categoryRevenue[categoryName]) {
        categoryRevenue[categoryName] = 0;
      }
      categoryRevenue[categoryName] += item.price * item.qty;
    });
  });

  const categoryPerformance = Object.entries(categoryRevenue)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  // Calculate sales overview
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Find best selling day
  const daySales = {};
  orders.forEach(order => {
    const day = new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
    if (!daySales[day]) daySales[day] = 0;
    daySales[day] += order.totalPrice;
  });
  const bestSellingDay = Object.entries(daySales).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Find best selling month
  const monthSales = {};
  orders.forEach(order => {
    const month = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!monthSales[month]) monthSales[month] = 0;
    monthSales[month] += order.totalPrice;
  });
  const bestSellingMonth = Object.entries(monthSales).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const bestSellingCategory = categoryPerformance[0]?.name || 'N/A';
  
  // Calculate total discount given
  let totalDiscount = 0;
  orders.forEach(order => {
    order.orderItems.forEach(item => {
      const product = products.find(p => p._id.toString() === (item.product?._id?.toString() || item.product));
      if (product && product.discountPrice && product.discountPrice < product.price) {
        const discountPerUnit = product.price - product.discountPrice;
        totalDiscount += discountPerUnit * item.qty;
      }
    });
  });

  // Recent transactions
  const recentTransactions = orders.slice(0, 20).map(order => ({
    id: order._id,
    customer: order.user?.name || order.shippingAddress?.fullName || 'Guest',
    orderId: order._id.toString().slice(-8).toUpperCase(),
    amount: order.totalPrice,
    status: order.status,
    date: order.createdAt,
  }));

  // Monthly revenue for line chart
  const monthlyRevenueData = await Order.aggregate([
    ...(Object.keys(dateFilter).length ? [{ $match: dateFilter }] : []),
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$totalPrice' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyChart = monthlyRevenueData.map(item => ({
    month: monthNames[item._id.month - 1],
    year: item._id.year,
    revenue: item.revenue,
  }));

  res.json({
    summary: {
      totalRevenue,
      totalOrders,
      totalCustomers: customers.length,
      totalProducts: products.length,
    },
    topSellingProducts,
    recentTransactions,
    categoryPerformance,
    salesOverview: {
      averageOrderValue,
      bestSellingDay,
      bestSellingMonth,
      bestSellingCategory,
      totalDiscount,
    },
    monthlyRevenue: monthlyChart,
    categoryRevenue: categoryPerformance,
  });
});

export { getDashboardSummary, getRevenueAnalytics, getInventoryOverview, getDetailedAnalytics };
