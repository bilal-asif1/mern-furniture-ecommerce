import { useEffect, useMemo, useCallback, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  store,
  addItem,
  updateQty,
  removeItem,
  clearCart as clearCartAction,
  toggleItem,
  clearWishlist as clearWishlistAction,
  loginUser,
  registerUser,
  fetchMe,
  updateProfile,
  logout as logoutAction,
  setCredentials,
  fetchCategories,
  fetchProducts,
  fetchAdminProducts,
  fetchProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  toggleProductStatus,
  createCategory,
  updateCategory,
  deleteCategory,
  loadCartFromServer,
  syncCartToServer,
  loadWishlistFromServer,
  syncWishlistToggle,
  clearWishlistServer,
  createOrder,
  fetchMyOrders,
  fetchOrderById,
  fetchAdminSummary,
  fetchRevenueAnalytics,
  fetchInventoryOverview,
  fetchUsers,
  saveUser,
  removeUser,
  fetchAdminOrders,
  updateOrderStatus,
  setCartItems,
  setWishlistItems,
  clearCartMessage,
  clearWishlistMessage,
  clearAuthMessage,
  clearCatalogMessage,
  clearOrdersMessage,
  clearAdminMessage,
  fetchBrands,
} from '../store';

function AppBootstrap() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    dispatch(fetchProducts({ limit: 12 }));
  }, [dispatch]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        const me = await dispatch(fetchMe()).unwrap();

        if (cancelled) return;

        dispatch(loadCartFromServer());
        dispatch(loadWishlistFromServer());

        if (me?.role === 'admin') {
          dispatch(fetchMyOrders());
        }
      } catch (_error) {
        if (!cancelled) {
          dispatch(logoutAction());
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, token]);

  // Load wishlist from localStorage for guest users
  useEffect(() => {
    if (token) return;

    const guestWishlist = JSON.parse(localStorage.getItem('jf-wishlist') || '[]');
    if (guestWishlist.length > 0) {
      dispatch(setWishlistItems(guestWishlist));
    }
  }, [dispatch, token]);

  return null;
}

export function AppProvider({ children }) {
  return (
    <Provider store={store}>
      <AppBootstrap />
      {children}
    </Provider>
  );
}

export function useApp() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const catalog = useSelector((state) => state.catalog);
  const cartState = useSelector((state) => state.cart);
  const wishlistState = useSelector((state) => state.wishlist);
  const ordersState = useSelector((state) => state.orders);
  const adminState = useSelector((state) => state.admin);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 2500);
  }, []);

  const fetchCategoriesCb = useCallback(() => dispatch(fetchCategories()), [dispatch]);
  const fetchBrandsCb = useCallback(() => dispatch(fetchBrands()), [dispatch]);
  const fetchProductsCb = useCallback((params) => dispatch(fetchProducts(params)), [dispatch]);
  const fetchAdminProductsCb = useCallback((params) => dispatch(fetchAdminProducts(params)), [dispatch]);
  const fetchProductBySlugCb = useCallback((slug) => dispatch(fetchProductBySlug(slug)), [dispatch]);
  const createProductCb = useCallback((payload) => dispatch(createProduct(payload)), [dispatch]);
  const updateProductCb = useCallback((idOrArgs, payload) => {
    if (typeof idOrArgs === 'object' && idOrArgs !== null) {
      return dispatch(updateProduct({ id: idOrArgs.id, payload: idOrArgs.payload ?? payload }));
    }

    return dispatch(updateProduct({ id: idOrArgs, payload }));
  }, [dispatch]);
  const deleteProductCb = useCallback((id) => dispatch(deleteProduct(id)), [dispatch]);
  const restoreProductCb = useCallback((id) => dispatch(restoreProduct(id)), [dispatch]);
  const toggleProductStatusCb = useCallback((id) => dispatch(toggleProductStatus(id)), [dispatch]);

  return useMemo(() => {
    const token = authState.token;
    const auth = {
      user: authState.user,
      token,
      status: authState.status,
    };

    const handleCartSync = () => {
      if (token) {
        dispatch(syncCartToServer());
      }
    };

    const handleWishlistSync = (productId) => {
      if (token && productId) {
        dispatch(syncWishlistToggle(productId));
      }
    };


    return {
      auth,
      token,
      user: authState.user,
      authLoading: authState.loading,
      authError: authState.error,
      authSuccess: authState.success,
      products: catalog.products,
      adminProducts: catalog.adminProducts,
      product: catalog.product,
      categories: catalog.categories,
      brands: catalog.brands,
      catalogPage: catalog.page,
      catalogPages: catalog.pages,
      catalogCount: catalog.count,
      adminCatalogPage: catalog.adminPage,
      adminCatalogPages: catalog.adminPages,
      adminCatalogCount: catalog.adminCount,
      catalogLoading: catalog.listLoading || catalog.detailLoading || catalog.categoriesLoading,
      catalogListLoading: catalog.listLoading,
      adminCatalogLoading: catalog.adminListLoading,
      catalogDetailLoading: catalog.detailLoading,
      categoriesLoading: catalog.categoriesLoading,
      brandsLoading: catalog.brandsLoading,
      catalogError: catalog.error,
      catalogSuccess: catalog.success,
      cart: cartState.items,
      cartLoading: cartState.loading,
      cartError: cartState.error,
      cartSuccess: cartState.success,
      wishlist: wishlistState.items,
      wishlistLoading: wishlistState.loading,
      wishlistError: wishlistState.error,
      wishlistSuccess: wishlistState.success,
      orders: ordersState.mine,
      order: ordersState.selected,
      adminOrders: ordersState.admin,
      ordersLoading: ordersState.loading,
      adminOrdersLoading: ordersState.adminLoading,
      orderLoading: ordersState.detailLoading,
      orderSaving: ordersState.saving,
      orderError: ordersState.error,
      orderSuccess: ordersState.success,
      adminSummary: adminState.summary,
      adminRevenue: adminState.revenue,
      adminInventory: adminState.inventory,
      adminUsers: adminState.users,
      adminLoading: adminState.loading,
      adminUsersLoading: adminState.usersLoading,
      adminError: adminState.error,
      adminSuccess: adminState.success,
      cartCount: cartState.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      cartSubtotal: cartState.items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
      isWishlisted: (productId) => wishlistState.items.some((item) => item.id === productId || item._id === productId),
      isInCart: (productId) => cartState.items.some((item) => item.id === productId || item._id === productId),
      login: (payload) => dispatch(setCredentials(payload)),
      loginUser: (payload) => dispatch(loginUser(payload)),
      registerUser: (payload) => dispatch(registerUser(payload)),
      updateProfile: (payload) => dispatch(updateProfile(payload)),
      logout: () => dispatch(logoutAction()),
      clearAuthMessage: () => dispatch(clearAuthMessage()),
      fetchCategories: fetchCategoriesCb,
      fetchBrands: fetchBrandsCb,
      fetchProducts: fetchProductsCb,
      fetchAdminProducts: fetchAdminProductsCb,
      fetchProductBySlug: fetchProductBySlugCb,
      createProduct: createProductCb,
      updateProduct: updateProductCb,
      deleteProduct: deleteProductCb,
      restoreProduct: restoreProductCb,
      toggleProductStatus: toggleProductStatusCb,
      createCategory: (payload) => dispatch(createCategory(payload)),
      updateCategory: (id, payload) => dispatch(updateCategory({ id, payload })),
      deleteCategory: (id) => dispatch(deleteCategory(id)),
      addToCart: (product, quantity = 1) => {
        dispatch(addItem({ product, quantity }));
        handleCartSync();
      },
      updateCartQty: ({ id, quantity }) => {
        dispatch(updateQty({ id, quantity }));
        handleCartSync();
      },
      removeFromCart: (id) => {
        dispatch(removeItem(id));
        handleCartSync();
      },
      clearCart: () => {
        dispatch(clearCartAction());
        handleCartSync();
      },
      setCartItems: (items) => dispatch(setCartItems(items)),
      toggleWishlist: (product) => {
        dispatch(toggleItem(product));
        // Only sync with backend if user is logged in
        if (token) {
          handleWishlistSync(product.id || product._id);
        }
      },
      setWishlistItems: (items) => dispatch(setWishlistItems(items)),
      clearWishlist: () => {
        dispatch(clearWishlistAction());
        if (token) dispatch(clearWishlistServer());
      },
      fetchMyOrders: () => dispatch(fetchMyOrders()),
      fetchOrderById: (id) => dispatch(fetchOrderById(id)),
      createOrder: (payload) => dispatch(createOrder(payload)),
      fetchAdminSummary: () => dispatch(fetchAdminSummary()),
      fetchRevenueAnalytics: () => dispatch(fetchRevenueAnalytics()),
      fetchInventoryOverview: () => dispatch(fetchInventoryOverview()),
      fetchUsers: (role) => dispatch(fetchUsers(role)),
      saveUser: (id, payload) => dispatch(saveUser({ id, payload })),
      removeUser: (id) => dispatch(removeUser(id)),
      fetchAdminOrders: () => dispatch(fetchAdminOrders()),
      updateOrderStatus: (id, payload) => dispatch(updateOrderStatus({ id, payload })),
      clearCartMessage: () => dispatch(clearCartMessage()),
      clearWishlistMessage: () => dispatch(clearWishlistMessage()),
      clearCatalogMessage: () => dispatch(clearCatalogMessage()),
      clearOrdersMessage: () => dispatch(clearOrdersMessage()),
      clearAdminMessage: () => dispatch(clearAdminMessage()),
    };
  }, [
    authState.user,
    authState.token,
    authState.status,
    authState.loading,
    authState.error,
    authState.success,
    catalog.products,
    catalog.adminProducts,
    catalog.product,
    catalog.categories,
    catalog.brands,
    catalog.page,
    catalog.pages,
    catalog.count,
    catalog.adminPage,
    catalog.adminPages,
    catalog.adminCount,
    catalog.listLoading,
    catalog.adminListLoading,
    catalog.detailLoading,
    catalog.categoriesLoading,
    catalog.brandsLoading,
    catalog.error,
    catalog.success,
    cartState.items,
    cartState.loading,
    cartState.error,
    cartState.success,
    wishlistState.items,
    wishlistState.loading,
    wishlistState.error,
    wishlistState.success,
    ordersState.mine,
    ordersState.selected,
    ordersState.admin,
    ordersState.loading,
    ordersState.adminLoading,
    ordersState.detailLoading,
    ordersState.saving,
    ordersState.error,
    ordersState.success,
    adminState.summary,
    adminState.revenue,
    adminState.inventory,
    adminState.users,
    adminState.loading,
    adminState.usersLoading,
    adminState.error,
    adminState.success,
    dispatch,
  ]);
}
