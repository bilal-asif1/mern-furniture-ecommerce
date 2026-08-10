import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import slugify from '../utils/slugify.js';
import { deleteImageValue, uploadImageValue } from '../utils/productMedia.js';

const toBoolean = (value) => value === true || value === 'true';
const normalizeStatus = (value) => (String(value || '').toLowerCase() === 'inactive' ? 'inactive' : 'active');
const resolveSlug = (name = '', slug = '') => slugify(slug || name);

const resolveCategoryImage = async (image, { existingImage = '', removeImage = false } = {}) => {
  if (removeImage) {
    if (existingImage) {
      await deleteImageValue(existingImage);
    }
    return '';
  }

  if (!image) {
    return existingImage || '';
  }

  if (image === existingImage) {
    return existingImage;
  }

  const uploaded = await uploadImageValue(image, { fallback: existingImage || '' });
  if (existingImage && uploaded && uploaded !== existingImage) {
    await deleteImageValue(existingImage);
  }

  return uploaded;
};

const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json(category);
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, image, status } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const normalizedSlug = resolveSlug(name, slug);
  const exists = await Category.findOne({ $or: [{ name }, { slug: normalizedSlug }] });
  if (exists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const resolvedImage = await resolveCategoryImage(image, { existingImage: '' });
  const category = await Category.create({
    name,
    slug: normalizedSlug,
    description,
    image: resolvedImage,
    status: normalizeStatus(status),
  });

  res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const nextName = req.body.name?.trim() || category.name;
  const nextSlug = resolveSlug(nextName, req.body.slug || category.slug);
  const duplicate = await Category.findOne({
    _id: { $ne: req.params.id },
    $or: [{ name: nextName }, { slug: nextSlug }],
  });

  if (duplicate) {
    res.status(400);
    throw new Error('Category already exists');
  }

  category.name = nextName;
  category.slug = nextSlug;
  category.description = req.body.description ?? category.description;
  category.status = normalizeStatus(req.body.status || category.status);

  const removeImage = toBoolean(req.body.removeImage) || req.body.image === '';
  category.image = await resolveCategoryImage(req.body.image, {
    existingImage: category.image || '',
    removeImage,
  });

  await category.save();
  res.json(category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (category.image) {
    await deleteImageValue(category.image);
  }

  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category removed' });
});

export { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
