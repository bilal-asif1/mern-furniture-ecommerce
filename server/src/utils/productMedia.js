import configureCloudinary from '../config/cloudinary.js';

const cloudinary = configureCloudinary();
const CLOUDINARY_FOLDER = 'junaid-furniture/products';

const isDataUrl = (value) => typeof value === 'string' && value.startsWith('data:image/');
const isHttpUrl = (value) => typeof value === 'string' && /^https?:\/\//i.test(value);
const isCloudinaryUrl = (value) =>
  typeof value === 'string' && /res\.cloudinary\.com\/.+\/image\/upload\//i.test(value);
const isLocalUploadPath = (value) => typeof value === 'string' && value.startsWith('/uploads/');

const toBoolean = (value, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  return fallback;
};

const toNumber = (value, fallback = 0) => {
  if (value === '' || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const extractCloudinaryPublicId = (value) => {
  if (typeof value !== 'string' || !value.includes('/upload/')) return '';

  const uploadPart = value.split('/upload/')[1] || '';
  const withoutVersion = uploadPart.replace(/^v\d+\//, '');
  return withoutVersion.replace(/\.[^.]+$/, '');
};

let fallbackProductImagePromise;

const getFallbackProductImage = async () => {
  if (fallbackProductImagePromise) return fallbackProductImagePromise;
  if (!cloudinary) return '';

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">',
    '<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#f2e6d7"/><stop offset="100%" stop-color="#d9c3ab"/></linearGradient></defs>',
    '<rect width="1200" height="800" fill="url(#g)"/>',
    '<rect x="170" y="165" width="860" height="470" rx="42" fill="#fff6ee" fill-opacity="0.82"/>',
    '<path d="M350 520h500c32 0 58-26 58-58V380c0-32-26-58-58-58H350c-32 0-58 26-58 58v82c0 32 26 58 58 58Z" fill="#8c6242" fill-opacity="0.18"/>',
    '<circle cx="470" cy="398" r="48" fill="#8c6242" fill-opacity="0.28"/>',
    '<path d="M410 548h380c22 0 40 18 40 40v18H370v-18c0-22 18-40 40-40Z" fill="#8c6242" fill-opacity="0.28"/>',
    '<text x="600" y="690" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" fill="#7a5a42">Junaid Furniture</text>',
    '</svg>',
  ].join('');
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

  fallbackProductImagePromise = cloudinary.uploader
    .upload(dataUrl, {
      folder: CLOUDINARY_FOLDER,
      resource_type: 'image',
      public_id: 'product-placeholder',
      overwrite: false,
    })
    .then((result) => result.secure_url || result.url || '')
    .catch(() => '');

  return fallbackProductImagePromise;
};

const uploadImageValue = async (value, { fallback = '' } = {}) => {
  if (!value) return fallback || (await getFallbackProductImage());

  if (isCloudinaryUrl(value)) {
    return value;
  }

  if (isLocalUploadPath(value)) {
    return fallback || (await getFallbackProductImage());
  }

  if (!cloudinary) {
    throw new Error('Cloudinary is not configured');
  }

  if (!isDataUrl(value) && !isHttpUrl(value)) {
    return fallback || (await getFallbackProductImage());
  }

  const result = await cloudinary.uploader.upload(value, {
    folder: CLOUDINARY_FOLDER,
    resource_type: 'image',
  });

  return result.secure_url || result.url || value;
};

const deleteImageValue = async (value) => {
  if (!cloudinary) return;

  const publicId = extractCloudinaryPublicId(value);
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (_error) {
    // Ignore Cloudinary cleanup failures so product updates still succeed.
  }
};

const parseDimensions = (value = {}) => {
  if (!value || typeof value !== 'object') {
    return { width: 0, height: 0, depth: 0 };
  }

  return {
    width: toNumber(value.width),
    height: toNumber(value.height),
    depth: toNumber(value.depth),
  };
};

const normalizeProductPayload = async ({ body, existingProduct = null }) => {
  const incomingImages = [
    ...toStringArray(body.images),
    ...toStringArray(body.imageUrls),
  ];
  const firstIncomingImage = incomingImages[0] || '';
  const hasIncomingImages = Object.prototype.hasOwnProperty.call(body, 'images') || Object.prototype.hasOwnProperty.call(body, 'imageUrls');
  const fallbackImage =
    (existingProduct?.thumbnailImage && !isLocalUploadPath(existingProduct.thumbnailImage) ? existingProduct.thumbnailImage : '') ||
    (Array.isArray(existingProduct?.images) ? existingProduct.images.find((image) => image && !isLocalUploadPath(image)) : '') ||
    (await getFallbackProductImage());

  const uploadedImages = [];
  for (const image of incomingImages) {
    uploadedImages.push(await uploadImageValue(image, { fallback: fallbackImage }));
  }

  const thumbnailSource = body.thumbnailImage || body.thumbnail || firstIncomingImage || fallbackImage || '';
  const thumbnailImage = thumbnailSource === firstIncomingImage && uploadedImages[0]
    ? uploadedImages[0]
    : await uploadImageValue(thumbnailSource, { fallback: uploadedImages[0] || fallbackImage });

  const removedImages = toStringArray(body.removedImages);
  if (existingProduct && removedImages.length) {
    await Promise.all(removedImages.map((image) => deleteImageValue(image)));
  }

  const price = toNumber(body.price, existingProduct?.price || 0);
  const discountPrice = toNumber(body.discountPrice, existingProduct?.discountPrice || 0);
  const explicitDiscount = toNumber(body.discountPercentage, existingProduct?.discountPercentage || 0);
  const computedDiscount = price > 0 && discountPrice > 0 && discountPrice < price
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;
  const dimensions = parseDimensions(body.dimensions || existingProduct?.dimensions || {});
  const hasTags = Object.prototype.hasOwnProperty.call(body, 'tags') || Object.prototype.hasOwnProperty.call(body, 'tagList');
  const hasBadges = Object.prototype.hasOwnProperty.call(body, 'badges');

  const tags = hasTags ? toStringArray(body.tags || body.tagList) : existingProduct?.tags || [];
  const badges = hasBadges ? toStringArray(body.badges) : existingProduct?.badges || [];
  const status = body.productStatus || body.status || existingProduct?.productStatus || 'active';

  return {
    name: body.name?.trim() || existingProduct?.name || '',
    description: body.description?.trim() || existingProduct?.description || '',
    shortDescription: body.shortDescription?.trim() || existingProduct?.shortDescription || '',
    price,
    discountPrice,
    discountPercentage: explicitDiscount || computedDiscount,
    images: hasIncomingImages ? uploadedImages : existingProduct?.images || [],
    thumbnailImage,
    category: body.category || existingProduct?.category || existingProduct?.categoryId || '',
    brand: body.brand?.trim() || existingProduct?.brand || 'Junaid Furniture',
    sku: body.sku?.trim() || existingProduct?.sku || '',
    stock: toNumber(body.stock, existingProduct?.stock || 0),
    rating: toNumber(body.rating, existingProduct?.rating || 0),
    reviewCount: toNumber(body.reviewCount, existingProduct?.reviewCount || 0),
    featured: toBoolean(body.featured, existingProduct?.featured || false),
    bestSeller: toBoolean(body.bestSeller, existingProduct?.bestSeller || false),
    newArrival: toBoolean(body.newArrival, existingProduct?.newArrival || false),
    badges,
    productStatus: status === 'inactive' ? 'inactive' : 'active',
    material: body.material?.trim() || existingProduct?.material || '',
    color: body.color?.trim() || existingProduct?.color || '',
    weight: toNumber(body.weight, existingProduct?.weight || 0),
    warranty: body.warranty?.trim() || existingProduct?.warranty || '',
    deliveryTime: body.deliveryTime?.trim() || existingProduct?.deliveryTime || '',
    availability: body.availability?.trim() || existingProduct?.availability || 'In Stock',
    dimensions,
    tags,
  };
};

export {
  normalizeProductPayload,
  uploadImageValue,
  deleteImageValue,
  extractCloudinaryPublicId,
  getFallbackProductImage,
};
