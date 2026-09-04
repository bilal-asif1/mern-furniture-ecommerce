import { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  store,
  addItem,
  updateQty,
  removeItem,
  clearCart as clearCartAction,
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
  permanentlyDeleteProduct,
  restoreProduct,
  toggleProductStatus,
  createCategory,
  updateCategory,
  deleteCategory,
  loadCartFromServer,
  syncCartToServer,
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
  clearCartMessage,
  clearAuthMessage,
  clearCatalogMessage,
  clearOrdersMessage,
  clearAdminMessage,
  fetchBrands,
} from '../store';
import { getEffectivePrice } from '../utils/formatCurrency';
import LoadingScreen from '../components/LoadingScreen';

function AppBootstrap({ onInitialCatalogReady }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const catalogLoading = useSelector((state) => state.catalog.listLoading || state.catalog.categoriesLoading || state.catalog.brandsLoading);
  const initialBootStartedRef = useRef(false);
  const initialBootSeenLoadingRef = useRef(false);
  const initialBootCompleteRef = useRef(false);

  useEffect(() => {
    if (initialBootStartedRef.current) return undefined;
    initialBootStartedRef.current = true;

    let cancelled = false;

    (async () => {
      await Promise.allSettled([
        dispatch(fetchCategories()),
        dispatch(fetchBrands()),
        dispatch(fetchProducts({ all: true })),
      ]);

      if (!cancelled) {
        onInitialCatalogReady?.();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, onInitialCatalogReady]);

  useEffect(() => {
    if (initialBootCompleteRef.current) return;

    if (catalogLoading) {
      initialBootSeenLoadingRef.current = true;
      return;
    }

    if (initialBootSeenLoadingRef.current) {
      initialBootCompleteRef.current = true;
      onInitialCatalogReady?.();
    }
  }, [catalogLoading, onInitialCatalogReady]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        const me = await dispatch(fetchMe()).unwrap();

        if (cancelled) return;

        dispatch(loadCartFromServer());

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

  return null;
}

export function AppProvider({ children }) {
  const [bootVisible, setBootVisible] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootMessage, setBootMessage] = useState('Waking up our servers...');
  const bootStartRef = useRef(Date.now());
  const bootProgressRef = useRef(0);
  const bootMessageRef = useRef('Waking up our servers...');
  const bootSeenLoadingRef = useRef(false);
  const bootCompletedRef = useRef(false);
  const bootHideTimerRef = useRef(null);
  const bootExpectedMs = 35000;
  const bootPatienceMs = 40000;
  const bootMinVisibleMs = 900;

  const completeInitialBoot = useCallback(() => {
    if (!bootVisible || bootCompletedRef.current) return;
    bootCompletedRef.current = true;

    const elapsed = Date.now() - bootStartRef.current;
    const remainingVisible = Math.max(250, bootMinVisibleMs - elapsed);

    bootProgressRef.current = 100;
    bootMessageRef.current = 'Ready.';
    setBootProgress(100);
    setBootMessage('Ready.');

    if (bootHideTimerRef.current) {
      window.clearTimeout(bootHideTimerRef.current);
    }

    bootHideTimerRef.current = window.setTimeout(() => {
      setBootVisible(false);
      setContentVisible(true);
    }, remainingVisible);
  }, [bootMinVisibleMs, bootVisible]);

  useEffect(() => {
    if (!bootVisible) return undefined;

    const tick = () => {
      const elapsed = Date.now() - bootStartRef.current;
      const nextMessage = elapsed >= bootPatienceMs
        ? 'Still loading, thanks for your patience...'
        : 'Getting things ready for you...';

      if (bootMessageRef.current !== nextMessage) {
        bootMessageRef.current = nextMessage;
        setBootMessage(nextMessage);
      }

      if (bootProgressRef.current < 100) {
        const estimated = Math.min(98, Math.max(8, 8 + ((elapsed / bootExpectedMs) * 87)));
        const nextProgress = Math.min(98, Math.max(bootProgressRef.current, estimated));
        if (nextProgress !== bootProgressRef.current) {
          bootProgressRef.current = nextProgress;
          setBootProgress(nextProgress);
        }
      }
    };

    tick();
    const timer = window.setInterval(tick, 120);
    return () => window.clearInterval(timer);
  }, [bootVisible, bootExpectedMs, bootPatienceMs]);

  useEffect(() => () => {
    if (bootHideTimerRef.current) {
      window.clearTimeout(bootHideTimerRef.current);
    }
  }, []);

  return (
    <Provider store={store}>
      <AppBootstrap onInitialCatalogReady={completeInitialBoot} />
      {contentVisible ? children : null}
      <LoadingScreen visible={bootVisible} progress={bootProgress} message={bootMessage} />
    </Provider>
  );
}

export function useApp() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const catalog = useSelector((state) => state.catalog);
  const cartState = useSelector((state) => state.cart);
  const ordersState = useSelector((state) => state.orders);
  const adminState = useSelector((state) => state.admin);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast({ message, type });
    toastTimerRef.current = window.setTimeout(() => {
      setToast({ message: '', type: 'success' });
      toastTimerRef.current = null;
    }, 2500);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
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
  const permanentlyDeleteProductCb = useCallback((id) => dispatch(permanentlyDeleteProduct(id)), [dispatch]);
  const restoreProductCb = useCallback((id) => dispatch(restoreProduct(id)), [dispatch]);
  const toggleProductStatusCb = useCallback((id) => dispatch(toggleProductStatus(id)), [dispatch]);
  const fetchAdminSummaryCb = useCallback(() => dispatch(fetchAdminSummary()), [dispatch]);
  const fetchRevenueAnalyticsCb = useCallback(() => dispatch(fetchRevenueAnalytics()), [dispatch]);
  const fetchAdminOrdersCb = useCallback(() => dispatch(fetchAdminOrders()), [dispatch]);

  const cartCount = useMemo(() => 
    cartState.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0), 
    [cartState.items]
  );

  const cartSubtotal = useMemo(() => 
    cartState.items.reduce((sum, item) => sum + getEffectivePrice(item) * Number(item.quantity || 0), 0), 
    [cartState.items]
  );

  const isInCart = useCallback((productId) => 
    cartState.items.some((item) => item.id === productId || item._id === productId), 
    [cartState.items]
  );

  const handleCartSync = useCallback(() => {
    if (authState.token) {
      dispatch(syncCartToServer());
    }
  }, [authState.token, dispatch]);

  const addToCart = useCallback((product, quantity = 1) => {
    dispatch(addItem({ product, quantity }));
    handleCartSync();
  }, [dispatch, handleCartSync]);

  const updateCartQty = useCallback(({ id, quantity }) => {
    dispatch(updateQty({ id, quantity }));
    handleCartSync();
  }, [dispatch, handleCartSync]);

  const removeFromCart = useCallback((id) => {
    dispatch(removeItem(id));
    handleCartSync();
  }, [dispatch, handleCartSync]);

  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
    handleCartSync();
  }, [dispatch, handleCartSync]);

  return useMemo(() => {
    const auth = {
      user: authState.user,
      token: authState.token,
      status: authState.status,
    };

    return {
      auth,
      token: authState.token,
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
      toast,
      showToast,
      cartCount,
      cartSubtotal,
      isInCart,
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
      permanentlyDeleteProduct: permanentlyDeleteProductCb,
      restoreProduct: restoreProductCb,
      toggleProductStatus: toggleProductStatusCb,
      createCategory: (payload) => dispatch(createCategory(payload)),
      updateCategory: (id, payload) => dispatch(updateCategory({ id, payload })),
      deleteCategory: (id) => dispatch(deleteCategory(id)),
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      setCartItems: (items) => dispatch(setCartItems(items)),
      fetchMyOrders: () => dispatch(fetchMyOrders()),
      fetchOrderById: (id) => dispatch(fetchOrderById(id)),
      createOrder: (payload) => dispatch(createOrder(payload)),
      fetchAdminSummary: fetchAdminSummaryCb,
      fetchRevenueAnalytics: fetchRevenueAnalyticsCb,
      fetchInventoryOverview: () => dispatch(fetchInventoryOverview()),
      fetchUsers: (role) => dispatch(fetchUsers(role)),
      saveUser: (id, payload) => dispatch(saveUser({ id, payload })),
      removeUser: (id) => dispatch(removeUser(id)),
      fetchAdminOrders: fetchAdminOrdersCb,
      updateOrderStatus: (id, payload) => dispatch(updateOrderStatus({ id, payload })),
      clearCartMessage: () => dispatch(clearCartMessage()),
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
    toast,
    showToast,
    cartCount,
    cartSubtotal,
    isInCart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    dispatch,
    fetchCategoriesCb,
    fetchBrandsCb,
    fetchProductsCb,
    fetchAdminProductsCb,
    fetchProductBySlugCb,
    createProductCb,
    updateProductCb,
    deleteProductCb,
    permanentlyDeleteProductCb,
    restoreProductCb,
    toggleProductStatusCb,
    fetchAdminSummaryCb,
    fetchRevenueAnalyticsCb,
    fetchAdminOrdersCb,
  ]);
}
