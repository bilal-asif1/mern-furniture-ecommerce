import { createAsyncThunk, createSlice, configureStore } from '@reduxjs/toolkit';
import { apiClient, withAuth, unwrapApiError } from './lib/apiClient';

const storage = {
  read(key, fallback) {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_error) {
      return fallback;
    }
  },
  write(key, value) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
};

const authStorageKey = 'jf-auth';
const cartStorageKey = 'jf-cart';
const wishlistStorageKey = 'jf-wishlist';

const getId = (value) => value?._id || value?.id || value || '';

const normalizeUser = (user = {}) => ({
  id: getId(user),
  _id: getId(user),
  name: user.name || '',
  email: user.email || '',
  role: user.role || 'customer',
  avatar: user.avatar || '',
});

const normalizeCategory = (category = {}) => ({
  id: getId(category),
  _id: getId(category),
  name: category.name || '',
  slug: category.slug || '',
  description: category.description || '',
  image: category.image || '',
});

const normalizeBrand = (brand = {}) => ({
  id: getId(brand),
  _id: getId(brand),
  name: brand.name || '',
  slug: brand.slug || '',
  description: brand.description || '',
  logo: brand.logo || '',
  website: brand.website || '',
  status: brand.status || 'active',
});

const isRenderableImageSource = (value) => {
  if (typeof value !== 'string') return false;

  const source = value.trim();
  if (!source) return false;
  if (source === '/product-placeholder.svg') return true;
  if (source.startsWith('/uploads/') || source.startsWith('data:')) return false;

  try {
    const url = new URL(source);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_error) {
    return false;
  }
};

const pickRenderableImage = (...candidates) => {
  for (const candidate of candidates) {
    if (isRenderableImageSource(candidate)) return candidate;
  }
  return '/product-placeholder.svg';
};

const normalizeProduct = (product = {}) => {
  const category = product.category && typeof product.category === 'object' ? product.category : null;
  const images = Array.isArray(product.images)
    ? product.images
        .map((item) => (typeof item === 'string' ? item : item?.url || item?.src || item?.secure_url || ''))
        .filter((item) => isRenderableImageSource(item))
    : [];
  const image = pickRenderableImage(product.thumbnailImage, product.thumbnail, product.image, images[0]);
  const badges = Array.isArray(product.badges) ? product.badges.filter(Boolean) : [];

  return {
    ...product,
    id: getId(product),
    _id: getId(product),
    name: product.name || '',
    slug: product.slug || '',
    description: product.description || '',
    shortDescription: product.shortDescription || '',
    price: Number(product.price || 0),
    discountPrice: Number(product.discountPrice || 0),
    discountPercentage: Number(product.discountPercentage || 0),
    brand: product.brand || '',
    sku: product.sku || '',
    image,
    thumbnailImage: image,
    images: images.length ? images : [image],
    categoryId: getId(category || product.category || product.categoryId),
    categoryName: category?.name || product.categoryName || product.category || '',
    categorySlug: category?.slug || product.categorySlug || '',
    rating: Number(product.rating || 0),
    reviews: Number(product.reviews || product.reviewCount || Math.max(0, Math.round((Number(product.rating || 0) || 0) * 19))),
    badge: product.badge || badges[0] || (product.featured ? 'Featured' : ''),
    badges,
    featured: Boolean(product.featured),
    bestSeller: Boolean(product.bestSeller),
    newArrival: Boolean(product.newArrival),
    productStatus: product.productStatus || product.status || 'active',
    isDeleted: Boolean(product.isDeleted),
    deletedAt: product.deletedAt || null,
    stock: Number(product.stock ?? 0),
    material: product.material || '',
    color: product.color || '',
    warranty: product.warranty || '',
    weight: Number(product.weight || 0),
    dimensions: product.dimensions || {},
    tags: Array.isArray(product.tags) ? product.tags.filter(Boolean) : [],
    statusLabel: Boolean(product.isDeleted)
      ? 'Deleted'
      : (product.productStatus || product.status || 'active') === 'active'
        ? 'Active'
        : 'Inactive',
  };
};

const normalizeCartItems = (items = []) =>
  items.map((item) => {
    const product = normalizeProduct(item.product || item);
    return {
      ...product,
      quantity: Number(item.qty ?? item.quantity ?? 1),
    };
  });

const normalizeWishlistItems = (items = []) => items.map((item) => normalizeProduct(item.product || item));

const normalizeOrder = (order = {}) => ({
  ...order,
  id: getId(order),
  _id: getId(order),
  orderItems: Array.isArray(order.orderItems)
    ? order.orderItems.map((item) => ({
        ...item,
        product: item.product && typeof item.product === 'object' ? normalizeProduct(item.product) : item.product,
        qty: Number(item.qty ?? item.quantity ?? 1),
      }))
    : [],
});

const authInitial = storage.read(authStorageKey, null);
const cartInitial = storage.read(cartStorageKey, []);
const wishlistInitial = storage.read(wishlistStorageKey, []);

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, thunkAPI) => {
  try {
    const { data } = await apiClient.post('/auth/login', credentials);
    return { user: normalizeUser(data), token: data.token };
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (payload, thunkAPI) => {
  try {
    const { data } = await apiClient.post('/auth/register', payload);
    return { user: normalizeUser(data), token: data.token };
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.get('/auth/me', withAuth(token));
    return normalizeUser(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.put('/auth/profile', payload, withAuth(token));
    return { user: normalizeUser(data), token: data.token };
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const fetchCategories = createAsyncThunk('catalog/fetchCategories', async (_, thunkAPI) => {
  try {
    const { data } = await apiClient.get('/categories');
    return Array.isArray(data) ? data.map(normalizeCategory) : [];
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const fetchBrands = createAsyncThunk('catalog/fetchBrands', async (_, thunkAPI) => {
  try {
    const { data } = await apiClient.get('/brands');
    return Array.isArray(data) ? data.map(normalizeBrand) : [];
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const fetchProducts = createAsyncThunk('catalog/fetchProducts', async (params = {}, thunkAPI) => {
  try {
    const { data } = await apiClient.get('/products', { params });
    return {
      products: Array.isArray(data.products) ? data.products.map(normalizeProduct) : [],
      page: data.page || 1,
      pages: data.pages || 1,
      count: data.count || 0,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const fetchAdminProducts = createAsyncThunk('catalog/fetchAdminProducts', async (params = {}, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.get('/admin/products', {
      params,
      ...withAuth(token),
    });
    return {
      products: Array.isArray(data.products) ? data.products.map(normalizeProduct) : [],
      page: data.page || 1,
      pages: data.pages || 1,
      count: data.count || 0,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const fetchProductBySlug = createAsyncThunk('catalog/fetchProductBySlug', async (slug, thunkAPI) => {
  try {
    const { data } = await apiClient.get(`/products/slug/${slug}`);
    return normalizeProduct(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const createProduct = createAsyncThunk('catalog/createProduct', async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token || storage.read(authStorageKey, null)?.token || null;
    const { data } = await apiClient.post('/products', payload, withAuth(token));
    return normalizeProduct(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const updateProduct = createAsyncThunk('catalog/updateProduct', async (args, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token || storage.read(authStorageKey, null)?.token || null;
    // Handle both { id, payload } and (id, payload) formats
    const id = typeof args === 'object' && args !== null ? args.id : args;
    const payload = typeof args === 'object' && args !== null ? args.payload : undefined;
    
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid product ID for update');
    }
    if (!payload) {
      throw new Error('Missing product payload for update');
    }
    
    const { data } = await apiClient.put(`/products/${id}`, payload, withAuth(token));
    return normalizeProduct(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const deleteProduct = createAsyncThunk('catalog/deleteProduct', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.delete(`/products/${id}`, withAuth(token));
    return normalizeProduct(data.product || { id, _id: id, isDeleted: true });
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const restoreProduct = createAsyncThunk('catalog/restoreProduct', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.patch(`/products/${id}/restore`, {}, withAuth(token));
    return normalizeProduct(data.product || data);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const toggleProductStatus = createAsyncThunk('catalog/toggleProductStatus', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.patch(`/products/${id}/status`, {}, withAuth(token));
    return normalizeProduct(data.product || data);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const createCategory = createAsyncThunk('catalog/createCategory', async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.post('/categories', payload, withAuth(token));
    return normalizeCategory(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const updateCategory = createAsyncThunk('catalog/updateCategory', async ({ id, payload }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.put(`/categories/${id}`, payload, withAuth(token));
    return normalizeCategory(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const deleteCategory = createAsyncThunk('catalog/deleteCategory', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    await apiClient.delete(`/categories/${id}`, withAuth(token));
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const loadCartFromServer = createAsyncThunk('cart/loadCartFromServer', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.get('/cart', withAuth(token));
    return normalizeCartItems(data?.items || []);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const syncCartToServer = createAsyncThunk('cart/syncCartToServer', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const token = state.auth.token;
    const items = state.cart.items.map((item) => ({
      product: item._id || item.id,
      qty: Number(item.quantity || 1),
    }));
    const { data } = await apiClient.put('/cart', { items }, withAuth(token));
    return normalizeCartItems(data?.items || []);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const loadWishlistFromServer = createAsyncThunk('wishlist/loadWishlistFromServer', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.get('/wishlist', withAuth(token));
    return normalizeWishlistItems(data?.products || []);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const syncWishlistToggle = createAsyncThunk('wishlist/syncWishlistToggle', async (productId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.post('/wishlist/toggle', { productId }, withAuth(token));
    return normalizeWishlistItems(data?.products || []);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const clearWishlistServer = createAsyncThunk('wishlist/clearWishlistServer', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    await apiClient.delete('/wishlist/clear', withAuth(token));
    return [];
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMyOrders', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.get('/orders/mine', withAuth(token));
    return Array.isArray(data) ? data.map(normalizeOrder) : [];
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id, thunkAPI) => {
  try {
    const { data } = await apiClient.get(`/orders/track/${id}`);
    return normalizeOrder(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const createOrder = createAsyncThunk('orders/createOrder', async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.post('/orders', payload, token ? withAuth(token) : {});
    return normalizeOrder(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const fetchAdminOrders = createAsyncThunk('orders/fetchAdminOrders', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.get('/orders', withAuth(token));
    return Array.isArray(data) ? data.map(normalizeOrder) : [];
  } catch (error) {
    console.error('API Error (fetchAdminOrders):', error);
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async ({ id, payload }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.put(`/orders/${id}`, payload, withAuth(token));
    return normalizeOrder(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const fetchAdminSummary = createAsyncThunk('admin/fetchSummary', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.get('/admin/summary', withAuth(token));
    return data;
  } catch (error) {
    console.error('API Error (fetchAdminSummary):', error);
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const fetchRevenueAnalytics = createAsyncThunk('admin/fetchRevenue', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.get('/admin/analytics/revenue', withAuth(token));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('API Error (fetchRevenueAnalytics):', error);
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const fetchInventoryOverview = createAsyncThunk('admin/fetchInventory', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.get('/admin/inventory', withAuth(token));
    return {
      totalProducts: data.totalProducts || 0,
      lowStockCount: data.lowStockCount || 0,
      products: Array.isArray(data.products) ? data.products.map(normalizeProduct) : [],
      lowStock: Array.isArray(data.lowStock) ? data.lowStock.map(normalizeProduct) : [],
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (role, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const params = role ? { params: { role } } : undefined;
    const { data } = await apiClient.get('/admin/users', { ...params, ...withAuth(token) });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const saveUser = createAsyncThunk('admin/saveUser', async ({ id, payload }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await apiClient.put(`/admin/users/${id}`, payload, withAuth(token));
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

export const removeUser = createAsyncThunk('admin/removeUser', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    await apiClient.delete(`/admin/users/${id}`, withAuth(token));
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(unwrapApiError(error));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: authInitial?.user || null,
    token: authInitial?.token || null,
    status: authInitial?.token ? 'checking' : 'anonymous',
    loading: false,
    error: '',
    success: '',
  },
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'authenticated';
      state.success = action.payload.success || '';
      state.error = '';
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'anonymous';
      state.error = '';
      state.success = '';
    },
    clearAuthMessage(state) {
      state.error = '';
      state.success = '';
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = '';
      state.success = '';
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Authentication failed';
    };

    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'authenticated';
        state.success = 'Signed in successfully';
      })
      .addCase(loginUser.rejected, rejected)
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'authenticated';
        state.success = 'Account created successfully';
      })
      .addCase(registerUser.rejected, rejected)
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
        state.error = '';
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.status = 'anonymous';
        state.error = action.payload || 'Session expired. Please log in again.';
      })
      .addCase(updateProfile.pending, pending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'authenticated';
        state.success = 'Profile updated successfully';
      })
      .addCase(updateProfile.rejected, rejected);
  },
});

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    products: [],
    adminProducts: [],
    product: null,
    categories: [],
    brands: [],
    page: 1,
    pages: 1,
    count: 0,
    adminPage: 1,
    adminPages: 1,
    adminCount: 0,
    listLoading: false,
    adminListLoading: false,
    detailLoading: false,
    categoriesLoading: false,
    brandsLoading: false,
    mutationLoading: false,
    error: '',
    success: '',
  },
  reducers: {
    clearCatalogMessage(state) {
      state.error = '';
      state.success = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.error = '';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload || 'Unable to load categories';
      })
      .addCase(fetchBrands.pending, (state) => {
        state.brandsLoading = true;
        state.error = '';
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brandsLoading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.brandsLoading = false;
        state.error = action.payload || 'Unable to load brands';
      })
      .addCase(fetchProducts.pending, (state) => {
        state.listLoading = true;
        state.error = '';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.listLoading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.count = action.payload.count;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || 'Unable to load products';
      })
      .addCase(fetchAdminProducts.pending, (state) => {
        state.adminListLoading = true;
        state.error = '';
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.adminListLoading = false;
        state.adminProducts = action.payload.products;
        state.adminPage = action.payload.page;
        state.adminPages = action.payload.pages;
        state.adminCount = action.payload.count;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.adminListLoading = false;
        state.error = action.payload || 'Unable to load admin products';
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.detailLoading = true;
        state.error = '';
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload || 'Unable to load product';
      })
      .addCase(createProduct.pending, (state) => {
        state.mutationLoading = true;
        state.error = '';
        state.success = '';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.success = 'Product created successfully';
        state.products = [action.payload, ...state.products];
        state.adminProducts = [action.payload, ...state.adminProducts];
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload || 'Unable to create product';
      })
      .addCase(updateProduct.pending, (state) => {
        state.mutationLoading = true;
        state.error = '';
        state.success = '';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.success = 'Product updated successfully';
        state.products = state.products.map((item) => (item.id === action.payload.id ? action.payload : item));
        state.adminProducts = state.adminProducts.map((item) => (item.id === action.payload.id ? action.payload : item));
        if (state.product?.id === action.payload.id) state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload || 'Unable to update product';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.mutationLoading = true;
        state.error = '';
        state.success = '';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.success = 'Product moved to trash';
        state.products = state.products.filter((item) => item.id !== action.payload.id);
        state.adminProducts = state.adminProducts.map((item) => (item.id === action.payload.id ? action.payload : item));
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload || 'Unable to delete product';
      })
      .addCase(restoreProduct.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.success = 'Product restored successfully';
        state.adminProducts = state.adminProducts.map((item) => (item.id === action.payload.id ? action.payload : item));
        state.products = state.products.some((item) => item.id === action.payload.id)
          ? state.products.map((item) => (item.id === action.payload.id ? action.payload : item))
          : action.payload.productStatus === 'active' && !action.payload.isDeleted
            ? [action.payload, ...state.products]
            : state.products;
      })
      .addCase(restoreProduct.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload || 'Unable to restore product';
      })
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.success = 'Product status updated';
        state.products = state.products.map((item) => (item.id === action.payload.id ? action.payload : item));
        state.adminProducts = state.adminProducts.map((item) => (item.id === action.payload.id ? action.payload : item));
      })
      .addCase(toggleProductStatus.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload || 'Unable to update product status';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories = [...state.categories, action.payload].sort((a, b) => a.name.localeCompare(b.name));
        state.success = 'Category created successfully';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories = state.categories.map((item) => (item.id === action.payload.id ? action.payload : item));
        state.success = 'Category updated successfully';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((item) => item.id !== action.payload);
        state.success = 'Category deleted successfully';
      });
  },
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: Array.isArray(cartInitial) ? cartInitial : [],
    loading: false,
    error: '',
    success: '',
  },
  reducers: {
    addItem(state, action) {
      const product = normalizeProduct(action.payload.product || action.payload);
      const quantity = Number(action.payload.quantity || action.payload.qty || 1);
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      state.success = 'Added to cart';
    },
    updateQty(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((entry) => entry.id === id);
      if (item) item.quantity = Math.max(1, Number(quantity || 1));
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.success = 'Removed from cart';
    },
    clearCart(state) {
      state.items = [];
      state.success = 'Cart cleared';
    },
    setCartItems(state, action) {
      state.items = action.payload;
    },
    clearCartMessage(state) {
      state.error = '';
      state.success = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCartFromServer.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(loadCartFromServer.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadCartFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to load cart';
      })
      .addCase(syncCartToServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncCartToServer.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(syncCartToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to sync cart';
      });
  },
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: Array.isArray(wishlistInitial) ? wishlistInitial : [],
    loading: false,
    error: '',
    success: '',
  },
  reducers: {
    toggleItem(state, action) {
      const product = normalizeProduct(action.payload.product || action.payload);
      const exists = state.items.some((item) => item.id === product.id);
      state.items = exists ? state.items.filter((item) => item.id !== product.id) : [...state.items, product];
      state.success = exists ? 'Removed from wishlist' : 'Added to wishlist';
      // Persist to localStorage for guest users
      storage.write(wishlistStorageKey, state.items);
    },
    setWishlistItems(state, action) {
      state.items = action.payload;
    },
    clearWishlist(state) {
      state.items = [];
      state.success = 'Wishlist cleared';
      // Clear localStorage for guest users
      storage.remove(wishlistStorageKey);
    },
    clearWishlistMessage(state) {
      state.error = '';
      state.success = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWishlistFromServer.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(loadWishlistFromServer.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadWishlistFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to load wishlist';
      })
      .addCase(syncWishlistToggle.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncWishlistToggle.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(syncWishlistToggle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to sync wishlist';
      })
      .addCase(clearWishlistServer.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      });
  },
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    mine: [],
    admin: [],
    selected: null,
    loading: false,
    adminLoading: false,
    detailLoading: false,
    saving: false,
    error: '',
    success: '',
  },
  reducers: {
    clearOrdersMessage(state) {
      state.error = '';
      state.success = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.mine = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to load your orders';
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selected = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload || 'Unable to load order';
      })
      .addCase(createOrder.pending, (state) => {
        state.saving = true;
        state.error = '';
        state.success = '';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.saving = false;
        state.mine = [action.payload, ...state.mine];
        state.selected = action.payload;
        state.success = 'Order placed successfully';
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || 'Unable to place order';
      })
      .addCase(fetchAdminOrders.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.admin = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload || 'Unable to load orders';
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.admin = state.admin.map((item) => (item.id === action.payload.id ? action.payload : item));
        state.mine = state.mine.map((item) => (item.id === action.payload.id ? action.payload : item));
        state.success = 'Order status updated';
      });
  },
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    summary: null,
    revenue: [],
    inventory: { totalProducts: 0, lowStockCount: 0, products: [], lowStock: [] },
    users: [],
    loading: false,
    usersLoading: false,
    error: '',
    success: '',
  },
  reducers: {
    clearAdminMessage(state) {
      state.error = '';
      state.success = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSummary.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchAdminSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchAdminSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to load summary';
      })
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.revenue = action.payload;
      })
      .addCase(fetchInventoryOverview.fulfilled, (state, action) => {
        state.inventory = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = '';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload || 'Unable to load users';
      })
      .addCase(saveUser.fulfilled, (state, action) => {
        state.users = state.users.map((item) => (item._id === action.payload._id ? action.payload : item));
        state.success = 'User updated successfully';
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter((item) => item._id !== action.payload);
        state.success = 'User removed successfully';
      });
  },
});

export const { setCredentials, logout, clearAuthMessage } = authSlice.actions;
export const { clearCatalogMessage } = catalogSlice.actions;
export const { addItem, updateQty, removeItem, clearCart, setCartItems, clearCartMessage } = cartSlice.actions;
export const { toggleItem, setWishlistItems, clearWishlist, clearWishlistMessage } = wishlistSlice.actions;
export const { clearOrdersMessage } = ordersSlice.actions;
export const { clearAdminMessage } = adminSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    catalog: catalogSlice.reducer,
    cart: cartSlice.reducer,
    wishlist: wishlistSlice.reducer,
    orders: ordersSlice.reducer,
    admin: adminSlice.reducer,
  },
});

if (typeof window !== 'undefined') {
  store.subscribe(() => {
    const state = store.getState();
    storage.write(authStorageKey, state.auth.token ? { user: state.auth.user, token: state.auth.token } : null);
    storage.write(cartStorageKey, state.cart.items);
    storage.write(wishlistStorageKey, state.wishlist.items);
  });
}

export {
  normalizeUser,
  normalizeCategory,
  normalizeBrand,
  normalizeProduct,
  normalizeCartItems,
  normalizeWishlistItems,
  normalizeOrder,
};
