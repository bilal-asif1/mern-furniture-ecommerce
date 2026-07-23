import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

const serializeOrder = (order) => {
  if (!order) return order;

  const plainOrder = typeof order.toObject === 'function' ? order.toObject() : order;

  return {
    ...plainOrder,
    orderNotes: plainOrder.orderNotes || '',
  };
};

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, orderNotes, paymentMethod, taxPrice = 0, shippingPrice = 0, totalPrice } = req.body;

  console.log('=== CREATE ORDER DEBUG ===');
  console.log('Received orderNotes:', orderNotes);
  console.log('Type of orderNotes:', typeof orderNotes);
  console.log('Full req.body:', JSON.stringify(req.body, null, 2));

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Order items are required');
  }

  if (!shippingAddress || !totalPrice) {
    res.status(400);
    throw new Error('Shipping address and total price are required');
  }

  const normalizedOrderNotes = orderNotes || '';

  console.log('Normalized orderNotes:', normalizedOrderNotes);

  const order = await Order.create({
    user: req.user?._id || null,
    orderItems,
    shippingAddress,
    orderNotes: normalizedOrderNotes,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  console.log('Order created with orderNotes:', order.orderNotes);
  console.log('Serialized order:', JSON.stringify(serializeOrder(order), null, 2));

  res.status(201).json(serializeOrder(order));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders.map(serializeOrder));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('orderItems.product', 'name slug images price');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(serializeOrder(order));
});

const getPublicOrderTracking = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('orderItems.product', 'name slug images price');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({
    _id: order._id,
    id: order._id,
    orderNotes: order.orderNotes || '',
    status: order.status,
    createdAt: order.createdAt,
    deliveredAt: order.deliveredAt,
    paidAt: order.paidAt,
    isPaid: order.isPaid,
    totalPrice: order.totalPrice,
    orderItems: order.orderItems,
    shippingAddress: order.shippingAddress,
  });
});

const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
  console.log('=== GET ALL ORDERS DEBUG ===');
  console.log('Orders count:', orders.length);
  if (orders.length > 0) {
    console.log('First order orderNotes:', orders[0].orderNotes);
    console.log('First serialized order:', JSON.stringify(serializeOrder(orders[0]), null, 2));
  }
  res.json(orders.map(serializeOrder));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(serializeOrder(order));
});

export { createOrder, getMyOrders, getOrderById, getPublicOrderTracking, getAllOrders, updateOrderStatus };
