import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import NotFoundPage from './pages/NotFoundPage';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

// Admin pages
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminBrandsPage = lazy(() => import('./pages/admin/AdminBrandsPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminInventoryPage = lazy(() => import('./pages/admin/AdminInventoryPage'));
const AdminProfilePage = lazy(() => import('./pages/admin/AdminProfilePage'));

// Loading fallback for lazy-loaded components
function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function ShopRedirect() {
  const location = useLocation();
  return <Navigate to={{ pathname: '/', search: location.search }} replace />;
}

// Page title mapping
const PAGE_TITLES = {
  '/': 'Junaid Furniture',
  '/shop': 'Shop | Junaid Furniture',
  '/about': 'About | Junaid Furniture',
  '/categories': 'Categories | Junaid Furniture',
  '/cart': 'Cart | Junaid Furniture',
  '/checkout': 'Checkout | Junaid Furniture',
  '/track-order': 'Order Tracking | Junaid Furniture',
  '/contact': 'Contact | Junaid Furniture',
  '/faq': 'FAQ | Junaid Furniture',
  '/dashboard': 'Dashboard | Junaid Furniture',
  '/login': 'Login | Junaid Furniture',
  '/register': 'Register | Junaid Furniture',
  '/admin': 'Products | Admin | Junaid Furniture',
  '/admin/products': 'Products | Admin | Junaid Furniture',
  '/admin/brands': 'Brands | Admin | Junaid Furniture',
  '/admin/orders': 'Orders | Admin | Junaid Furniture',
  '/admin/categories': 'Categories | Admin | Junaid Furniture',
  '/admin/inventory': 'Inventory | Admin | Junaid Furniture',
  '/admin/reports': 'Products | Admin | Junaid Furniture',
  '/admin/profile': 'Profile | Admin | Junaid Furniture',
};

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Get the base path for title lookup
    const path = location.pathname;
    
    // Handle product details page with dynamic slug
    if (path.startsWith('/product/')) {
      document.title = 'Product | Junaid Furniture';
      return;
    }

    // Use mapped title or default
    const title = PAGE_TITLES[path] || 'Junaid Furniture';
    document.title = title;
  }, [location.pathname]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="product/:slug" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="track-order" element={<OrderTrackingPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route
          path="admin"
          element={(
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          )}
        >
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="reports" element={<Navigate to="/admin/products" replace />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
