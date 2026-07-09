import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Order from '../models/Order.js';

const getUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) {
    filter.role = req.query.role;
  }

  const users = await User.find(filter).sort({ createdAt: -1 }).select('-password');
  const orderStats = await Order.aggregate([
    {
      $group: {
        _id: '$user',
        orders: { $sum: 1 },
        revenue: { $sum: '$totalPrice' },
      },
    },
  ]);

  const statsMap = new Map(orderStats.map((item) => [String(item._id), item]));
  const payload = users.map((user) => {
    const stats = statsMap.get(String(user._id));
    return {
      ...user.toObject(),
      orderCount: stats?.orders || 0,
      lifetimeValue: stats?.revenue || 0,
    };
  });

  res.json(payload);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, role, avatar } = req.body;
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = String(email).toLowerCase().trim();
  if (role !== undefined) user.role = role;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();
  res.json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ message: 'User removed' });
});

export { getUsers, updateUser, deleteUser };
