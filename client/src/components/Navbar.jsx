import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';

const navItems = [
  { to: '/', label: 'HOME' },
  { to: '/about', label: 'ABOUT' },
  { to: '/contact', label: 'CONTACT' },
];

const SEARCH_HELPER_TEXT = 'Search products by name, category, or keyword.';

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function getSearchableFields(product) {
  return [
    product?.name,
    product?.categoryName,
    product?.category?.name,
    product?.categorySlug,
    product?.description,
    product?.slug,
    product?.keyword,
    Array.isArray(product?.tags) ? product.tags.join(' ') : '',
  ]
    .map(normalizeText)
    .filter(Boolean)
    .join(' ');
}

function rankProduct(product, query) {
  const searchable = getSearchableFields(product);
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return 0;

  const name = normalizeText(product?.name);
  const category = normalizeText(product?.categoryName || product?.category?.name);
  let score = 0;

  if (name === normalizedQuery) score += 120;
  if (category === normalizedQuery) score += 90;
  if (name.startsWith(normalizedQuery)) score += 70;
  if (category.startsWith(normalizedQuery)) score += 55;
  if (name.includes(normalizedQuery)) score += 40;
  if (category.includes(normalizedQuery)) score += 30;
  if (searchable.includes(normalizedQuery)) score += 20;

  return score;
}

function SearchResultRow({ product, onSelect }) {
  const image = product.thumbnailImage || product.image || product.images?.[0] || '/product-placeholder.svg';
  const category = product.categoryName || product.category?.name || 'Furniture';
  const rating = product.rating !== undefined && product.rating !== null && product.rating !== ''
    ? Number(product.rating).toFixed(1)
    : null;
  const reviews = Number(product.reviews || 0);

  return (
    <Link
      to={`/product/${product.slug}`}
      onClick={onSelect}
      className="group flex items-center gap-3 rounded-2xl border border-[#eadfce] bg-white p-3 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#d9b07c]/60 hover:shadow-[0_12px_28px_rgba(84,59,39,0.08)]"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f7f1e8]">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/product-placeholder.svg';
          }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-600">
              {category}
            </p>
            <h3 className="mt-1 truncate text-sm font-semibold text-[#2c2118] sm:text-[15px]">
              {product.name}
            </h3>
          </div>
          <span className="mt-0.5 inline-flex h-8 shrink-0 items-center rounded-full border border-white/30 bg-black/50 px-2.5 text-[11px] font-semibold text-white shadow-sm">
            {rating ? `${rating}/5` : 'New'}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#7f6b5b]">
          {reviews > 0 ? <span>{reviews} reviews</span> : null}
          {product.price ? <span>{product.price}</span> : null}
        </div>
      </div>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const location = useLocation();
  const { products, adminProducts, fetchProducts, catalogCount, catalogLoading } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  useEffect(() => {
    if (!searchOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;

    const timer = window.setTimeout(() => searchInputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    if (catalogCount && products.length < catalogCount) {
      fetchProducts({ limit: Math.max(catalogCount, 200) });
    }
  }, [searchOpen, catalogCount, products.length, fetchProducts]);

  const mergedProducts = useMemo(() => {
    const seen = new Set();

    return [...products, ...adminProducts].filter((product) => {
      if (!product || product.isDeleted) return false;
      const id = product.id || product._id || product.slug;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [products, adminProducts]);

  const searchResults = useMemo(() => {
    const query = normalizeText(searchQuery);
    if (!query) return [];

    return mergedProducts
      .map((product) => ({
        product,
        score: rankProduct(product, query),
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
      .map((entry) => entry.product);
  }, [mergedProducts, searchQuery]);

  const actionBase = 'inline-flex h-11 items-center justify-center rounded-full border text-sm font-semibold transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30';
  const iconAction = `${actionBase} w-11 border-black/10 bg-white text-text/75 hover:border-primary/40 hover:text-text`;
  const searchResultsToShow = searchResults.slice(0, 8);
  const handleSearchResultSelect = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 w-full border-b border-[#eadfce]/80 bg-white/90 backdrop-blur-xl transition-shadow duration-300 ${scrolled ? 'shadow-[0_12px_36px_rgba(79,56,36,0.10)]' : 'shadow-none'}`}>
      <div className="section-shell relative flex items-center justify-between py-4 sm:py-5 lg:py-5">
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            whileTap={{ scale: 0.96 }}
            className={`${iconAction} md:hidden`}
            onClick={() => setOpen((value) => !value)}
            aria-label="Open menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </motion.button>
          <motion.nav
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden items-center gap-5 xl:flex"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) => (
                    `group relative text-[12px] font-medium uppercase tracking-[0.26em] transition ${isActive ? 'text-primary' : 'text-text/70 hover:text-text'}`
                  )}
                >
                  <span>{item.label}</span>
                  <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-primary/70 transition-transform duration-300 group-hover:scale-x-100" />
                </NavLink>
              </motion.div>
            ))}
          </motion.nav>
        </div>

        <Link
          to="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="Junaid Furniture home"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center justify-center">
            <Logo />
          </motion.div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.12 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="button"
              className={iconAction}
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
            >
              <Search className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-black/5 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <div className="section-shell flex flex-col gap-4 py-5">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium uppercase tracking-[0.22em] text-text/70 transition hover:text-primary"
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px]"
            onPointerDown={(event) => {
              if (event.target === event.currentTarget) {
                setSearchOpen(false);
              }
            }}
          >
            <div className="mx-auto flex h-full w-full max-w-4xl items-start justify-center px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className="relative z-[61] flex w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] border border-[#eadfce] bg-white shadow-[0_24px_80px_rgba(79,56,36,0.18)]"
              >
                <div className="flex items-center gap-3 border-b border-[#f0e6da] px-4 py-4 sm:px-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f1e8] text-[#a27a52]">
                    <Search className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <input
                      ref={searchInputRef}
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search products"
                      aria-label="Search products"
                      className="w-full bg-transparent text-base text-[#2c2118] outline-none placeholder:text-[#9b8b7d]"
                    />
                    <p className="mt-1 text-[11px] leading-4 text-[#8e7c6d]">
                      {SEARCH_HELPER_TEXT}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="relative z-[62] inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-full border border-[#eadfce] text-[#6e5b4d] transition hover:border-[#d9b07c]/60 hover:text-[#2c2118]"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-[min(70vh,42rem)] overflow-y-auto p-4 sm:p-5">
                  {searchQuery.trim() ? (
                    searchResultsToShow.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {searchResultsToShow.map((product) => (
                          <SearchResultRow
                            key={product.id || product._id || product.slug}
                            product={product}
                            onSelect={handleSearchResultSelect}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex min-h-[12rem] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[#eadfce] bg-[#fbf7f2] px-6 py-12 text-center">
                        <p className="text-base font-semibold text-[#2c2118]">No products found</p>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-[#7f6b5b]">
                          Try a different product name, category, or keyword.
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="flex min-h-[12rem] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[#eadfce] bg-[#fbf7f2] px-6 py-12 text-center">
                      <p className="text-base font-semibold text-[#2c2118]">Search the full product catalog</p>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-[#7f6b5b]">
                        Type a product name, category, or keyword to see matching results instantly.
                      </p>
                      {catalogLoading ? (
                        <p className="mt-3 text-xs font-medium uppercase tracking-[0.22em] text-[#a27a52]">
                          Loading catalog...
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
