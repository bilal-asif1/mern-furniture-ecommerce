import { premiumCategories } from '../data/siteContent';

const normalize = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const toSlug = (value = '') => normalize(value).replace(/\s+/g, '-');

export const resolveShopCategoryQuery = (categoryParam = '') => {
  const normalizedParam = normalize(categoryParam);
  if (!normalizedParam || normalizedParam === 'all') {
    return { query: '', label: '', slug: '', category: null };
  }

  const matchedCategory = premiumCategories.find((category) => {
    const valuesToMatch = [category.slug, category.name, category.backendCategory, category.keyword];
    return valuesToMatch.some((value) => normalize(value) === normalizedParam || toSlug(value) === toSlug(categoryParam));
  });

  if (matchedCategory) {
    return {
      query: matchedCategory.backendCategory,
      label: matchedCategory.name,
      slug: matchedCategory.slug,
      category: matchedCategory,
    };
  }

  return {
    query: categoryParam,
    label: categoryParam,
    slug: toSlug(categoryParam),
    category: null,
  };
};

export const productMatchesShopCategory = (product, categoryParam = '') => {
  const resolved = resolveShopCategoryQuery(categoryParam);
  if (!resolved.query) return true;

  const productCategoryName = normalize(product?.categoryName || product?.category?.name);
  const productCategorySlug = toSlug(product?.categorySlug || product?.category?.slug || '');
  const resolvedCategoryName = normalize(resolved.query);
  const resolvedCategorySlug = toSlug(resolved.query);

  return productCategoryName === resolvedCategoryName || productCategorySlug === resolvedCategorySlug;
};
