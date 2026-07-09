import { apiClient, withAuth } from './apiClient';

export const authApi = {
  login: (body) => apiClient.post('/auth/login', body).then((response) => response.data),
  register: (body) => apiClient.post('/auth/register', body).then((response) => response.data),
  me: (token) => apiClient.get('/auth/me', withAuth(token)).then((response) => response.data),
  updateProfile: (token, body) => apiClient.put('/auth/profile', body, withAuth(token)).then((response) => response.data),
};

export const adminApi = {
  summary: (token) => apiClient.get('/admin/summary', withAuth(token)).then((response) => response.data),
  revenue: (token) => apiClient.get('/admin/analytics/revenue', withAuth(token)).then((response) => response.data),
  inventory: (token) => apiClient.get('/admin/inventory', withAuth(token)).then((response) => response.data),
  brands: (token) => apiClient.get('/brands', withAuth(token)).then((response) => response.data),
  createBrand: (token, body) => apiClient.post('/brands', body, withAuth(token)).then((response) => response.data),
  updateBrand: (token, id, body) => apiClient.put(`/brands/${id}`, body, withAuth(token)).then((response) => response.data),
  deleteBrand: (token, id) => apiClient.delete(`/brands/${id}`, withAuth(token)).then((response) => response.data),
  products: (token, params) => apiClient.get('/admin/products', { ...withAuth(token), params }).then((response) => response.data),
  createProduct: (token, body) => apiClient.post('/products', body, withAuth(token)).then((response) => response.data),
  updateProduct: (token, id, body) => apiClient.put(`/products/${id}`, body, withAuth(token)).then((response) => response.data),
  deleteProduct: (token, id) => apiClient.delete(`/products/${id}`, withAuth(token)).then((response) => response.data),
  restoreProduct: (token, id) => apiClient.patch(`/products/${id}/restore`, {}, withAuth(token)).then((response) => response.data),
  toggleProductStatus: (token, id) => apiClient.patch(`/products/${id}/status`, {}, withAuth(token)).then((response) => response.data),
  users: (token, role) =>
    apiClient
      .get('/admin/users', {
        ...withAuth(token),
        params: role ? { role } : undefined,
      })
      .then((response) => response.data),
  updateUser: (token, id, body) => apiClient.put(`/admin/users/${id}`, body, withAuth(token)).then((response) => response.data),
  deleteUser: (token, id) => apiClient.delete(`/admin/users/${id}`, withAuth(token)).then((response) => response.data),
};

export const productApi = {
  list: (token, params = '') => apiClient.get(`/products${params}`, withAuth(token)).then((response) => response.data),
  details: (slug) => apiClient.get(`/products/slug/${slug}`).then((response) => response.data),
  create: (token, body) => apiClient.post('/products', body, withAuth(token)).then((response) => response.data),
  update: (token, id, body) => apiClient.put(`/products/${id}`, body, withAuth(token)).then((response) => response.data),
  remove: (token, id) => apiClient.delete(`/products/${id}`, withAuth(token)).then((response) => response.data),
};

export const categoryApi = {
  list: (token) => apiClient.get('/categories', withAuth(token)).then((response) => response.data),
  create: (token, body) => apiClient.post('/categories', body, withAuth(token)).then((response) => response.data),
  update: (token, id, body) => apiClient.put(`/categories/${id}`, body, withAuth(token)).then((response) => response.data),
  remove: (token, id) => apiClient.delete(`/categories/${id}`, withAuth(token)).then((response) => response.data),
};

export const cartApi = {
  get: (token) => apiClient.get('/cart', withAuth(token)).then((response) => response.data),
  sync: (token, items) => apiClient.put('/cart', { items }, withAuth(token)).then((response) => response.data),
};

export const wishlistApi = {
  get: (token) => apiClient.get('/wishlist', withAuth(token)).then((response) => response.data),
  toggle: (token, productId) => apiClient.post('/wishlist/toggle', { productId }, withAuth(token)).then((response) => response.data),
  clear: (token) => apiClient.delete('/wishlist/clear', withAuth(token)).then((response) => response.data),
};

export const orderApi = {
  list: (token) => apiClient.get('/orders', withAuth(token)).then((response) => response.data),
  mine: (token) => apiClient.get('/orders/mine', withAuth(token)).then((response) => response.data),
  get: (token, id) => apiClient.get(`/orders/${id}`, withAuth(token)).then((response) => response.data),
  create: (token, body) => apiClient.post('/orders', body, withAuth(token)).then((response) => response.data),
  update: (token, id, body) => apiClient.put(`/orders/${id}`, body, withAuth(token)).then((response) => response.data),
};
