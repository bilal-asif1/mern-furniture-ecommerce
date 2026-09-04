const normalize = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const findMatchingCategory = (categories = [], categoryParam = '') => {
  const normalizedParam = normalize(categoryParam);
  if (!normalizedParam || normalizedParam === 'all') {
    return null;
  }

  return categories.find((category) => {
    const candidateSlug = normalize(category?.slug);
    const candidateName = normalize(category?.name);
    return candidateSlug === normalizedParam || candidateName === normalizedParam;
  }) || null;
};

export const productMatchesShopCategory = (product, categoryParam = '') => {
  const normalizedParam = normalize(categoryParam);
  if (!normalizedParam || normalizedParam === 'all') return true;

  const productCategorySlug = normalize(product?.categorySlug || product?.category?.slug || '');
  const productCategoryName = normalize(product?.categoryName || product?.category?.name || '');

  return productCategorySlug === normalizedParam || productCategoryName === normalizedParam;
};
