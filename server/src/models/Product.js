import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    images: [{ type: String }],
    thumbnailImage: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, default: 'Junaid Furniture' },
    sku: { type: String, default: '' },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    badges: [{ type: String }],
    productStatus: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    material: { type: String, default: '' },
    color: { type: String, default: '' },
    weight: { type: Number, default: 0 },
    warranty: { type: String, default: '' },
    deliveryTime: { type: String, default: '' },
    availability: { type: String, default: 'In Stock' },
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },
    tags: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

productSchema.pre('validate', function setSlug(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});

export default mongoose.model('Product', productSchema);
