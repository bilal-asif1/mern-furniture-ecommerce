export const formatCurrency = (amount) => 
  `Rs. ${Number(amount || 0).toLocaleString('en-US')}`;
