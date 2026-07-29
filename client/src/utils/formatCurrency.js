export const formatCurrency = (amount) => 
  `PKR ${Number(amount || 0).toLocaleString('en-US')}`;

export const calculateDiscountPercentage = (originalPrice, discountPrice) => {
  if (!originalPrice || !discountPrice || originalPrice <= discountPrice) return '';
  return String(Math.round(((originalPrice - discountPrice) / originalPrice) * 100));
};

export const calculateDiscountPrice = (originalPrice, discountPercentage) => {
  if (!originalPrice || !discountPercentage) return 0;
  return Math.round(originalPrice - (originalPrice * discountPercentage / 100));
};
