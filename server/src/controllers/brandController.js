import asyncHandler from 'express-async-handler';
import Brand from '../models/Brand.js';

const getBrands = asyncHandler(async (_req, res) => {
  const brands = await Brand.find().sort({ name: 1 });
  res.json(brands);
});

const getBrandBySlug = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ slug: req.params.slug });
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  res.json(brand);
});

const createBrand = asyncHandler(async (req, res) => {
  const { name, slug, description, logo, website, status } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Brand name is required');
  }

  const exists = await Brand.findOne({ $or: [{ name }, { slug }] });
  if (exists) {
    res.status(400);
    throw new Error('Brand already exists');
  }

  const brand = await Brand.create({ name, slug, description, logo, website, status });
  res.status(201).json(brand);
});

const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  res.json(brand);
});

const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  res.json({ message: 'Brand removed' });
});

export { getBrands, getBrandBySlug, createBrand, updateBrand, deleteBrand };
