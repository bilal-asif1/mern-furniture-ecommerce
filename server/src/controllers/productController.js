import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import slugify from '../utils/slugify.js';
import { normalizeProductPayload } from '../utils/productMedia.js';

const buildProductFilter = (query = {}, { includeDeleted = false } = {}) => {
  const filter = {};

  if (query.keyword) {
    filter.$or = [
      { name: { $regex: query.keyword, $options: 'i' } },
      { description: { $regex: query.keyword, $options: 'i' } },
      { sku: { $regex: query.keyword, $options: 'i' } },
      { brand: { $regex: query.keyword, $options: 'i' } },
    ];
  }

  if (query.categoryId) {
    filter.category = query.categoryId;
  }

  if (query.featured === 'true') {
    filter.featured = true;
  }

  if (query.bestSeller === 'true') {
    filter.bestSeller = true;
  }

  if (query.newArrival === 'true') {
    filter.newArrival = true;
  }

  if (query.status) {
    filter.productStatus = query.status;
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.stockLow === 'true') {
    filter.stock = { $lte: 5 };
  }

  if (!includeDeleted) {
    filter.isDeleted = { $ne: true };
    if (filter.productStatus) {
      const statusCondition =
        filter.productStatus === 'active'
          ? {
              $or: [
                { productStatus: 'active' },
                { productStatus: { $exists: false } },
              ],
            }
          : { productStatus: filter.productStatus };
      filter.$and = [...(filter.$and || []), statusCondition];
      delete filter.productStatus;
    } else {
      filter.$and = [
        ...(filter.$and || []),
        {
          $or: [
            { productStatus: 'active' },
            { productStatus: { $exists: false } },
          ],
        },
      ];
    }
  }

  return filter;
};

const serializeProduct = (product) => {
  if (!product) return product;

  const json = typeof product.toObject === 'function' ? product.toObject() : product;
  return {
    ...json,
    thumbnailImage: json.thumbnailImage || json.images?.[0] || '',
  };
};

const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const includeDeleted = req.query.includeDeleted === 'true';
  const filter = buildProductFilter(req.query, { includeDeleted });

  const count = await Product.countDocuments(filter);
  const sortBy =
    req.query.sort === 'price_low'
      ? { price: 1 }
      : req.query.sort === 'price_asc'
        ? { price: 1 }
        : req.query.sort === 'price_desc'
          ? { price: -1 }
          : req.query.sort === 'stock_low'
            ? { stock: 1 }
            : req.query.sort === 'stock_high'
              ? { stock: -1 }
              : req.query.sort === 'oldest'
                ? { createdAt: 1 }
                : req.query.sort === 'rating'
                  ? { rating: -1 }
                  : { createdAt: -1 };

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sortBy)
    .limit(limit)
    .skip(limit * (page - 1));

  res.json({ products: products.map(serializeProduct), page, pages: Math.ceil(count / limit), count });
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isDeleted: { $ne: true },
    $or: [
      { productStatus: 'active' },
      { productStatus: { $exists: false } },
    ],
  }).populate('category', 'name slug');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(serializeProduct(product));
});

const createProduct = asyncHandler(async (req, res) => {
  const payload = await normalizeProductPayload({ body: req.body });
  
  const { name, price, category, description } = payload;

  if (!name || !description || price == null || !category) {
    res.status(400);
    throw new Error('Name, description, price, and category are required');
  }

  const exists = await Product.findOne({ $or: [{ name }, { slug: slugify(name) }] });
  if (exists) {
    res.status(400);
    throw new Error('Product already exists');
  }

  const product = await Product.create(payload);
  await product.populate('category', 'name slug');
  res.status(201).json(serializeProduct(product));
});

const updateProduct = asyncHandler(async (req, res) => {
  const existingProduct = await Product.findById(req.params.id);
  if (!existingProduct) {
    res.status(404);
    throw new Error('Product not found');
  }

  const payload = await normalizeProductPayload({
    body: req.body,
    existingProduct,
  });
  
  const updated = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  await updated.populate('category', 'name slug');
  res.json(serializeProduct(updated));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    { new: true },
  );
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ message: 'Product moved to trash', product: serializeProduct(product) });
});

const restoreProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      isDeleted: false,
      deletedAt: null,
    },
    { new: true },
  ).populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ message: 'Product restored', product: serializeProduct(product) });
});

const toggleProductStatus = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.productStatus = product.productStatus === 'active' ? 'inactive' : 'active';
  await product.save();
  await product.populate('category', 'name slug');

  res.json({ message: 'Product status updated', product: serializeProduct(product) });
});

const getAdminProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 100;
  const filter = buildProductFilter(req.query, { includeDeleted: true });

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));

  res.json({ products: products.map(serializeProduct), page, pages: Math.ceil(count / limit), count });
});

export {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  toggleProductStatus,
  getAdminProducts,
};
