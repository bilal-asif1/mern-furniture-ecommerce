import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

categorySchema.pre('validate', function setSlug(next) {
  if (this.isModified('name') || this.isModified('slug') || !this.slug) {
    this.slug = slugify(this.slug || this.name);
  }
  next();
});

export default mongoose.model('Category', categorySchema);
