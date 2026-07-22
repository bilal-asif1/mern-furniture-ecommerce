import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

const serializeOrder = (order) => {
  if (!order) return order;

  const plainOrder = typeof order.toObject === 'function' ? order.toObject() : order;
  const orderNotes = plainOrder.orderNotes || plainOrder.shippingAddress?.notes || '';

  return {
    ...plainOrder,
    orderNotes,
    shippingAddress: {
      ...plainOrder.shippingAddress,
      notes: plainOrder.shippingAddress?.notes || orderNotes,
    },
  };
};

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, orderNotes, paymentMethod, taxPrice = 0, shippingPrice = 0, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Order items are required');
  }

  if (!shippingAddress || !totalPrice) {
    res.status(400);
    throw new Error('Shipping address and total price are required');
  }

  const normalizedShippingAddress = {
    ...shippingAddress,
    notes: shippingAddress.notes || orderNotes || '',
  };

  const order = await Order.create({
    user: req.user?._id || null,
    orderItems,
    shippingAddress: normalizedShippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  });
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
    orderNotes: order.shippingAddress?.notes || '',
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
