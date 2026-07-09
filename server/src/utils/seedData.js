import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';
import { getFallbackProductImage, uploadImageValue } from './productMedia.js';

const mockCategories = [
  { name: 'Living Room', slug: 'living-room', description: 'Sofas, coffee tables, and statement seating.' },
  { name: 'Bedroom', slug: 'bedroom', description: 'Beds, wardrobes, and restful essentials.' },
  { name: 'Dining', slug: 'dining', description: 'Dining tables and chairs designed to host.' },
  { name: 'Office', slug: 'office', description: 'Elegant workspaces with premium craftsmanship.' },
];

const mockBrands = [
  {
    name: 'Junaid Furniture',
    slug: 'junaid-furniture',
    description: 'House brand for the Junaid Furniture catalog.',
    status: 'active',
  },
];

const mockProducts = [
  {
    name: 'Aurelia Sectional Sofa',
    slug: 'aurelia-sectional-sofa',
    categoryName: 'Living Room',
    price: 1890,
    rating: 4.9,
    badges: ['Best Seller'],
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'],
    description: 'Deep comfort, tailored lines, and performance upholstery for modern family spaces.',
    stock: 12,
    material: 'Performance Velvet',
    dimensions: { width: 280, height: 85, depth: 160 },
    featured: true,
  },
  {
    name: 'Nolan Walnut Bed',
    slug: 'nolan-walnut-bed',
    categoryName: 'Bedroom',
    price: 1540,
    rating: 4.8,
    badges: ['New Arrival'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'],
    description: 'A sculpted walnut frame with a calm, luxurious profile.',
    stock: 8,
    material: 'Solid Walnut',
    dimensions: { width: 160, height: 110, depth: 210 },
    featured: true,
  },
  {
    name: 'Haven Dining Set',
    slug: 'haven-dining-set',
    categoryName: 'Dining',
    price: 2210,
    rating: 4.9,
    badges: ['Curated'],
    images: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80'],
    description: 'A warm dining arrangement designed for everyday elegance and long conversations.',
    stock: 5,
    material: 'Solid Oak & Fabric',
    dimensions: { width: 200, height: 75, depth: 100 },
    featured: true,
  },
  {
    name: 'Arcadia Desk',
    slug: 'arcadia-desk',
    categoryName: 'Office',
    price: 920,
    rating: 4.7,
    badges: ['Editor Pick'],
    images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'],
    description: 'A refined workstation with integrated storage and a premium tactile finish.',
    stock: 15,
    material: 'Walnut Veneer & Steel',
    dimensions: { width: 140, height: 74, depth: 70 },
    featured: true,
  },
  {
    name: 'Mira Accent Chair',
    slug: 'mira-accent-chair',
    categoryName: 'Living Room',
    price: 680,
    rating: 4.8,
    badges: ['Trending'],
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80'],
    description: 'Soft curves and elevated texture for a welcoming reading nook.',
    stock: 20,
    material: 'Bouclé Fabric & Oak',
    dimensions: { width: 85, height: 80, depth: 82 },
    featured: false,
  },
  {
    name: 'Serene Wardrobe',
    slug: 'serene-wardrobe',
    categoryName: 'Bedroom',
    price: 1985,
    rating: 4.7,
    badges: ['Storage Pro'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'],
    description: 'Generous storage, mirrored detail, and a polished modern silhouette.',
    stock: 6,
    material: 'Oak Veneer & Glass',
    dimensions: { width: 180, height: 220, depth: 60 },
    featured: false,
  },
  {
    name: 'Form Oak Coffee Table',
    slug: 'form-oak-coffee-table',
    categoryName: 'Living Room',
    price: 540,
    rating: 4.6,
    badges: ['Handcrafted'],
    images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80'],
    description: 'Solid oak craftsmanship with a generous surface and architectural legs.',
    stock: 14,
    material: 'Solid White Oak',
    dimensions: { width: 110, height: 40, depth: 110 },
    featured: false,
  },
  {
    name: 'Noir Dining Chair',
    slug: 'noir-dining-chair',
    categoryName: 'Dining',
    price: 210,
    rating: 4.8,
    badges: ['Popular'],
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'],
    description: 'Comfortable seating with a sleek profile that styles easily in sets.',
    stock: 35,
    material: 'Ash Wood & Leather',
    dimensions: { width: 50, height: 80, depth: 55 },
    featured: false,
  },
];

const normalizeSeedImages = async (images = []) => {
  const fallback = await getFallbackProductImage();
  const normalized = [];

  for (const image of images.filter(Boolean)) {
    try {
      normalized.push(await uploadImageValue(image, { fallback }));
    } catch (_error) {
      normalized.push(fallback);
    }
  }

  return normalized.filter(Boolean);
};

const repairStoredProductMedia = async (product) => {
  const fallback = await getFallbackProductImage();
  const sourceImages = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const normalizedImages = [];

  for (const image of sourceImages) {
    try {
      normalizedImages.push(await uploadImageValue(image, { fallback }));
    } catch (_error) {
      normalizedImages.push(fallback);
    }
  }

  const thumbnailSource = product.thumbnailImage || normalizedImages[0] || sourceImages[0] || fallback;
  let thumbnailImage = fallback;

  try {
    thumbnailImage = await uploadImageValue(thumbnailSource, { fallback: normalizedImages[0] || fallback });
  } catch (_error) {
    thumbnailImage = normalizedImages[0] || fallback;
  }

  return {
    images: normalizedImages.length ? normalizedImages : [thumbnailImage || fallback].filter(Boolean),
    thumbnailImage: thumbnailImage || normalizedImages[0] || fallback,
  };
};

const seedData = async () => {
  try {
    const brandCount = await Brand.countDocuments();
    if (brandCount === 0) {
      console.log('Seeding mock brands...');
      for (const brand of mockBrands) {
        const created = await Brand.create(brand);
        console.log(`Seeded brand: ${created.name}`);
      }
    }

    const categoryCount = await Category.countDocuments();
    let categoriesMap = {};

    if (categoryCount === 0) {
      console.log('Seeding mock categories...');
      for (const cat of mockCategories) {
        const created = await Category.create(cat);
        categoriesMap[created.name] = created._id;
        console.log(`Seeded category: ${created.name}`);
      }
    } else {
      const allCats = await Category.find();
      allCats.forEach(cat => {
        categoriesMap[cat.name] = cat._id;
      });
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding mock products...');
      for (const prod of mockProducts) {
        const categoryId = categoriesMap[prod.categoryName];
        if (!categoryId) {
          console.warn(`Category not found for product: ${prod.name}`);
          continue;
        }

        const normalizedImages = await normalizeSeedImages(prod.images);

        const created = await Product.create({
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          price: prod.price,
          images: normalizedImages,
          thumbnailImage: normalizedImages[0] || (await getFallbackProductImage()),
          category: categoryId,
          stock: prod.stock,
          rating: prod.rating,
          featured: prod.featured,
          badges: prod.badges,
          dimensions: prod.dimensions,
          material: prod.material,
        });
        console.log(`Seeded product: ${created.name}`);
      }
    } else {
      const existingProducts = await Product.find({});
      console.log('Normalizing existing product images...');
      for (const product of existingProducts) {
        const nextMedia = await repairStoredProductMedia(product);
        const currentImages = Array.isArray(product.images) ? product.images : [];
        const imagesChanged =
          nextMedia.thumbnailImage !== (product.thumbnailImage || '') ||
          nextMedia.images.length !== currentImages.length ||
          nextMedia.images.some((image, index) => image !== currentImages[index]);

        if (!imagesChanged) {
          continue;
        }

        await Product.findByIdAndUpdate(product._id, nextMedia, { new: true });
        console.log(`Normalized product media: ${product.name}`);
      }
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

export default seedData;
